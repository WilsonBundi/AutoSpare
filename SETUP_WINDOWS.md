# Setup Guide for Windows

## Step 1: Install PostgreSQL

### Download PostgreSQL
1. Go to: https://www.postgresql.org/download/windows/
2. Download the latest version (PostgreSQL 16 or higher)
3. Run the installer

### Installation Steps
1. Click "Next" through the installer
2. **Important**: Remember the password you set for the `postgres` user
3. Keep all default settings (port 5432)
4. Install pgAdmin 4 (optional but recommended)
5. Click "Finish" when done

### Create Database
1. Open pgAdmin 4 (installed with PostgreSQL)
2. Right-click on "Databases" → "Create" → "Database"
3. Name it: `autospare_pos`
4. Click "Save"

### Run Schema
1. Open pgAdmin 4
2. Connect to the server with the postgres user
3. Select the `autospare_pos` database
4. Click "Tools" → "Query Tool"
5. Open `database/schema.sql` from the project
6. Paste the SQL code and click "Execute"
7. (Optional) Do the same for `database/seed.sql`

---

## Step 2: Install Node.js

### Download Node.js
1. Go to: https://nodejs.org/
2. Download the LTS version (v18 or higher)
3. Run the installer
4. Click "Next" through all steps
5. Restart your computer after installation

---

## Step 3: Start the Backend

1. Open Command Prompt or PowerShell
2. Navigate to project directory:
   ```bash
   cd "C:\Projects\AUTOSPARE POS"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Configure environment:
   ```bash
   copy .env.example .env
   ```

5. Edit `.env` file (open in Notepad):
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=autospare_pos
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   JWT_SECRET=your_jwt_secret_here
   ```

6. Start backend:
   ```bash
   npm run dev
   ```

Backend will run on: http://localhost:5000

---

## Step 4: Start the Frontend

1. Open a new Command Prompt or PowerShell
2. Navigate to frontend directory:
   ```bash
   cd "C:\Projects\AUTOSPARE POS\frontend"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start frontend:
   ```bash
   npm run dev
   ```

Frontend will run on: http://localhost:5173

---

## Step 5: Access the Application

1. Open browser
2. Go to: http://localhost:5173
3. Login with:
   - Username: `admin`
   - Password: `admin123`

---

## Alternative: Use Cloud Database

If you don't want to install PostgreSQL locally:

### ElephantSQL (Free Cloud PostgreSQL)
1. Go to: https://www.elephantsql.com/
2. Sign up for free account
3. Create a new database
4. Get connection string
5. Update `.env` with cloud database credentials

### Supabase (Free Cloud PostgreSQL)
1. Go to: https://supabase.com/
2. Create a new project
3. Get database credentials
4. Run the schema.sql in the SQL Editor
5. Update `.env` with Supabase credentials

---

## Troubleshooting

### Port already in use
If port 5000 or 5173 is in use:
- Change PORT in `.env` (backend)
- Vite will automatically choose an available port for frontend

### Connection refused
- Ensure PostgreSQL service is running
- Check firewall settings
- Verify database credentials in `.env`

### npm install fails
- Run as Administrator
- Check internet connection
- Clear npm cache: `npm cache clean --force`
