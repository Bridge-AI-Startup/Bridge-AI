# API Configuration

This project uses environment variables to configure the backend API URL.

## Setup

1. **Development**: The `.env` file is already configured with the local backend URL:
   ```
   VITE_API_URL=http://localhost:5000
   ```

2. **Production**: Update the `.env` file or set the environment variable in your deployment platform:
   ```
   VITE_API_URL=https://api.yourdomain.com
   ```

## How it works

- The API URL is stored in `VITE_API_URL` environment variable
- The `src/config.js` file exports this value with a fallback
- All components import `API_URL` from `@/config`
- Change the URL in one place (`.env`) and it updates everywhere

## Files

- `.env` - Your local environment configuration (gitignored)
- `.env.example` - Template showing what variables are needed
- `src/config.js` - Exports the API_URL constant

## Usage in components

```javascript
import { API_URL } from "@/config";

const response = await fetch(`${API_URL}/api/endpoint`);
```

That's it! Simple and clean. 🎯
