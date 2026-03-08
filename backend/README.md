# Raithane Backend - Production-Ready E-Commerce API

## 🏗️ Architecture Overview

This is a scalable, production-ready backend architecture for the Raithane e-commerce platform built with the MERN stack.

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Cloudinary
- **Security**: bcryptjs for password hashing

---

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection setup
│   ├── cloudinary.js    # Cloudinary configuration
│   └── jwt.js           # JWT token generation/verification
│
├── controllers/         # Request handlers (business logic)
│   ├── authController.js           # User authentication
│   ├── productController.js        # Public product operations
│   ├── categoryController.js       # Public category operations
│   ├── cartController.js           # Cart management
│   ├── orderController.js          # Order management (users)
│   ├── adminProductController.js   # Admin product CRUD
│   ├── adminCategoryController.js  # Admin category CRUD
│   ├── adminOrderController.js     # Admin order management
│   └── deliveryController.js       # Delivery personnel operations
│
├── models/              # Mongoose schemas
│   ├── User.js          # User model (role-based)
│   ├── Product.js       # Product model
│   ├── Category.js      # Category model
│   ├── Cart.js          # Shopping cart model
│   └── Order.js         # Order model
│
├── routes/              # API route definitions
│   ├── authRoutes.js    # /api/auth/*
│   ├── productRoutes.js # /api/products/*
│   ├── categoryRoutes.js # /api/categories/*
│   ├── cartRoutes.js    # /api/cart/*
│   ├── orderRoutes.js   # /api/orders/*
│   ├── adminRoutes.js   # /api/admin/*
│   └── deliveryRoutes.js # /api/delivery/*
│
├── middleware/          # Custom middleware
│   ├── auth.js          # JWT authentication & role-based authorization
│   ├── errorHandler.js  # Centralized error handling
│   ├── requestLogger.js # Request logging (development)
│   └── notFound.js      # 404 handler
│
├── utils/               # Utility functions
│   ├── ErrorResponse.js # Custom error class
│   ├── asyncHandler.js  # Async error wrapper
│   └── pagination.js    # Pagination helpers
│
├── seeds/               # Database seeders
│   └── seedUsers.js     # Seed admin & delivery users
│
├── .env.example         # Environment variables template
├── index.js             # Application entry point
└── package.json         # Dependencies & scripts
```

---

## 🔐 Authentication & Authorization

### JWT-Based Authentication
- Tokens generated on login/register
- 30-day expiration (configurable)
- Sent in `Authorization: Bearer <token>` header

### Role-Based Access Control (RBAC)

**Three Roles:**
1. **user** (Customer) - Default role for registered users
2. **admin** - Full access to manage products, categories, orders
3. **delivery** - Access to assigned orders only

**Middleware:**
- `protect` - Verifies JWT token
- `adminOnly` - Restricts to admin role
- `deliveryOnly` - Restricts to delivery role
- `authorize(...roles)` - Generic role authorization

---

## 📊 Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin' | 'delivery',
  phone: String,
  address: {
    street, city, state, zipCode, country
  },
  assignedOrders: [ObjectId], // For delivery persons
  isActive: Boolean,
  timestamps: true
}
```

### Product Schema
```javascript
{
  name: String,
  slug: String (unique, auto-generated),
  description: String,
  shortDescription: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  category: ObjectId (ref: Category),
  images: [{
    public_id: String,
    secure_url: String
  }],
  stock: Number,
  specifications: Map,
  tags: [String],
  isFeatured: Boolean,
  isNewArrival: Boolean,
  isActive: Boolean,
  rating: Number,
  numReviews: Number,
  views: Number,
  timestamps: true
}
```

### Category Schema
```javascript
{
  name: String (unique),
  slug: String (unique, auto-generated),
  description: String,
  image: {
    public_id: String,
    secure_url: String
  },
  isActive: Boolean,
  sortOrder: Number,
  timestamps: true
}
```

### Cart Schema
```javascript
{
  user: ObjectId (ref: User, unique),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalItems: Number (auto-calculated),
  totalPrice: Number (auto-calculated),
  timestamps: true
}
```

### Order Schema
```javascript
{
  orderNumber: String (unique, auto-generated),
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    name: String,
    quantity: Number,
    price: Number,
    image: String
  }],
  shippingAddress: {
    name, phone, street, city, state, zipCode, country
  },
  paymentMethod: 'cod' | 'online' | 'card',
  paymentStatus: 'pending' | 'paid' | 'failed',
  itemsPrice: Number,
  shippingPrice: Number,
  taxPrice: Number (18% GST),
  totalPrice: Number,
  status: 'pending' | 'confirmed' | 'processing' | 
          'picked_up' | 'out_for_delivery' | 'delivered' | 'cancelled',
  deliveryPerson: ObjectId (ref: User),
  statusHistory: [{
    status: String,
    timestamp: Date,
    note: String,
    updatedBy: ObjectId
  }],
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  timestamps: true
}
```

---

## 🌐 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | User login |
| GET | `/me` | Private | Get current user |
| PUT | `/update-profile` | Private | Update profile |
| PUT | `/update-password` | Private | Change password |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all products (filtered, paginated) |
| GET | `/:id` | Public | Get single product |
| GET | `/featured` | Public | Get featured products |
| GET | `/new-arrivals` | Public | Get new arrivals |
| GET | `/related/:productId` | Public | Get related products |

### Categories (`/api/categories`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all categories |
| GET | `/:id` | Public | Get single category |

### Cart (`/api/cart`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private | Get user cart |
| POST | `/add` | Private | Add item to cart |
| PUT | `/update/:itemId` | Private | Update quantity |
| DELETE | `/remove/:itemId` | Private | Remove item |
| DELETE | `/clear` | Private | Clear entire cart |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Private | Create order from cart |
| GET | `/` | Private | Get user's orders |
| GET | `/:id` | Private | Get order details |
| PUT | `/:id/cancel` | Private | Cancel order |

### Admin - Products (`/api/admin/products`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Admin | Get all products (including inactive) |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |
| POST | `/:id/images` | Admin | Upload images |
| DELETE | `/:id/images/:imageId` | Admin | Delete image |
| PATCH | `/:id/toggle-status` | Admin | Activate/deactivate |

### Admin - Categories (`/api/admin/categories`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Admin | Get all categories |
| POST | `/` | Admin | Create category |
| PUT | `/:id` | Admin | Update category |
| DELETE | `/:id` | Admin | Delete category |
| POST | `/:id/image` | Admin | Upload image |
| PATCH | `/:id/toggle-status` | Admin | Activate/deactivate |

### Admin - Orders (`/api/admin`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/orders` | Admin | Get all orders |
| GET | `/orders/:id` | Admin | Get order details |
| PUT | `/orders/:id/status` | Admin | Update order status |
| PUT | `/orders/:id/assign-delivery` | Admin | Assign to delivery person |
| GET | `/statistics` | Admin | Get dashboard stats |

### Delivery (`/api/delivery`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/orders` | Delivery | Get assigned orders |
| GET | `/orders/:id` | Delivery | Get order details |
| PUT | `/orders/:id/status` | Delivery | Update status (picked_up, out_for_delivery, delivered) |
| GET | `/statistics` | Delivery | Get delivery stats |

---

## ☁️ Cloudinary Integration

### Configuration
Set environment variables:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Image Upload
- **Products**: Multiple images, stored in `raithane/products` folder
- **Categories**: Single image, stored in `raithane/categories` folder
- Images auto-optimized (quality, dimensions)
- Base64 images accepted in request body

### Image Format
```javascript
{
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Base64 string
  ]
}
```

---

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Install Missing Package
```bash
npm install cloudinary
```

### 3. Configure Environment
Copy `.env.example` to `.env` and update:
```bash
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/raithane
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
PRODUCTS_PER_PAGE=12
```

### 4. Start Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 5. Default Users (Created Automatically in Development)

**Admin:**
- Email: `admin@raithane.com`
- Password: `Admin@123`

**Delivery:**
- Email: `delivery@raithane.com`
- Password: `Delivery@123`

⚠️ **CHANGE THESE PASSWORDS IN PRODUCTION!**

---

## 🛡️ Security Features

✅ **Password Hashing** - bcryptjs with salt rounds  
✅ **JWT Authentication** - Secure token-based auth  
✅ **Role-Based Authorization** - Granular access control  
✅ **Input Validation** - Mongoose schema validation  
✅ **Error Handling** - Centralized error management  
✅ **CORS Protection** - Configured for frontend URL  
✅ **NoSQL Injection Protection** - Mongoose sanitization  

---

## 📈 Features

### Pagination
- Configurable page size
- Metadata included (total, pages, hasNext)
- Applied to products & orders

### Search & Filters
- **Products**: By name, category, price range, featured, new
- **Orders**: By status, date range, order number

### Order Status Flow
1. **pending** → User creates order
2. **confirmed** → Admin confirms
3. **processing** → Assigned to delivery
4. **picked_up** → Delivery picks up
5. **out_for_delivery** → On the way
6. **delivered** → Completed
7. **cancelled** → User/admin cancels

### Stock Management
- Auto-deduct on order
- Auto-restore on cancellation
- Stock validation before checkout

### Automatic Features
- Slug generation (products, categories)
- Order number generation (ORD-xxxxxxxxx)
- Cart total calculation
- Status history tracking
- Free shipping over Rs.500
- 18% GST auto-calculation

---

## 🧪 Testing

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@raithane.com",
    "password": "Admin@123"
  }'
```

### Test Creating Category (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Electronics",
    "description": "Electronic items"
  }'
```

---

## 🔧 Error Handling

All errors return consistent format:
```javascript
{
  "success": false,
  "error": "Error message here",
  "stack": "..." // Only in development
}
```

### Error Types Handled
- Mongoose validation errors
- Duplicate key errors (11000)
- CastError (invalid ObjectId)
- JWT errors (invalid/expired token)
- Custom operational errors

---

## 📝 Best Practices Implemented

✅ ES6 Modules (`import/export`)  
✅ Async/await with error handling  
✅ Environment variable usage  
✅ Clean folder structure  
✅ Separation of concerns  
✅ DRY principle  
✅ Meaningful variable names  
✅ Comprehensive comments  
✅ Consistent code style  
✅ Production-ready setup  

---

## 🚀 Production Deployment Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Set NODE_ENV=production
- [ ] Configure production MongoDB URI
- [ ] Set up Cloudinary account
- [ ] Configure CORS for production frontend URL
- [ ] Enable HTTPS
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure rate limiting
- [ ] Set up database backups
- [ ] Review and update security headers
- [ ] Set up logging service

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT Docs](https://jwt.io/)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

## 📧 Support

For issues or questions, contact the development team.

**Built with ❤️ for production use**
