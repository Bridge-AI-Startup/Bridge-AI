const StorageService = require('./StorageService');
// Uncomment when ready to use AWS S3
// const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

/**
 * S3 Storage Service Implementation
 * Stores files in AWS S3 (for production)
 *
 * Setup Instructions:
 * 1. Install AWS SDK: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
 * 2. Set environment variables:
 *    - AWS_REGION (e.g., us-east-1)
 *    - AWS_ACCESS_KEY_ID
 *    - AWS_SECRET_ACCESS_KEY
 *    - AWS_S3_BUCKET_NAME
 *    - AWS_S3_PUBLIC_URL (optional, for CloudFront)
 */
class S3StorageService extends StorageService {
  constructor() {
    super();

    // Validate required environment variables
    this.validateConfig();

    // Initialize S3 client (uncomment when ready to use)
    /*
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    });
    */

    this.bucketName = process.env.AWS_S3_BUCKET_NAME;
    this.region = process.env.AWS_REGION;
    this.publicUrl = process.env.AWS_S3_PUBLIC_URL ||
                    `https://${this.bucketName}.s3.${this.region}.amazonaws.com`;
  }

  validateConfig() {
    const required = [
      'AWS_REGION',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_S3_BUCKET_NAME'
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.warn(
        `S3StorageService: Missing required environment variables: ${missing.join(', ')}\n` +
        'S3 storage will not work until these are configured.'
      );
    }
  }

  /**
   * Upload a file to S3
   * @param {Object} file - Multer file object
   * @param {string} folder - S3 folder/prefix
   * @returns {Promise<Object>}
   */
  async uploadFile(file, folder = 'uploads') {
    try {
      // Generate unique S3 key
      const timestamp = Date.now();
      const randomStr = Math.round(Math.random() * 1E9);
      const ext = file.originalname.split('.').pop();
      const key = `${folder}/${timestamp}-${randomStr}.${ext}`;

      // Prepare upload parameters
      const uploadParams = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer || file.path, // Support both buffer and file path
        ContentType: file.mimetype,
        ACL: 'public-read', // Or 'private' if you want signed URLs
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString()
        }
      };

      // Upload to S3 (uncomment when ready)
      /*
      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);
      */

      // For now, throw error since S3 is not configured
      throw new Error('S3 storage is not yet configured. Please use LOCAL storage for development.');

      // Return standardized response (uncomment when S3 is active)
      /*
      return {
        fileUrl: `${this.publicUrl}/${key}`,
        s3Key: key,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedAt: new Date(),
        storageType: 's3',
        bucket: this.bucketName
      };
      */
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error(`Failed to upload to S3: ${error.message}`);
    }
  }

  /**
   * Delete a file from S3
   * @param {string} s3Key - S3 object key
   * @returns {Promise<boolean>}
   */
  async deleteFile(s3Key) {
    try {
      if (!s3Key) return false;

      // Remove URL prefix if present
      const key = s3Key.replace(this.publicUrl + '/', '');

      // Delete from S3 (uncomment when ready)
      /*
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      await this.s3Client.send(command);
      return true;
      */

      throw new Error('S3 storage is not yet configured.');
    } catch (error) {
      console.error('S3 delete error:', error);
      return false;
    }
  }

  /**
   * Get public URL for an S3 file
   * @param {string} s3Key - S3 object key
   * @returns {string}
   */
  getFileUrl(s3Key) {
    if (!s3Key) return null;

    // If already a full URL, return as is
    if (s3Key.startsWith('http')) {
      return s3Key;
    }

    // Construct public URL
    return `${this.publicUrl}/${s3Key}`;
  }

  /**
   * Get a signed URL for private files (expires in 1 hour by default)
   * @param {string} s3Key - S3 object key
   * @param {number} expiresIn - Expiration time in seconds
   * @returns {Promise<string>}
   */
  async getSignedUrl(s3Key, expiresIn = 3600) {
    try {
      // Generate signed URL (uncomment when ready)
      /*
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
      return signedUrl;
      */

      throw new Error('S3 storage is not yet configured.');
    } catch (error) {
      console.error('S3 signed URL error:', error);
      throw error;
    }
  }

  /**
   * Check if file exists in S3
   * @param {string} s3Key - S3 object key
   * @returns {Promise<boolean>}
   */
  async fileExists(s3Key) {
    try {
      if (!s3Key) return false;

      const key = s3Key.replace(this.publicUrl + '/', '');

      // Check file existence (uncomment when ready)
      /*
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      await this.s3Client.send(command);
      return true;
      */

      throw new Error('S3 storage is not yet configured.');
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get file metadata from S3
   * @param {string} s3Key - S3 object key
   * @returns {Promise<Object>}
   */
  async getFileMetadata(s3Key) {
    try {
      const key = s3Key.replace(this.publicUrl + '/', '');

      // Get metadata (uncomment when ready)
      /*
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      const response = await this.s3Client.send(command);

      return {
        size: response.ContentLength,
        mimeType: response.ContentType,
        lastModified: response.LastModified,
        metadata: response.Metadata
      };
      */

      throw new Error('S3 storage is not yet configured.');
    } catch (error) {
      console.error('S3 metadata error:', error);
      throw error;
    }
  }

  /**
   * Copy file to another location in S3
   * @param {string} sourceKey - Source S3 key
   * @param {string} destKey - Destination S3 key
   * @returns {Promise<Object>}
   */
  async copyFile(sourceKey, destKey) {
    try {
      // Copy object (uncomment when ready)
      /*
      const command = new CopyObjectCommand({
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${sourceKey}`,
        Key: destKey
      });

      await this.s3Client.send(command);

      return {
        success: true,
        newUrl: this.getFileUrl(destKey),
        newKey: destKey
      };
      */

      throw new Error('S3 storage is not yet configured.');
    } catch (error) {
      console.error('S3 copy error:', error);
      throw error;
    }
  }
}

module.exports = S3StorageService;
