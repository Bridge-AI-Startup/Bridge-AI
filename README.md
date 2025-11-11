# Bridge AI

<div align="center">

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-7.0-green.svg)

**A modern hiring platform connecting students with employers through AI-powered matching and streamlined recruitment workflows.**

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [API Documentation](#api-documentation) • [Contributing](#contributing)

</div>

---

## Overview

Bridge AI is a full-stack web application that revolutionizes the hiring process by connecting university students with employers. The platform features dual authentication flows, company management, candidate tracking, and a comprehensive admin console for development.

### Key Highlights

- **Dual Authentication System**: Separate flows for students and employers with Firebase + JWT
- **Firebase Integration**: Secure authentication with Email/Password and Google OAuth
- **Company Management**: Multi-user company accounts with admin and member roles
- **Smart Candidate Tracking**: Waitlist and application management
- **Admin Console**: Development tool for database management and monitoring
- **Modern UI**: Built with TailwindCSS, shadcn/ui, and Framer Motion

---

## Features

### For Students

- **Easy Sign Up**: Register with `.edu` email or Google OAuth
- **Profile Creation**: Build comprehensive student profiles
- **Job Discovery**: Browse and apply to company postings
- **Application Tracking**: Monitor application status in real-time

### For Employers

- **Company Onboarding**: Create company profiles with branding
- **Team Management**: Invite team members with role-based access (admin/member)
- **Candidate Pipeline**: Review and manage applications
- **Invite System**: Invite team members via email with secure tokens

### Platform Features

- **Secure Authentication**: Firebase Auth + JWT token system
- **Role-Based Access**: Students, employers, and company admins
- **Waitlist System**: Manage early access and registrations
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Mobile-first, fully responsive UI
- **Development Tools**: Admin console for database management

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| Vite | 5.4.2 | Build tool and dev server |
| React Router | 7.1.1 | Client-side routing |
| TailwindCSS | 3.4.17 | Utility-first styling |
| shadcn/ui | Latest | Component library (Radix UI) |
| Framer Motion | 11.15.0 | Animations |
| Firebase | 11.1.0 | Authentication |
| Lucide React | 0.469.0 | Icon library |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express | 4.21.2 | Web framework |
| MongoDB | 7.0+ | Database |
| Mongoose | 8.9.4 | ODM for MongoDB |
| Firebase Admin | 13.0.2 | Server-side auth verification |
| JWT | 9.0.2 | Token generation |
| bcryptjs | 2.4.3 | Password hashing |
| cors | 2.8.5 | CORS middleware |
| dotenv | 16.4.7 | Environment variables |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** 7.0+ (local or Atlas)
- **Firebase Project** with Authentication enabled
- **npm** or **yarn**

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Bridge AI"
```

#### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

#### 3. Configure Environment Variables

##### Server Configuration

Create `server/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/bridge-db
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bridge-db

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_key_here_change_in_production

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

##### Client Configuration

Create `client/.env`:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Firebase Configuration (from Firebase Console)
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

#### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → **Email/Password** and **Google** providers
4. Go to **Project Settings** → **Service Accounts**
5. Click **Generate New Private Key** and save the JSON file
6. Extract the values for `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, and `FIREBASE_CLIENT_EMAIL`
7. Go to **Project Settings** → **General** to get the web app configuration for client `.env`

### Running the Application

#### Development Mode

```bash
# Terminal 1 - Start server (from server directory)
cd server
npm run dev

# Terminal 2 - Start client (from client directory)
cd client
npm run dev
```

- Client: [http://localhost:5173](http://localhost:5173)
- Server: [http://localhost:5000](http://localhost:5000)
- Admin Console: [http://localhost:5000/api/admin/console](http://localhost:5000/api/admin/console) (dev only)

#### Production Mode

```bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
```

---

## Project Structure

```
Bridge AI/
├── client/                      # React frontend (Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── navigation/   # Header, navigation
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── lib/             # Utilities and helpers
│   │   │   ├── auth.js      # Firebase auth functions
│   │   │   ├── firebase.js  # Firebase config
│   │   │   └── utils.js     # General utilities
│   │   ├── pages/           # Page components
│   │   │   ├── StudentSignup.jsx
│   │   │   ├── StudentSignIn.jsx
│   │   │   ├── EmployerSignup.jsx
│   │   │   ├── EmployerSignIn.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   └── ...
│   │   ├── config.js        # App configuration
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── .env                 # Environment variables
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # TailwindCSS config
│   └── package.json
│
├── server/                   # Express backend
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── controllers/
│   │   └── authController.js # Auth logic
│   ├── middleware/
│   │   ├── auth.js          # JWT middleware
│   │   └── firebaseAuth.js  # Firebase verification
│   ├── models/
│   │   ├── User.js          # Student model
│   │   ├── TeamMember.js    # Employer model
│   │   ├── Company.js       # Company model
│   │   ├── Waitlist.js      # Waitlist model
│   │   └── index.js         # Model exports
│   ├── routes/
│   │   ├── authRoutes.js    # Authentication routes
│   │   ├── userRoutes.js    # User routes
│   │   ├── waitlistRoutes.js # Waitlist routes
│   │   └── adminRoutes.js   # Admin console routes
│   ├── .env                 # Environment variables
│   ├── server.js            # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/student/signup` | Register new student | No |
| POST | `/api/auth/student/signin` | Student login | No |
| POST | `/api/auth/employer/signup` | Register new employer + company | No |
| POST | `/api/auth/employer/signin` | Employer login | No |
| POST | `/api/auth/firebase/verify` | Verify Firebase token | No |
| GET | `/api/auth/me` | Get current user | Yes (Firebase) |
| POST | `/api/auth/firebase/link` | Link Firebase account | Yes (Firebase) |

### Waitlist Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/waitlist` | Join waitlist | No |
| GET | `/api/waitlist` | Get all waitlist entries | Yes |

### Admin Console (Development Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/console` | Admin UI dashboard |
| GET | `/api/admin/stats` | Database statistics |
| GET | `/api/admin/users` | List all students |
| GET | `/api/admin/employers` | List all employers |
| GET | `/api/admin/companies` | List all companies |
| DELETE | `/api/admin/users/:id` | Delete specific user |
| DELETE | `/api/admin/employers/:id` | Delete specific employer |
| DELETE | `/api/admin/companies/:id` | Delete specific company |
| POST | `/api/admin/clear/auth` | Clear all auth data |
| POST | `/api/admin/clear/:type` | Clear specific collection |

---

## Authentication Flow

### Student Signup Flow

```
1. User fills out signup form with .edu email
2. Frontend creates Firebase user (Email/Password or Google)
3. Frontend gets Firebase ID token
4. Frontend sends ID token + profile data to backend
5. Backend verifies Firebase token with Firebase Admin SDK
6. Backend creates User document in MongoDB
7. Backend generates JWT token
8. Frontend stores JWT + user data in localStorage
9. User redirected to Onboarding

⚠️ Security: If step 4-6 fails, Firebase user is deleted to prevent orphans
```

### Employer Signup Flow

```
1. User fills out signup form with company details
2. Frontend creates Firebase user (Email/Password or Google)
3. Frontend gets Firebase ID token
4. Frontend sends ID token + company data to backend
5. Backend verifies Firebase token
6. Backend creates Company document
7. Backend creates TeamMember document (linked to company)
8. Backend generates JWT token
9. Frontend stores JWT + user + company data in localStorage
10. User redirected to EmployerOnboarding or Dashboard

⚠️ Security: If step 4-8 fails, Firebase user is deleted
```

### Role System

- **Students**: `User` model with `role: 'user'`
- **Employers**: `TeamMember` model with `companyRole: 'admin'` or `'member'`
- **Company Admins**: TeamMembers with `companyRole: 'admin'` (can invite others)

---

## Development Tools

### Admin Console

Access the admin console at [http://localhost:5000/api/admin/console](http://localhost:5000/api/admin/console) (only in development mode).

Features:
- **Dashboard Statistics**: Real-time counts for students, employers, companies
- **Data Tables**: View all database entries with details
- **Individual Deletes**: Remove specific entries with one click
- **Bulk Operations**: Clear entire collections or all auth data
- **Security**: Automatically disabled in production (`NODE_ENV=production`)

---

## Database Schema

### User (Student) Model

```javascript
{
  firebaseUid: String (required, unique),
  email: String (required, unique),
  name: String (required),
  university: String,
  role: String (default: 'user'),
  profileComplete: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### TeamMember (Employer) Model

```javascript
{
  firebaseUid: String (required, unique),
  email: String (required, unique),
  firstName: String (required),
  lastName: String,
  company: ObjectId (ref: 'Company'),
  companyRole: String ['admin', 'member'] (default: 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

### Company Model

```javascript
{
  companyId: String (required, unique),
  companyName: String (required),
  companyWebsite: String,
  industry: String,
  teamMembers: [ObjectId] (ref: 'TeamMember'),
  createdAt: Date,
  updatedAt: Date
}
```

### Waitlist Model

```javascript
{
  email: String (required, unique),
  name: String,
  userType: String ['student', 'employer'],
  submittedAt: Date (default: now)
}
```

---

## Troubleshooting

### Common Issues

**Firebase Authentication Errors**

```
Error: Firebase configuration not found
```
- Ensure all `VITE_FIREBASE_*` variables are set in `client/.env`
- Check Firebase console for correct configuration values

**Database Connection Failed**

```
Error: MongoServerError: Authentication failed
```
- Verify `MONGODB_URI` in `server/.env`
- Ensure MongoDB service is running
- Check MongoDB Atlas IP whitelist (if using Atlas)

**CORS Errors**

```
Error: CORS policy blocked
```
- Ensure server is running on port 5000
- Check `VITE_API_URL` in `client/.env`
- Verify CORS is enabled in `server/server.js`

**Admin Console Not Loading**

```
Error: 404 Not Found
```
- Admin console only works in development mode
- Check `NODE_ENV=development` in `server/.env`
- Ensure you're accessing [http://localhost:5000/api/admin/console](http://localhost:5000/api/admin/console)

**Firebase User Orphaning**

- This has been fixed with cleanup logic
- If backend signup fails, Firebase user is automatically deleted
- Check browser console for detailed error messages

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

#### API Configuration

**Always use the centralized API_URL:**

```javascript
import { API_URL } from "@/config";

// ✅ Correct
const response = await fetch(`${API_URL}/api/users`, options);

// ❌ Wrong - never hardcode URLs or ports
const response = await fetch('http://localhost:5000/api/users', options);
```

**Why?**
- Port may vary by environment (not always 5000)
- API_URL is configured per environment (dev/staging/production)
- Ensures consistency across the codebase

#### HTTP Client

**Use native `fetch()` API, not axios:**

```javascript
// ✅ Correct - Use fetch
const response = await fetch(`${API_URL}/api/endpoint`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
});

const result = await response.json();

if (!response.ok) {
  throw new Error(result.message || "Request failed");
}

// ❌ Wrong - Don't use axios
const response = await axios.post(url, data);
```

**File uploads with FormData:**

```javascript
const formData = new FormData();
formData.append('field', value);
formData.append('file', fileObject);

const response = await fetch(`${API_URL}/api/upload`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    // Don't set Content-Type - browser sets it with multipart boundary
  },
  body: formData,
});
```

#### Backend Architecture

- **Controllers** (`server/controllers/`): Handle business logic for routes
- **Routes** (`server/routes/`): Define API endpoints with middleware
- **Services** (`server/services/`): Reusable business logic (storage, email, etc.)
- **Direct backend calls**: Don't create client API wrappers (except legacy `userAPI`)

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Test authentication flows thoroughly
- Ensure Firebase user cleanup works correctly
- Update README if adding new features or endpoints
- Use `fetch()` instead of `axios` for HTTP requests
- Import `API_URL` from `@/config` instead of hardcoding URLs

---

## License

This project is licensed under the ISC License.

---

## Support

For issues, questions, or contributions, please open an issue on GitHub.

Built with ❤️ using React, Node.js, MongoDB, and Firebase
