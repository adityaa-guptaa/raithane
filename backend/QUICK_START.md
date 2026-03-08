# 🚀 Quick Start Guide - Raithane Backend

## ✅ Installation Complete!

Your production-ready backend architecture has been successfully created.

---

## 📋 Next Steps

### 1️⃣ Set Up Environment Variables

Create a `.env` file in the backend directory:

```bash
cd backend
cp .env.example .env
```

Then edit `.env` with your actual values:

```env
NODE_ENV=development
PORT=5000

# MongoDB - Update with your connection string
MONGO_URI=mongodb://localhost:27017/raithane
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/raithane

# JWT - Generate a strong secret key
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=30d

# Cloudinary - Sign up at https://cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Pagination
PRODUCTS_PER_PAGE=12
```

---

### 2️⃣ Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
==================================================
🚀 Server running on port 5000
📍 Environment: development
🌐 API URL: http://localhost:5000/api
==================================================
✅ MongoDB Connected: ...
☁️  Cloudinary configured
✅ Admin user already exists
✅ Delivery user already exists
```

---

### 3️⃣ Test the API

Open your browser or Postman and visit:
```
http://localhost:5000
```

You should see:
```json
{
  "success": true,
  "message": "Raithane API is running",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "products": "/api/products",
    "categories": "/api/categories",
    "cart": "/api/cart",
    "orders": "/api/orders",
    "admin": "/api/admin",
    "delivery": "/api/delivery"
  }
}
```

---

## 🔐 Default User Accounts

Two test accounts are automatically created:

### Admin Account
```
Email: admin@raithane.com
Password: Admin@123
```

### Delivery Account
```
Email: delivery@raithane.com
Password: Delivery@123
```

⚠️ **IMPORTANT:** Change these passwords in production!

---

## 🧪 Testing the API

### 1. Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@raithane.com",
    "password": "Admin@123"
  }'
```

Copy the `token` from the response.

### 2. Create a Category
```bash
curl -X POST http://localhost:5000/api/admin/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Electronics",
    "description": "Electronic items and gadgets"
  }'
```

### 3. Create a Product
```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Smartphone",
    "description": "Latest smartphone with amazing features",
    "price": 15999,
    "originalPrice": 19999,
    "category": "CATEGORY_ID_FROM_STEP_2",
    "stock": 50
  }'
```

---

## 📁 Project Structure Overview

```
backend/
├── config/              ← Database, JWT, Cloudinary setup
├── controllers/         ← Business logic
├── models/              ← MongoDB schemas
├── routes/              ← API endpoints
├── middleware/          ← Auth, error handling
├── utils/               ← Helper functions
├── seeds/               ← Database seeders
├── index.js             ← Entry point
└── README.md            ← Full documentation
```

---

## 🌐 Available Endpoints

### Public (No Auth Required)
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/products` - Get products
- `GET /api/categories` - Get categories

### User (Requires Login)
- `GET /api/auth/me` - Get profile
- `GET /api/cart` - Get cart
- `POST /api/cart/add` - Add to cart
- `POST /api/orders` - Create order

### Admin (Requires Admin Role)
- `POST /api/admin/products` - Create product
- `POST /api/admin/categories` - Create category
- `GET /api/admin/orders` - View all orders
- `PUT /api/admin/orders/:id/assign-delivery` - Assign delivery

### Delivery (Requires Delivery Role)
- `GET /api/delivery/orders` - View assigned orders
- `PUT /api/delivery/orders/:id/status` - Update status

📖 **Full API docs:** See `API_DOCUMENTATION.md`

---

## 🛠️ Common Tasks

### Create a New Admin User Manually
```javascript
// Use MongoDB Compass or shell
db.users.insertOne({
  name: "New Admin",
  email: "newadmin@raithane.com",
  password: "$2a$10$...", // Hash using bcrypt
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### View All Collections
- Connect to MongoDB using Compass: `mongodb://localhost:27017/raithane`
- Collections: users, products, categories, carts, orders

---

## 🔧 Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Cloudinary Upload Failed
```
Error: Must supply cloud_name
```
**Solution:** Check your `.env` file has correct Cloudinary credentials

### JWT Token Invalid
```
Error: Not authorized to access this route
```
**Solution:** 
1. Make sure token is sent in `Authorization: Bearer <token>` header
2. Token might be expired - login again
3. Check JWT_SECRET is consistent

---

## 📚 Documentation Files

- `README.md` - Complete architecture guide
- `API_DOCUMENTATION.md` - Detailed API reference
- `QUICK_START.md` - This file

---

## 🎯 What's Been Built

✅ **Complete Backend Architecture**
- Role-based authentication (User, Admin, Delivery)
- Product & category management
- Shopping cart functionality
- Order management with status tracking
- Cloudinary image uploads
- Pagination & filtering
- Error handling
- Input validation

✅ **Database Models**
- User (with role-based access)
- Product (with images, stock, pricing)
- Category
- Cart
- Order (with status history)

✅ **API Endpoints**
- 30+ RESTful endpoints
- Public, protected, and role-restricted routes
- Search, filter, and pagination support

✅ **Security**
- JWT authentication
- Password hashing
- Role-based authorization
- CORS protection
- Input validation

✅ **Production Ready**
- Environment variables
- Error handling
- Request logging
- Clean code structure
- Comprehensive documentation

---

## 🚀 Ready to Integrate with Frontend

Your backend is now ready! Connect your React frontend to these endpoints.

### Example Frontend Integration

```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { data } = await response.json();
localStorage.setItem('token', data.token);

// Get Products
const response = await fetch('http://localhost:5000/api/products');
const { data } = await response.json();

// Add to Cart (with auth)
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/cart/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ productId, quantity })
});
```

---

## 💡 Pro Tips

1. **Use Postman/Insomnia** - Import the API endpoints for easy testing
2. **Enable MongoDB Compass** - Visual interface for your database
3. **Check Logs** - All errors are logged in development mode
4. **Read the Docs** - Full API documentation in `API_DOCUMENTATION.md`
5. **Secure in Production** - Change default passwords and secrets

---

## 📞 Need Help?

- Review `README.md` for architecture details
- Check `API_DOCUMENTATION.md` for endpoint examples
- Inspect error messages in terminal
- Verify `.env` configuration

**Happy Coding! 🎉**
