# Authentication & Authorization Guide

Complete guide for Firebase Authentication and Role-Based Access Control in the Bridge AI backend.

## Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Firebase Authentication](#firebase-authentication)
4. [Role System](#role-system)
5. [API Endpoints](#api-endpoints)
6. [Middleware Usage](#middleware-usage)
7. [Request Object](#request-object)
8. [Examples](#examples)
9. [Troubleshooting](#troubleshooting)

## Overview

This backend implements Firebase Authentication with role-based access control (RBAC). Users can sign in with Firebase, and the system automatically determines their role based on whether they're a student (User model) or employer (TeamMember model).

### Features

- ✅ Firebase ID token verification
- ✅ Automatic user creation/update on Firebase sign-in
- ✅ JWT token generation for application use
- ✅ Unified authentication middleware (supports both Firebase and JWT)
- ✅ User profile synchronization with Firebase
- ✅ Role-based access control
- ✅ Account linking support

## Setup

### 1. Install Dependencies

```bash
npm install
```

This installs `firebase-admin` along with other dependencies.

### 2. Firebase Configuration

You need to set up Firebase Admin SDK. There are two options:

#### Option 1: Service Account Key (Recommended for Production)

1. Go to Firebase Console -> Project Settings -> Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Copy the entire JSON content and set it as an environment variable:

```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...",...}
```

**Note:** For production, consider storing this in a secure secret management system rather than environment variables.

#### Option 2: Project ID (For Development)

If you don't have a service account key, you can use just the project ID:

```env
FIREBASE_PROJECT_ID=your-firebase-project-id
```

### 3. Environment Variables

Create a `.env` file in the server directory. See [.env.example](./.env.example) for all available options.

Required variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FIREBASE_SERVICE_ACCOUNT_KEY` or `FIREBASE_PROJECT_ID` - Firebase configuration

## Firebase Authentication

### Authentication Flow

1. User signs in with Firebase on the client
2. Client receives Firebase ID token
3. Client sends ID token to `/api/auth/firebase/signin`
4. Server verifies token with Firebase Admin SDK
5. Server checks if user exists in database:
   - Checks TeamMember collection first (employer)
   - If not found, checks User collection (student)
   - If not found, creates new User with default role: 'user'
6. Server generates JWT token for the application
7. Server returns user data and tokens

### Token Verification

The server verifies Firebase ID tokens using the Firebase Admin SDK. Tokens are validated for:
- Expiration
- Signature
- Issuer
- Audience

## Role System

### Application-Level Roles

The system has two application-level roles:

1. **user** (student/candidate)
   - Model: `User`
   - Field: `User.role = 'user'`
   - Default role for all users
   - Can access student-specific features
   - Can apply to jobs, take assessments, etc.

2. **employer** (company team member)
   - Model: `TeamMember`
   - All team members have application role: 'employer'
   - Can access employer-specific features
   - Can create jobs, manage applications, etc.

### Company-Level Roles (for Employers)

Employers have an additional company-level role:

- **'admin'** (employer admin)
  - Field: `TeamMember.companyRole = 'admin'`
  - Company-level administrative privileges
  - Can manage company settings, team members, etc.

- **'member'** (regular employer)
  - Field: `TeamMember.companyRole = 'member'`
  - Basic employer privileges
  - Can create jobs, manage applications, etc.

### Database Schema

#### User Model

```javascript
{
  uid: String,           // Firebase UID (primary identifier)
  email: String,         // User email
  name: String,          // User name
  role: {
    type: String,
    enum: ['user'],      // Only 'user' role (students/candidates)
    default: 'user'
  },
  // ... other fields
}
```

#### TeamMember Model

```javascript
{
  uid: String,           // Firebase UID (primary identifier)
  email: String,         // Team member email
  companyId: ObjectId,   // Reference to Company
  companyRole: {
    type: String,
    enum: ['admin', 'member'],  // Company-level role
    default: 'member'
  },
  // ... other fields
}
```

## API Endpoints

### 1. Firebase Sign-In

**POST** `/api/auth/firebase/signin`

Verify Firebase ID token and create/update user in database.

**Request Body:**
```json
{
  "idToken": "firebase-id-token-from-client"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Firebase authentication successful",
  "data": {
    "user": {
      "uid": "firebase-uid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "user" | "employer",
      "companyRole": "admin" | "member",  // Only for employers
      "isEmployerAdmin": true | false,     // Only for employers
      "emailVerified": true
    },
    "token": "jwt-token-for-application",
    "firebaseToken": "firebase-id-token",
    "role": "user" | "employer",
    "userType": "student" | "employer"
  }
}
```

### 2. Verify Firebase Token

**POST** `/api/auth/firebase/verify`

Verify a Firebase ID token without creating/updating user.

**Request Body:**
```json
{
  "idToken": "firebase-id-token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "uid": "firebase-uid",
    "email": "user@example.com",
    "emailVerified": true,
    "name": "User Name",
    "picture": "https://..."
  }
}
```

### 3. Get Current User

**GET** `/api/auth/me`

Get current authenticated user (requires Firebase token in Authorization header).

**Headers:**
```
Authorization: Bearer <firebase-id-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uid": "firebase-uid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user" | "employer",
    "userType": "student" | "employer",
    "companyRole": "admin" | "member",  // Only for employers
    "isEmployerAdmin": true | false      // Only for employers
  }
}
```

### 4. Link Firebase Account

**POST** `/api/auth/firebase/link`

Link Firebase account to existing user (requires Firebase token).

**Headers:**
```
Authorization: Bearer <firebase-id-token>
```

**Request Body:**
```json
{
  "idToken": "firebase-id-token-to-link"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Firebase account linked successfully",
  "data": {
    "uid": "firebase-uid",
    "email": "user@example.com",
    "role": "user" | "employer"
  }
}
```

## Middleware Usage

### 1. Authentication Middleware

Use `authMiddleware` to require authentication (any role):

```javascript
const authMiddleware = require('../middleware/auth');

router.get('/protected', authMiddleware, (req, res) => {
  // req.user contains user information including role
  res.json({ user: req.user });
});
```

### 2. Role-Based Middleware

Use role middleware to restrict access to specific roles:

```javascript
const { requireRole, requireEmployer, requireUser } = require('../middleware/roles');

// Employer only
router.get('/employer-only', authMiddleware, requireEmployer, handler);

// User (student) only
router.get('/user-only', authMiddleware, requireUser, handler);

// Custom roles
router.get('/custom', authMiddleware, requireRole(['employer']), handler);
```

### Available Role Middleware

- `requireEmployer` - Requires 'employer' role
- `requireUser` - Requires 'user' role
- `requireRole(roles)` - Custom role requirement (single role or array)

### 3. Employer Admin Check

To check for employer admin within a route:

```javascript
router.get('/employer-admin-route', authMiddleware, requireEmployer, (req, res) => {
  // Additional check for employer admin
  if (req.user.companyRole !== 'admin') {
    return res.status(403).json({ 
      message: 'Employer admin privileges required' 
    });
  }
  
  // Employer admin only logic
  res.json({ message: 'Employer admin access' });
});
```

## Request Object (req.user)

After authentication, `req.user` contains:

### For Employers (TeamMember)

```javascript
{
  userId: ObjectId,        // Database user ID
  uid: String,            // Firebase UID
  email: String,          // User email
  role: 'employer',       // Application role
  userType: 'employer',   // User type
  companyId: ObjectId,    // Company ID
  companyRole: 'admin' | 'member',  // Company-level role
  isEmployerAdmin: Boolean,         // Employer admin flag
  authType: 'firebase' | 'jwt',    // Authentication type
}
```

### For Users (Student/Candidate)

```javascript
{
  userId: ObjectId,       // Database user ID
  uid: String,           // Firebase UID
  email: String,         // User email
  role: 'user',          // Application role
  userType: 'student',   // User type
  authType: 'firebase' | 'jwt',  // Authentication type
}
```

## Examples

### Student Routes

```javascript
// Student dashboard
router.get('/student/dashboard', authMiddleware, requireUser, (req, res) => {
  // Only students can access
  res.json({ message: 'Student dashboard' });
});

// Student applications
router.get('/student/applications', authMiddleware, requireUser, (req, res) => {
  // Only students can access
  res.json({ applications: [] });
});
```

### Employer Routes

```javascript
// Employer dashboard
router.get('/employer/dashboard', authMiddleware, requireEmployer, (req, res) => {
  // Only employers can access
  const { companyId } = req.user;
  // Use companyId to filter data
  res.json({ message: 'Employer dashboard', companyId });
});

// Create job (employers only)
router.post('/employer/jobs', authMiddleware, requireEmployer, (req, res) => {
  // Only employers can create jobs
  res.json({ message: 'Job created' });
});

// Employer admin only route
router.get('/employer/admin/settings', authMiddleware, requireEmployer, (req, res) => {
  if (req.user.companyRole !== 'admin') {
    return res.status(403).json({ message: 'Employer admin required' });
  }
  // Employer admin only
  res.json({ message: 'Admin settings' });
});
```

### Shared Routes

```javascript
// Profile (all authenticated users)
router.get('/profile', authMiddleware, (req, res) => {
  // All authenticated users can access
  res.json({ user: req.user });
});
```

## Frontend Integration

### 1. Install Firebase SDK on Client

```bash
npm install firebase
```

### 2. Initialize Firebase on Client

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```

### 3. Sign In with Firebase

```javascript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);
const idToken = await result.user.getIdToken();

// Send token to backend
const response = await fetch('http://localhost:5000/api/auth/firebase/signin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ idToken }),
});

const data = await response.json();
// Store JWT token from response
localStorage.setItem('token', data.data.token);
```

### 4. Use Token for Authenticated Requests

```javascript
const token = await auth.currentUser.getIdToken();

const response = await fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## Error Handling

### Common Errors

#### Unauthorized (401)
```json
{
  "success": false,
  "message": "Authentication required"
}
```

#### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied. Required role(s): employer. Your role: user"
}
```

#### Token Expired (401)
```json
{
  "success": false,
  "message": "Firebase token has expired"
}
```

#### Invalid Token (401)
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

## Troubleshooting

### Firebase Admin SDK Not Initialized

- Check that `FIREBASE_SERVICE_ACCOUNT_KEY` or `FIREBASE_PROJECT_ID` is set
- Verify the service account key JSON is valid
- Check Firebase project settings

### Token Verification Fails

- Ensure the token is not expired
- Verify Firebase project ID matches
- Check that Firebase Authentication is enabled in Firebase Console

### User Not Found

- Verify user exists in MongoDB
- Check that `uid` or `email` matches Firebase token
- Ensure database connection is working

### Role Not Found

- Ensure `authMiddleware` is applied before role middleware
- Check that user exists in database
- Verify JWT token contains role information

### Access Denied Errors

- Check user's role in database
- Verify role middleware is correctly applied
- Check token is valid and not expired

## Security Considerations

1. **Service Account Key**: Store securely, never commit to version control
2. **JWT Secret**: Use a strong, random secret in production
3. **Token Expiration**: Firebase tokens expire after 1 hour, refresh as needed
4. **CORS**: Configure CORS properly for your frontend domain
5. **HTTPS**: Use HTTPS in production to protect tokens in transit
6. **Company Filtering**: For employers, filter data by companyId to prevent cross-company access

## Testing

### Test Firebase Sign-In

```bash
curl -X POST http://localhost:5000/api/auth/firebase/signin \
  -H "Content-Type: application/json" \
  -d '{"idToken":"your-firebase-id-token"}'
```

### Test Protected Route

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer your-firebase-id-token"
```

### Test Role-Based Route

```bash
curl -X GET http://localhost:5000/api/employer/jobs \
  -H "Authorization: Bearer your-firebase-id-token"
```

## Additional Resources

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [JWT Documentation](https://jwt.io/)
- [Environment Variables](./.env.example)

