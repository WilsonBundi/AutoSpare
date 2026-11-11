# 🚀 Deployment Guide - Boda Boda Spare Parts POS

This guide will help you deploy the Boda Boda Spare Parts POS system to production.

---

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **Git** (for version control)
- **Domain name** (optional but recommended)
- **VPS or Hosting Provider** (DigitalOcean, Hetzner, AWS, etc.)

---

## 🔧 Step 1: Server Setup

### Option A: VPS (Recommended for Production)

#### 1.1 Connect to your VPS
```bash
ssh root@your-server-ip
```

#### 1.2 Update the system
```bash
apt update && apt upgrade -y
```

#### 1.3 Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
```

#### 1.4 Install PostgreSQL
```bash
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql
```

#### 1.5 Install Nginx (for reverse proxy)
```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

#### 1.6 Install PM2 (process manager)
```bash
npm install -g pm2
```

---

## 🗄️ Step 2: Database Setup

#### 2.1 Create database user and database
```bash
sudo -u postgres psql
```

```sql
CREATE USER autospare_user WITH PASSWORD 'your_strong_password';
CREATE DATABASE autospare_pos OWNER autospare_user;
GRANT ALL PRIVILEGES ON DATABASE autospare_pos TO autospare_user;
\q
```

#### 2.2 Upload and run schema
```bash
# Upload your project files to the server
git clone <your-repo-url> /var/www/autospare-pos
cd /var/www/autospare-pos

# Run database schema
psql -U autospare_user -d autospare_pos -f database/schema.sql

# (Optional) Load sample data
psql -U autospare_user -d autospare_pos -f database/seed.sql
```

---

## 🔐 Step 3: Environment Configuration

#### 3.1 Backend Environment
```bash
cd /var/www/autospare-pos
cp .env.example .env
nano .env
```

Update the following values:
```env
PORT=5000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=autospare_pos
DB_USER=autospare_user
DB_PASSWORD=your_strong_password
JWT_SECRET=generate_a_very_long_random_string_here
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-domain.com
```

#### 3.2 Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 3.3 Frontend Environment
```bash
cd frontend
cp .env.example .env
nano .env
```

Update:
```env
VITE_API_URL=https://your-domain.com/api
```

---

## 📦 Step 4: Build and Deploy Backend

#### 4.1 Install dependencies
```bash
cd /var/www/autospare-pos
npm install --production
```

#### 4.2 Build TypeScript
```bash
npm run build
```

#### 4.3 Start with PM2
```bash
pm2 start dist/server.js --name autospare-pos-backend
pm2 save
pm2 startup
```

---

## 🎨 Step 5: Build and Deploy Frontend

#### 5.1 Install dependencies
```bash
cd /var/www/autospare-pos/frontend
npm install
```

#### 5.2 Build for production
```bash
npm run build
```

#### 5.3 Configure Nginx
```bash
nano /etc/nginx/sites-available/autospare-pos
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /var/www/autospare-pos/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 5.4 Enable the site
```bash
ln -s /etc/nginx/sites-available/autospare-pos /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 🔒 Step 6: SSL Certificate (HTTPS)

#### 6.1 Install Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

#### 6.2 Obtain SSL Certificate
```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the prompts to configure SSL.

#### 6.3 Auto-renewal
Certbot automatically sets up auto-renewal. Verify with:
```bash
certbot renew --dry-run
```

---

## 🔄 Step 7: Database Backups

#### 7.1 Create backup script
```bash
nano /var/www/autospare-pos/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/autospare-pos"
mkdir -p $BACKUP_DIR

pg_dump -U autospare_user autospare_pos > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

#### 7.2 Make script executable
```bash
chmod +x /var/www/autospare-pos/backup.sh
```

#### 7.3 Schedule daily backups
```bash
crontab -e
```

Add:
```
0 2 * * * /var/www/autospare-pos/backup.sh
```

---

## 📊 Step 8: Monitoring

#### 8.1 Monitor with PM2
```bash
pm2 monit
pm2 logs autospare-pos-backend
```

#### 8.2 Restart on failure
```bash
pm2 startup
pm2 save
```

#### 8.3 Check logs
```bash
pm2 logs autospare-pos-backend --lines 100
```

---

## 🧪 Step 9: Testing

#### 9.1 Test backend health
```bash
curl https://your-domain.com/api/health
```

Should return: `{"status":"OK","message":"Autospare POS API is running"}`

#### 9.2 Test frontend
Open `https://your-domain.com` in your browser

#### 9.3 Test login
- Username: `admin`
- Password: `admin123`
- **IMPORTANT**: Change this password immediately!

---

## 🔐 Step 10: Security Checklist

- ✅ Change default admin password
- ✅ Use strong JWT secrets
- ✅ SSL/HTTPS enabled
- ✅ Firewall configured (allow only necessary ports)
- ✅ Database backups automated
- ✅ Regular system updates
- ✅ Limit SSH access (use keys, disable password auth)
- ✅ Monitor logs regularly

---

## 🐛 Troubleshooting

### Backend won't start
```bash
pm2 logs autospare-pos-backend
# Check for errors
```

### Database connection error
```bash
# Check PostgreSQL is running
systemctl status postgresql

# Check database exists
psql -U autospare_user -d autospare_pos -c "\l"
```

### Nginx 502 error
```bash
# Check if backend is running
pm2 status

# Check Nginx error logs
tail -f /var/log/nginx/error.log
```

### Frontend not loading
```bash
# Check if build exists
ls -la /var/www/autospare-pos/frontend/dist

# Rebuild if needed
cd /var/www/autospare-pos/frontend
npm run build
```

---

## 📱 Alternative: Deploy to Cloud Platforms

### Option 1: Render.com (Easiest)
1. Push code to GitHub
2. Connect Render to your GitHub
3. Create PostgreSQL database
4. Create Web Service for backend
5. Create Static Site for frontend
6. Add environment variables

### Option 2: Railway.app
1. Push code to GitHub
2. Connect Railway to GitHub
3. Deploy both backend and frontend
4. Railway handles SSL automatically

### Option 3: DigitalOcean App Platform
1. Push code to GitHub
2. Create App in DigitalOcean
3. Connect PostgreSQL
4. Deploy with one click

---

## 🎉 Post-Deployment

1. **Change Admin Password**
   - Login to the system
   - Go to Settings or use API to change password

2. **Add Your Products**
   - Go to Products page
   - Add your inventory

3. **Configure Shop Settings**
   - Go to Settings page
   - Add shop name, address, phone
   - Set tax rate
   - Customize receipt footer

4. **Create User Accounts**
   - Add cashiers, storekeepers, managers
   - Assign appropriate roles

5. **Test All Features**
   - Make a test sale
   - Create a purchase order
   - Add an expense
   - Generate reports
   - Test export functionality

---

## 📞 Support

If you encounter issues:
1. Check the logs (PM2, Nginx, PostgreSQL)
2. Review the troubleshooting section
3. Check the README.md for setup instructions
4. Ensure all environment variables are correct

---

**Congratulations! Your Boda Boda Spare Parts POS is now live! 🎉**
