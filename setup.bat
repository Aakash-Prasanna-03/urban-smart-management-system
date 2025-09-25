@echo off
echo ========================================
echo UrbanFix Backend Setup Script
echo ========================================
echo.

echo Step 1: Installing backend dependencies...
cd backend
if not exist "node_modules" (
    echo Installing npm packages...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo Backend dependencies installed successfully!
) else (
    echo Backend dependencies already installed.
)

echo.
echo Step 2: Setting up environment file...
if not exist ".env" (
    copy ".env.example" ".env"
    echo Environment file created. Please edit backend/.env with your MongoDB connection string.
) else (
    echo Environment file already exists.
)

echo.
echo Step 3: Installing frontend dependencies...
cd ../frontend
if not exist "node_modules" (
    echo Installing npm packages...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo Frontend dependencies installed successfully!
) else (
    echo Frontend dependencies already installed.
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Make sure MongoDB is running
echo 2. Edit backend/.env file with your MongoDB connection string
echo 3. Start the backend: cd backend && npm run dev
echo 4. Start the frontend: cd frontend && npm run dev
echo 5. Access the app at http://localhost:5173
echo.
echo Backend API will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:5173
echo.
pause