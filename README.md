# Boda Boda Spare Parts POS System

A complete Point of Sale (POS) system for boda boda spare parts shops, built with Node.js, Express, React, and PostgreSQL.

## Features

- **Authentication & User Roles**: Admin, Manager, Cashier, Storekeeper with different permissions
- **Product Management**: Add, edit, delete products with categories, pricing, and stock tracking
- **POS Screen**: Fast sales interface with product search, cart management, and receipt generation
- **Inventory Management**: Stock tracking, low-stock alerts, stock movements history
- **Customer Management**: Customer profiles, credit limits, debt tracking
- **Reports**: Daily sales, stock valuation, top-selling products, profit reports (with expenses)
- **Dashboard**: Real-time overview of sales, stock levels, and debtors
- **Settings**: Shop configuration, tax rates, receipt customization
- **Expenses**: Track daily expenses by category with payment methods
- **Purchases**: Create purchase orders, manage supplier stock-in
- **Cash Sessions**: Track cash drawer opening/closing balances and variance
- **Data Export**: Export reports and data to Excel/CSV
- **Receipt Printing**: Browser-based printing compatible with thermal printers (58mm/80mm)
- **Barcode Scanner**: USB barcode scanner support with auto-add to cart
- **PWA Support**: Works offline, can be installed on mobile devices

## Tech Stack

### Backend
- Node.js + Express (TypeScript)
- PostgreSQL
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React + Vite
- Tailwind CSS
- React Router
- Zustand (state management)
- Axios (API client)

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd "AUTOSPARE POS"
```

### 2. Set up the database

Create a PostgreSQL database:

```bash
# In PostgreSQL
CREATE DATABASE autospare_pos;
```

Run the database schema:

```bash
psql -U postgres -d autospare_pos -f database/schema.sql
```

(Optional) Load sample data for testing:

```bash
psql -U postgres -d autospare_pos -f database/seed.sql
```

This will populate the database with:
- 50+ sample products across all categories
- 7 sample customers (riders, mechanics, garages)
- Default admin user with password 'admin123'

### 3. Backend setup

```bash
# Install dependencies
npm install

# Create .env file from .env.example
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=autospare_pos
# DB_USER=postgres
# DB_PASSWORD=your_password

# Generate a secure JWT secret
# You can use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update JWT_SECRET in .env

# Run the development server
npm run dev
```

The backend will run on `http://localhost:5000`

### Generate password hash

If you need to create a new user or change passwords, use the hash script:

```bash
npm run hash-password <your-password>
```

This will output a bcrypt hash that you can use in the database.

### 4. Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# The .env file is already created with VITE_API_URL=http://localhost:5000/api

# Run the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Default User

After running the database schema, a default admin user is created:

- **Username**: admin
- **Password**: admin123

⚠️ **Important**: Change this password immediately after first login!

## Project Structure

```
AUTOSPARE POS/
├── src/                      # Backend source
│   ├── config/              # Database configuration
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Auth middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── server.ts            # Express server
│   └── utils/               # Utility functions
├── database/                # Database schema
│   └── schema.sql           # SQL schema file
├── frontend/                # Frontend source
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── stores/          # Zustand stores
│   │   └── main.jsx         # Entry point
│   └── .env                 # Frontend environment variables
├── .env                     # Backend environment variables
├── .env.example             # Environment variables template
├── package.json             # Backend dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/low-stock` - Get low stock products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Sales
- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get sale by ID
- `POST /api/sales` - Create new sale
- `POST /api/sales/:id/void` - Void a sale

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/debtors` - Get all debtors

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/summary` - Get expense summary by category
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Settings
- `GET /api/settings` - Get shop settings
- `PUT /api/settings` - Update shop settings

### Purchases
- `GET /api/purchases` - Get all purchases
- `GET /api/purchases/:id` - Get purchase by ID
- `POST /api/purchases` - Create new purchase
- `PUT /api/purchases/:id` - Update purchase
- `DELETE /api/purchases/:id` - Delete purchase

### Reports
- `GET /api/reports/daily-sales` - Get daily sales summary
- `GET /api/reports/sales-by-category` - Get sales by category
- `GET /api/reports/top-products` - Get top selling products
- `GET /api/reports/profit` - Get profit report
- `GET /api/reports/stock-valuation` - Get stock valuation
- `GET /api/reports/dashboard` - Get dashboard summary

## Development

### Backend

```bash
# Run in development mode with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Frontend

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Future Enhancements

- [ ] M-Pesa integration (STK Push) - Optional
- [ ] SMS notifications (receipts, debt reminders) - Optional
- [ ] KRA eTIMS integration - Future consideration when business grows
- [ ] Receipt printing - Optional enhancement
- [ ] Barcode scanner support - Optional enhancement
- [ ] Multi-branch support - Future enhancement

## Security Notes

- Change the default admin password immediately
- Use strong JWT secrets in production
- Enable HTTPS in production
- Regular database backups
- Implement rate limiting for API endpoints
- Add input validation and sanitization

## License

ISC

## Support

For issues and questions, please contact the development team.
# AutoSpare
