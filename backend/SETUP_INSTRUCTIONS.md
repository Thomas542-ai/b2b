# Backend Setup Instructions

## Environment Configuration

The backend requires a `.env` file in the `backend/` directory with the following variables:

```env
PORT=8000
SUPABASE_URL=https://fdylcrgqzgtmpehetmjq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTg4OTUsImV4cCI6MjA3MjczNDg5NX0.G7cYqR5Fx-2wCqOdGEY7F-yIDXss2U7lbuMBGPYZ2VE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE1ODg5NSwiZXhwIjoyMDcyNzM0ODk1fQ.0G5DahUWFZiDaUDNe9i4mc319_Ko23CGQljUcmnaTxo
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Steps to Fix 500 Errors

1. **Create the .env file:**
   ```bash
   cd backend
   # Create .env file with the content above
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the backend server:**
   ```bash
   npm run dev
   ```

4. **Verify the server is running:**
   - Check that the server starts without errors
   - Test: `curl http://localhost:8000/api/health`

## Common Issues

- **500 Internal Server Error**: Usually means the backend server is not running or environment variables are missing
- **Connection refused**: Backend server is not started
- **Supabase errors**: Check that the SUPABASE_URL and keys are correct

## Testing Endpoints

Once the server is running, these endpoints should work:
- `GET /api/health` - Health check
- `GET /api/leads` - Get all leads
- `GET /api/campaigns/email` - Get email campaigns
- `GET /api/campaigns/smtp` - Get SMTP configs
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
