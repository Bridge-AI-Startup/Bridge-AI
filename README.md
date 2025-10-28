# Bridge AI

A full-stack application built with MongoDB, Express, React, and Node.js.

## Project Structure

```
mern-project/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Express backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── server.js        # Entry point
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### 1. Clone the repository and install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Setup Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bridge-db
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Running the Application

### Development Mode

Run both client and server concurrently:

```bash
# Terminal 1 - Start server (from server directory)
cd server
npm run dev

# Terminal 2 - Start client (from client directory)
cd client
npm start
```

The client will run on `http://localhost:3000` and the server on `http://localhost:5000`.

### Production Mode

```bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
```

## Technologies Used

### Frontend
- React 18
- React Router v6
- Axios
- CSS

## License

This project is licensed under the ISC License.
