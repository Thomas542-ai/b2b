@echo off
echo Starting LeadsFynder Backend...
echo.

REM Copy environment file if it doesn't exist
if not exist "backend\.env" (
    if exist "backend\env.local" (
        copy "backend\env.local" "backend\.env"
        echo Environment file created from env.local
    ) else (
        echo Creating default environment file...
        echo PORT=8000 > backend\.env
        echo NODE_ENV=development >> backend\.env
        echo FRONTEND_URL=http://localhost:3000 >> backend\.env
        echo SUPABASE_URL=https://fdylcrgqzgtmpehetmjq.supabase.co >> backend\.env
        echo SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTg4OTUsImV4cCI6MjA3MjczNDg5NX0.G7cYqR5Fx-2wCqOdGEY7F-yIDXss2U7lbuMBGPYZ2VE >> backend\.env
        echo SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkeWxjcmdxemd0bXBlaGV0bWpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE1ODg5NSwiZXhwIjoyMDcyNzM0ODk1fQ.0G5DahUWFZiDaUDNe9i4mc319_Ko23CGQljUcmnaTxo >> backend\.env
        echo JWT_SECRET=leadsfynder-jwt-secret-key-2025 >> backend\.env
        echo JWT_EXPIRES_IN=7d >> backend\.env
    )
)

echo.
echo Starting backend server...
cd backend
npm run dev
