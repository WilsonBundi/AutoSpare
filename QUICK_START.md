# ⚡ Quick Start Guide - Boda Boda Spare Parts POS

Get your POS system up and running in minutes!

---

## 🚀 Local Development Setup

### 1. Database Setup
```bash
# Create PostgreSQL database
createdb autospare_pos

# Run schema
psql -U postgres -d autospare_pos -f database/schema.sql

# (Optional) Load sample data
psql -U postgres -d autospare_pos -f database/seed.sql
```

### 2. Backend Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run development server
npm run dev
```
Backend runs on: `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🔑 Default Login

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change this password immediately after first login!**

---

## 📱 Pages Overview

| Page | Description | Access |
|------|-------------|--------|
| **Dashboard** | Real-time statistics and overview | All users |
| **POS** | Sales interface with cart and checkout | Cashier, Manager, Admin |
| **Products** | Product management with export | Storekeeper, Manager, Admin |
| **Customers** | Customer and credit management | Cashier, Manager, Admin |
| **Purchases** | Purchase order management | Storekeeper, Manager, Admin |
| **Cash Sessions** | Cash drawer tracking | Cashier, Manager, Admin |
| **Expenses** | Expense tracking and reporting | Manager, Admin |
| **Reports** | Analytics and data export | All users |
| **Settings** | Shop configuration | Manager, Admin |

---

## 👤 User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all features including user management |
| **Manager** | All features except user management |
| **Cashier** | POS, customers, cash sessions |
| **Storekeeper** | Products, inventory, suppliers, purchases |

---

## 🎯 First Steps After Login

### 1. Configure Shop Settings
- Go to **Settings** page
- Enter shop name, address, phone, email
- Set tax rate (default 16%)
- Customize receipt footer
- Set low stock threshold

### 2. Add Products
- Go to **Products** page
- Click "Add Product"
- Enter product details (name, code, barcode, category, prices, stock)
- Or use sample data if you ran seed.sql

### 3. Add Suppliers (Optional)
- Go to **Suppliers** (accessible via Purchases)
- Add your suppliers with contact information

### 4. Add Customers
- Go to **Customers** page
- Add regular customers (riders, mechanics, garages)
- Set credit limits if needed

### 5. Make Your First Sale
- Go to **POS** page
- Search for products by name, code, or barcode
- Add to cart
- Complete sale
- Stock automatically updates!

---

## 📊 Key Features

### ✅ Sales
- Fast product search
- Shopping cart
- Tax calculation
- Multiple payment methods
- Receipt generation
- Sale voiding

### ✅ Inventory
- Stock tracking
- Low stock alerts
- Stock movements history
- Stock adjustments
- Purchase orders

### ✅ Reports
- Daily sales
- Stock valuation
- Top-selling products
- Profit reports
- Export to Excel/CSV

### ✅ Cash Management
- Cash sessions
- Opening/closing balances
- Variance tracking

### ✅ Expenses
- Track daily expenses
- Categorize expenses
- Monthly summaries

---

## 🔧 Common Tasks

### Add a New Product
1. Go to Products → Add Product
2. Fill in details (name, code, category, prices, stock)
3. Click Save

### Make a Sale
1. Go to POS
2. Search and add products to cart
3. Adjust quantities
4. Complete sale
5. Stock automatically deducted

### Add Stock from Purchase
1. Go to Purchases → New Purchase
2. Select supplier
3. Add products and quantities
4. Complete purchase
5. Stock automatically added

### Track Expenses
1. Go to Expenses → Add Expense
2. Select category (Rent, Salaries, etc.)
3. Enter amount and payment method
4. Save

### Generate Reports
1. Go to Reports
2. View dashboard, sales, stock valuation
3. Click Export Excel or Export CSV to download

### Open/Close Cash Session
1. Go to Cash Sessions
2. Click "Open Session" (enter opening balance)
3. At end of day, click "Close Session" (enter closing balance)
4. System calculates variance

---

## 💡 Tips

### Fast Product Search
- Search by name: "brake"
- Search by code: "BRK-001"
- Search by barcode: "1234567890123"

### Low Stock Alerts
- Products with stock ≤ reorder level show in red
- Check "Low Stock" list in Products page
- Set reorder level in product settings

### Customer Credit
- Set credit limits for regular customers
- Track outstanding balances
- View debtors list

### Export Data
- Export products to Excel for inventory management
- Export reports for accounting
- CSV format for easy import into other systems

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if PostgreSQL is running
# Verify .env database credentials
# Check port 5000 is not in use
```

### Frontend won't load
```bash
# Check backend is running on port 5000
# Verify VITE_API_URL in frontend/.env
# Check browser console for errors
```

### Can't login
```bash
# Verify database was initialized with schema.sql
# Check admin user exists in database
# Default: admin / admin123
```

### Stock not updating
```bash
# Check stock movements in database
# Verify sale completed successfully
# Check for errors in browser console
```

---

## 📚 Documentation

- **README.md** - Complete setup and API documentation
- **PROJECT_SUMMARY.md** - Detailed project overview
- **COMPLETION_STATUS.md** - Feature completion status
- **FINAL_SUMMARY.md** - Comprehensive summary
- **DEPLOYMENT_GUIDE.md** - Production deployment guide

---

## 🎓 Key Technical Info

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + Vite + Tailwind CSS
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **State Management**: Zustand
- **Offline Support**: PWA
- **Export**: Excel (xlsx) and CSV

---

## 🔐 Security

- Change default admin password immediately
- Use strong JWT secrets in production
- Enable HTTPS in production
- Regular database backups
- Limit user permissions by role

---

## 🎉 You're Ready!

Your Boda Boda Spare Parts POS system is now:
- ✅ Fully functional
- ✅ Production-ready
- ✅ Well-documented
- ✅ Easy to use

Start managing your spare parts shop efficiently!

---

**Need Help?**
- Check the documentation files
- Review the deployment guide
- Ensure PostgreSQL is running
- Verify environment variables

**Built for Kenya's Boda Boda Spare Parts Shops 🏍️**
