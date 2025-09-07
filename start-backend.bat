@echo off
echo Starting LeadsFynder Backend Server...
echo.

REM Check if .env file exists
if not exist "backend\.env" (
    echo ERROR: .env file not found in backend directory!
    echo Please create backend\.env file with the following content:
    echo.
    echo PORT=8000
    echo SUPABASE_URL=https://fdylcrgqzgtmpehetmjq.supabase.co
    echo SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTg4OTUsImV4cCI6MjA3MjczNDg5NX0.G7cYqR5Fx-2wCqOdGEY7F-yIDXss2U7lbuMBGPYZ2VE
    echo SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE1ODg5NSwiZXhwIjoyMDcyNzM0ODk1fQ.0G5DahUWFZiDaUDNe9i4mc319_Ko23CGQljUcmnaTxo
    echo JWT_SECRET=your-jwt-secret-key
    echo JWT_EXPIRES_IN=7d
    echo NODE_ENV=development
    echo FRONTEND_URL=http://localhost:3000
    echo.
    pause
    exit /b 1
)

echo .env file found. Starting server...
echo.

cd backend
npm run dev
