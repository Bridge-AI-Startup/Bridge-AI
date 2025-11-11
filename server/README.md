# Bridge AI Backend Server

Backend server for the Bridge AI platform, built with Node.js, Express, MongoDB, and Firebase Authentication.

## 📚 Documentation

### Quick Links

- **[Authentication Guide](./AUTHENTICATION.md)** - Complete authentication and authorization documentation
- **[API Routes](./routes/)** - API route handlers
- **[Database Models](./models/README.md)** - Database schema documentation
- **[Environment Setup](./.env.example)** - Environment variables configuration

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FIREBASE_SERVICE_ACCOUNT_KEY` or `FIREBASE_PROJECT_ID` - Firebase configuration

See [.env.example](./.env.example) for all available options.

### 3. Start the Server

```bash
# Development
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `PORT`).

## 📁 Project Structure

```
server/
├── config/           # Configuration files
│   ├── firebase.js   # Firebase Admin SDK setup
│   └── db.js         # Database configuration
├── controllers/      # Route controllers
│   ├── authController.js
│   └── userController.js
├── middleware/       # Express middleware
│   ├── auth.js       # Unified authentication middleware
│   ├── firebaseAuth.js  # Firebase token verification
│   └── roles.js      # Role-based access control
├── models/           # Mongoose models
│   ├── User.js       # User (student/candidate) model
│   ├── TeamMember.js # Team member (employer) model
│   └── ...
├── routes/           # API routes
│   ├── authRoutes.js # Authentication routes
│   └── userRoutes.js # User routes
└── server.js         # Main server file
```

## 🔐 Authentication & Authorization

This server supports Firebase Authentication with role-based access control:

### Roles

- **user** - Students/candidates (User model)
- **employer** - Company team members (TeamMember model)
  - `companyRole: 'admin'` - Employer admin (company admin)
  - `companyRole: 'member'` - Regular employer

### Key Features

- Firebase ID token verification
- Automatic user creation/update
- JWT token generation
- Role-based route protection
- Support for both Firebase and JWT tokens

For detailed authentication documentation, see [AUTHENTICATION.md](./AUTHENTICATION.md).

## 📡 API Endpoints

### Authentication

- `POST /api/auth/firebase/signin` - Sign in with Firebase
- `POST /api/auth/firebase/verify` - Verify Firebase token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/firebase/link` - Link Firebase account

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🛠️ Technologies

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Firebase Admin SDK** - Firebase authentication
- **JWT** - JSON Web Tokens
- **dotenv** - Environment variable management

## 📝 Environment Variables

See [.env.example](./.env.example) for complete environment variable documentation.

### Required

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `FIREBASE_SERVICE_ACCOUNT_KEY` or `FIREBASE_PROJECT_ID` - Firebase configuration

### Optional

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (default: development)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

## 🔒 Security

- JWT tokens for API authentication
- Firebase token verification
- Role-based access control
- Environment variable protection
- Password hashing (for email/password auth)
- CORS configuration

## 📖 Additional Documentation

- [Authentication Guide](./AUTHENTICATION.md) - Complete auth documentation
- [Database Models](./models/README.md) - Schema documentation
- [API Routes](./routes/) - Route handlers

## 🤝 Contributing

1. Follow the existing code style
2. Update documentation for new features
3. Test your changes
4. Ensure environment variables are documented

## 📄 License

[Your License Here]

Adi notes:
port 5173 no auth
port 5174 auth pipelines
port 3667 server
/logout to log out on auth pipelines
fix firebase creating an account even when sign in fails error
fix profile picture error on profile screen