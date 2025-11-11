# Storage Service Migration Guide

## Overview

The storage system uses a **Strategy Pattern** to abstract file storage operations. This allows you to seamlessly switch between Local Storage (for development) and AWS S3 (for production) without changing any application code.

## Current Setup (Development)

Currently, the system uses **Local Storage** which stores files in the `server/uploads/` directory.

### Configuration
```env
# .env file (Development)
STORAGE_TYPE=local
BASE_URL=http://localhost:5000
```

## Migrating to AWS S3 (Production)

### Step 1: Install AWS SDK

```bash
cd server
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Step 2: Set Up AWS S3 Bucket

1. Log in to AWS Console
2. Navigate to S3
3. Create a new bucket (e.g., `bridge-ai-uploads`)
4. Configure bucket settings:
   - **Public Access**: Block all public access (recommended) OR allow public read for direct file access
   - **Versioning**: Enable (optional but recommended)
   - **Encryption**: Enable server-side encryption
   - **CORS Configuration** (if accessing from frontend):
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["https://yourdomain.com"],
       "ExposeHeaders": []
     }
   ]
   ```

### Step 3: Create IAM User and Policy

1. Go to IAM → Users → Create User
2. Create with programmatic access
3. Attach policy (create custom policy):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::bridge-ai-uploads/*",
        "arn:aws:s3:::bridge-ai-uploads"
      ]
    }
  ]
}
```

4. Save the **Access Key ID** and **Secret Access Key**

### Step 4: Update Environment Variables

```env
# .env file (Production)
STORAGE_TYPE=s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET_NAME=bridge-ai-uploads
AWS_S3_PUBLIC_URL=https://bridge-ai-uploads.s3.us-east-1.amazonaws.com
# Or use CloudFront URL:
# AWS_S3_PUBLIC_URL=https://d1234567890.cloudfront.net
```

### Step 5: Uncomment S3 Code

Open `server/services/storage/S3StorageService.js` and uncomment:

1. AWS SDK imports (lines 3-4)
2. S3 client initialization (lines 26-33)
3. All S3 operation code blocks (marked with `/* ... */`)
4. Remove the temporary error throws

### Step 6: Test the Migration

```bash
# Set environment to use S3
export STORAGE_TYPE=s3

# Restart server
npm run dev
```

### Step 7: Migrate Existing Files (Optional)

If you have existing files in local storage that need to be migrated to S3:

```javascript
// Create a migration script: server/scripts/migrateToS3.js
const LocalStorageService = require('../services/storage/LocalStorageService');
const S3StorageService = require('../services/storage/S3StorageService');
const User = require('../models/User');
const fs = require('fs');

async function migrateUserFiles() {
  const localService = new LocalStorageService();
  const s3Service = new S3StorageService();

  const users = await User.find({});

  for (const user of users) {
    // Migrate resume
    if (user.resume && user.resume.filePath) {
      const localPath = `server/uploads/${user.resume.filePath}`;
      if (fs.existsSync(localPath)) {
        const file = {
          buffer: fs.readFileSync(localPath),
          originalname: user.resume.fileName,
          mimetype: user.resume.mimeType,
          size: user.resume.fileSize
        };

        const result = await s3Service.uploadFile(file, 'resumes');
        user.resume.fileUrl = result.fileUrl;
        user.resume.s3Key = result.s3Key;
      }
    }

    // Migrate project files
    if (user.projects && user.projects.length > 0) {
      for (const project of user.projects) {
        if (project.files && project.files.length > 0) {
          for (const file of project.files) {
            const localPath = `server/uploads/${file.s3Key}`;
            if (fs.existsSync(localPath)) {
              const fileData = {
                buffer: fs.readFileSync(localPath),
                originalname: file.fileName,
                mimetype: file.mimeType,
                size: file.fileSize
              };

              const result = await s3Service.uploadFile(
                fileData,
                `projects/${user._id}`
              );
              file.fileUrl = result.fileUrl;
              file.s3Key = result.s3Key;
            }
          }
        }
      }
    }

    await user.save();
    console.log(`Migrated files for user: ${user.email}`);
  }

  console.log('Migration complete!');
}

// Run migration
migrateUserFiles().catch(console.error);
```

Run the migration:
```bash
node server/scripts/migrateToS3.js
```

## CloudFront Distribution (Optional but Recommended)

For better performance and CDN caching:

1. Create CloudFront distribution
2. Set origin to your S3 bucket
3. Update `AWS_S3_PUBLIC_URL` to CloudFront URL
4. Configure cache behaviors and SSL certificate

## Switching Between Storage Types

Simply change the environment variable:

```bash
# Use local storage
export STORAGE_TYPE=local

# Use S3
export STORAGE_TYPE=s3
```

No code changes required! The StorageFactory automatically selects the correct service.

## Storage Service API

Both services implement the same interface:

```javascript
// Upload a file
const result = await storageService.uploadFile(file, 'folder');
// Returns: { fileUrl, s3Key/filePath, fileName, fileSize, mimeType, uploadedAt }

// Delete a file
await storageService.deleteFile(fileKey);

// Get file URL
const url = storageService.getFileUrl(fileKey);

// Check if file exists
const exists = await storageService.fileExists(fileKey);

// Get file metadata
const metadata = await storageService.getFileMetadata(fileKey);
```

## Best Practices

1. **Always use the abstraction layer** - Never access files directly
2. **Store the s3Key/filePath** - Required for deletion and updates
3. **Handle errors gracefully** - Storage operations can fail
4. **Use signed URLs for private files** - When using S3 with private buckets
5. **Implement cleanup routines** - Delete orphaned files periodically
6. **Monitor costs** - S3 charges for storage and requests
7. **Use lifecycle policies** - Automatically delete old files or move to cheaper storage

## Troubleshooting

### Error: "AWS SDK not found"
- Run `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`

### Error: "Access Denied"
- Check IAM permissions
- Verify bucket policy
- Ensure correct AWS credentials

### Files not accessible
- Check bucket public access settings
- Verify CORS configuration
- Use signed URLs for private files

### High costs
- Enable S3 lifecycle policies
- Use CloudFront for caching
- Clean up old/unused files
- Consider S3 Intelligent-Tiering

## Environment Variables Reference

### Local Storage
```env
STORAGE_TYPE=local
BASE_URL=http://localhost:5000  # Or your production URL
```

### S3 Storage
```env
STORAGE_TYPE=s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_S3_PUBLIC_URL=https://your-bucket.s3.amazonaws.com
# Optional: CloudFront URL
# AWS_S3_PUBLIC_URL=https://d1234567890.cloudfront.net
```

## Cost Estimation

### AWS S3 Pricing (us-east-1, as of 2024)
- Storage: $0.023/GB/month (first 50TB)
- PUT requests: $0.005 per 1,000 requests
- GET requests: $0.0004 per 1,000 requests
- Data transfer out: $0.09/GB (after first 1GB free)

### Example Monthly Cost
For 1000 users with:
- 1 resume (500KB each) = 500MB storage
- 2 projects with 3 files (1MB each) = 6GB storage
- 10,000 file uploads/month
- 50,000 file downloads/month

**Estimated cost**: ~$0.30/month

With CloudFront CDN: Add ~$0.085/GB for data transfer = ~$0.50/month total

## Support

For issues or questions:
1. Check AWS CloudWatch logs
2. Review S3 bucket metrics
3. Verify IAM permissions
4. Check application logs for errors
