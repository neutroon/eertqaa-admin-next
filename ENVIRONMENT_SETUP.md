# Environment Setup for Eertqaa Dashboard

## Required Environment File

Create a `.env.local` file in the root directory of your project with the following content:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://eertqaa-express.fly.dev/api/v1

# Authentication
NEXT_PUBLIC_APP_ENV=production

# Optional: API timeout in milliseconds (default: 10000)
# NEXT_PUBLIC_API_TIMEOUT=10000
```

## Environment Variables Explanation

- **NEXT_PUBLIC_API_BASE_URL**: The base URL for your production API
- **NEXT_PUBLIC_APP_ENV**: Environment identifier (production/development)
- **NEXT_PUBLIC_API_TIMEOUT**: Request timeout in milliseconds (optional)

## API Endpoints Used

The application uses the following API endpoints:

- `POST /admin/login` - Admin login
- `POST /admin/logout` - Admin logout  
- `POST /admin/refresh` - Token refresh
- `GET /admin/profile` - Get admin profile

## Expected API Response Format

### Login Endpoint (`POST /admin/login`)

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "Admin Name",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "Authentication failed"
}
```

## Features Implemented

✅ **Production API Integration**
- Real API authentication with your backend
- Proper error handling for different HTTP status codes
- Token-based authentication with JWT
- Automatic token refresh capability

✅ **Enhanced Error Handling**
- Arabic error messages for better UX
- Network error detection
- Validation error handling
- Retry suggestions for recoverable errors

✅ **Security Features**
- Secure token storage in localStorage
- Automatic logout on token expiration
- Protected routes with authentication guards
- Request timeout handling

✅ **User Experience**
- Loading states during API calls
- Clear error messages in Arabic
- Automatic redirects after login/logout
- Responsive design for all devices

## Development vs Production

The application automatically uses the production API endpoint specified in your environment variables. For development, you can change the `NEXT_PUBLIC_API_BASE_URL` to point to your local development server.

## Testing the Integration

1. Create the `.env.local` file with the content above
2. Run `pnpm dev` to start the development server
3. Navigate to `/login`
4. Try logging in with valid credentials from your backend
5. Check the browser's Network tab to see API requests
6. Verify that authentication tokens are stored in localStorage

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure your backend allows requests from your frontend domain
2. **Network Errors**: Check if the API endpoint is accessible
3. **Token Issues**: Verify the JWT token format matches your backend implementation
4. **Environment Variables**: Make sure `.env.local` is in the project root and variables start with `NEXT_PUBLIC_`

### Debug Mode:

Open browser console to see detailed error logs for API requests and authentication flow.
