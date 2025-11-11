# Contributing to Bridge AI

## Development Guidelines

### API Standards

#### 1. Always use the centralized API_URL
```javascript
import { API_URL } from "@/config";

// Correct ✅
const response = await fetch(`${API_URL}/api/users`);

// Wrong ❌
const response = await fetch('http://localhost:5000/api/users');
```

#### 2. Use fetch() instead of axios
This codebase uses the native Fetch API for consistency:
```javascript
// Correct ✅
const response = await fetch(url, options);
const data = await response.json();

// Wrong ❌
const response = await axios.get(url);
```

#### 3. Port Configuration
- The backend port is NOT hardcoded to 5000
- Port is determined by environment configuration
- Always use `API_URL` from config

### File Structure
- **Controllers** (`server/controllers/`): Business logic for routes
- **Routes** (`server/routes/`): API endpoint definitions
- **Services** (`server/services/`): Reusable services (storage, email, etc.)
- **Models** (`server/models/`): Database schemas

### Authentication
- Tokens stored in `localStorage.getItem('token')`
- Include `Authorization: Bearer ${token}` header for protected routes

### Error Handling
- Use toast notifications for user feedback
- Always check `response.ok` before processing
- Log errors to console for debugging
