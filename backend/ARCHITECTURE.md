# 🏗️ Raithane Backend - Architecture Summary

## 🎯 Project Overview

**Raithane** is a production-ready, scalable e-commerce backend built with the MERN stack, featuring:
- Role-based authentication (User, Admin, Delivery)
- Complete product & order management
- Cloudinary image storage
- RESTful API design
- MongoDB with Mongoose ODM

---

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐                  │
│  │  React   │  │ Postman  │  │ Mobile App   │                  │
│  │ Frontend │  │   API    │  │   (Future)   │                  │
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘                  │
└───────┼─────────────┼────────────────┼─────────────────────────┘
        │             │                │
        └─────────────┴────────────────┘
                      │
                 HTTP/HTTPS (REST)
                      │
┌─────────────────────▼──────────────────────────────────────────┐
│                    API GATEWAY LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Express.js Middleware Stack                 │  │
│  │  ┌────────┐ ┌──────────┐ ┌────────────┐ ┌────────────┐  │  │
│  │  │  CORS  │→│  JSON    │→│  Request   │→│   Auth     │  │  │
│  │  │        │ │  Parser  │ │   Logger   │ │ Middleware │  │  │
│  │  └────────┘ └──────────┘ └────────────┘ └────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│    PUBLIC    │ │   PROTECTED  │ │     ADMIN    │
│    ROUTES    │ │    ROUTES    │ │    ROUTES    │
├──────────────┤ ├──────────────┤ ├──────────────┤
│ /auth        │ │ /cart        │ │ /admin/*     │
│ /products    │ │ /orders      │ │              │
│ /categories  │ │ /auth/me     │ │   DELIVERY   │
└──────┬───────┘ └──────┬───────┘ │    ROUTES    │
       │                │         ├──────────────┤
       │                │         │ /delivery/*  │
       │                │         └──────┬───────┘
       └────────────────┴────────────────┘
                        │
┌───────────────────────▼───────────────────────────────────────┐
│                  CONTROLLER LAYER                             │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────────┐   │
│  │    Auth     │ │   Product    │ │   Admin Product      │   │
│  │ Controller  │ │  Controller  │ │    Controller        │   │
│  └─────────────┘ └──────────────┘ └──────────────────────┘   │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────────┐   │
│  │    Cart     │ │    Order     │ │   Admin Order        │   │
│  │ Controller  │ │  Controller  │ │    Controller        │   │
│  └─────────────┘ └──────────────┘ └──────────────────────┘   │
│  ┌─────────────┐ ┌──────────────┐ ┌──────────────────────┐   │
│  │  Category   │ │   Delivery   │ │  Admin Category      │   │
│  │ Controller  │ │  Controller  │ │    Controller        │   │
│  └─────────────┘ └──────────────┘ └──────────────────────┘   │
└────────────────────────┬──────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
┌──────────────────┐            ┌──────────────────┐
│   MONGOOSE ODM   │            │   CLOUDINARY     │
│      LAYER       │            │      API         │
├──────────────────┤            ├──────────────────┤
│ ┌──────────────┐ │            │  Image Storage   │
│ │     User     │ │            │   & Processing   │
│ │    Model     │ │            └──────────────────┘
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │   Product    │ │
│ │    Model     │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │   Category   │ │
│ │    Model     │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │     Cart     │ │
│ │    Model     │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │    Order     │ │
│ │    Model     │ │
│ └──────────────┘ │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   MongoDB        │
│   Database       │
├──────────────────┤
│  • users         │
│  • products      │
│  • categories    │
│  • carts         │
│  • orders        │
└──────────────────┘
```

---

## 🔐 Authentication Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ 1. POST /api/auth/login
     │    { email, password }
     ▼
┌─────────────────┐
│ Auth Controller │
└────┬────────────┘
     │ 2. Find user & verify password
     ▼
┌──────────────┐
│  User Model  │
└────┬─────────┘
     │ 3. User found, password matches
     ▼
┌──────────────┐
│  JWT Config  │
└────┬─────────┘
     │ 4. Generate JWT token
     │    { id: userId }
     ▼
┌─────────────────┐
│     Client      │
│  Stores token   │
└────┬────────────┘
     │ 5. Subsequent requests
     │    Authorization: Bearer <token>
     ▼
┌─────────────────┐
│ Auth Middleware │
└────┬────────────┘
     │ 6. Verify token, attach user to req
     ▼
┌─────────────────┐
│   Controller    │
│  (req.user)     │
└─────────────────┘
```

---

## 🛒 Order Processing Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Add items to cart
     ▼
┌──────────────┐
│ Cart Model   │
│ (Per User)   │
└────┬─────────┘
     │ 2. POST /api/orders
     │    { shippingAddress, paymentMethod }
     ▼
┌───────────────────┐
│ Order Controller  │
└────┬──────────────┘
     │ 3. Validate cart items
     │ 4. Check stock availability
     │ 5. Calculate pricing
     ▼
┌──────────────────┐
│  Product Model   │
│  (Update stock)  │
└────┬─────────────┘
     │ 6. Reduce stock
     ▼
┌──────────────────┐
│   Order Model    │
│  (Create order)  │
└────┬─────────────┘
     │ 7. Status: pending
     │ 8. Auto-generate order number
     ▼
┌──────────────────┐
│   Clear Cart     │
└────┬─────────────┘
     │ 9. Order created
     ▼
┌─────────────────┐
│     Admin       │
│  (Views order)  │
└────┬────────────┘
     │ 10. Assign to delivery
     ▼
┌──────────────────┐
│ Delivery Person  │
└────┬─────────────┘
     │ 11. Update status:
     │     picked_up → out_for_delivery → delivered
     ▼
┌──────────────────┐
│  Order Complete  │
│ Payment: paid    │
└──────────────────┘
```

---

## 🎭 Role-Based Access Control

```
┌────────────────────────────────────────────────────────┐
│                    USER ROLES                          │
├────────────────┬─────────────────┬─────────────────────┤
│     USER       │     ADMIN       │     DELIVERY        │
│  (Customer)    │   (Manager)     │   (Driver)          │
├────────────────┼─────────────────┼─────────────────────┤
│ ✅ View        │ ✅ View         │ ✅ View assigned    │
│   products     │   all products  │   orders only       │
│                │                 │                     │
│ ✅ Add to cart │ ✅ Create/Edit/ │ ✅ Update order     │
│                │   Delete        │   status            │
│                │   products      │   (3 statuses)      │
│                │                 │                     │
│ ✅ Place       │ ✅ Manage       │ ❌ Cannot manage    │
│   orders       │   categories    │   products          │
│                │                 │                     │
│ ✅ Track       │ ✅ View all     │ ❌ Cannot view      │
│   own orders   │   orders        │   all orders        │
│                │                 │                     │
│ ✅ Cancel      │ ✅ Assign       │ ❌ Cannot assign    │
│   pending      │   delivery      │   orders            │
│   orders       │   persons       │                     │
│                │                 │                     │
│ ❌ Cannot      │ ✅ Update any   │ ❌ Cannot manage    │
│   manage       │   order status  │   users             │
│   inventory    │                 │                     │
└────────────────┴─────────────────┴─────────────────────┘
```

---

## 📦 Data Models Relationships

```
┌─────────────┐
│    USER     │
│             │◄───────────┐
│ role: enum  │            │
└──┬──────┬───┘            │
   │      │                │
   │      │ 1:1            │ M:1
   │      │                │
   │   ┌──▼────────┐    ┌──┴─────────┐
   │   │   CART    │    │   ORDER    │
   │   │           │    │            │
   │   │ items[]   │    │ items[]    │
   │   └───────────┘    │ status     │
   │                    │ delivery   │
   │ 1:N                └──┬─────────┘
   │                       │
   │                       │ M:N
┌──▼────────┐              │
│  ORDER    │              │
│           │◄─────────────┘
│ items[]   │
└───────────┘
      │
      │ M:N
      │
┌─────▼──────┐        ┌──────────────┐
│  PRODUCT   │        │   CATEGORY   │
│            │        │              │
│ images[]   │ M:1    │ name         │
│ stock      │◄───────┤ slug         │
│ price      │        │ image        │
└────────────┘        └──────────────┘
```

---

## 🔧 Technology Stack Details

### Backend Core
- **Node.js** v18+ - JavaScript runtime
- **Express.js** v4 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** v9 - ODM for MongoDB

### Authentication & Security
- **jsonwebtoken** - JWT generation/verification
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### File Storage
- **Cloudinary** - Cloud image storage & CDN
- **@cloudinary/url-gen** - URL generation
- **@cloudinary/react** - React integration (frontend)

### Development
- **nodemon** - Auto-restart server
- **dotenv** - Environment variables

---

## 📈 Scalability Features

### Database
✅ **Indexing** - Fast queries on email, slug, status, etc.
✅ **References** - ObjectId relations for efficient joins
✅ **Lean Queries** - Return plain objects when possible
✅ **Pagination** - Limit data transfer

### API
✅ **Stateless** - JWT tokens, no server sessions
✅ **RESTful** - Standard HTTP methods
✅ **Filtering** - Query parameters for search
✅ **Error Handling** - Centralized error management

### Performance
✅ **Connection Pooling** - MongoDB connection reuse
✅ **Async/Await** - Non-blocking operations
✅ **Image Optimization** - Cloudinary auto-compression
✅ **Selective Queries** - Only fetch needed fields

---

## 🔒 Security Measures

| Feature | Implementation |
|---------|----------------|
| **Password Security** | bcrypt hashing with salt |
| **Authentication** | JWT with expiration |
| **Authorization** | Role-based middleware |
| **Input Validation** | Mongoose schema validation |
| **XSS Protection** | Express sanitization |
| **NoSQL Injection** | Mongoose escaping |
| **CORS** | Whitelist frontend URL |
| **Error Messages** | No sensitive data leakage |
| **Environment Vars** | Secrets in .env file |

---

## 📊 Database Collections

### users
- Stores all user accounts (customer, admin, delivery)
- Hashed passwords, roles, addresses
- Assigned orders for delivery persons

### products
- Product catalog with images, pricing, stock
- Category references
- SEO metadata, tags, ratings
- Active/inactive status

### categories
- Product organization
- Images, descriptions, sort order
- Slug-based URLs

### carts
- One cart per user
- Temporary storage before checkout
- Auto-calculated totals

### orders
- Complete order details
- Status tracking with history
- Delivery person assignment
- Payment information

---

## 🎯 Key Features Implemented

### For Customers (USER)
✅ Registration & Login  
✅ Browse products with filters  
✅ View product details  
✅ Add/remove items from cart  
✅ Place orders  
✅ Track order status  
✅ Cancel pending orders  

### For Admin
✅ Secure login  
✅ Product CRUD operations  
✅ Category management  
✅ Image uploads via Cloudinary  
✅ Stock & pricing management  
✅ View all orders  
✅ Assign delivery persons  
✅ Dashboard statistics  

### For Delivery Personnel
✅ Secure login  
✅ View assigned orders only  
✅ See pickup & delivery addresses  
✅ Update delivery status  
✅ Track delivery statistics  

---

## 📝 File Count Summary

```
Total Files Created: 35+

Config:         3 files
Models:         5 files
Controllers:    8 files
Routes:         7 files
Middleware:     4 files
Utils:          3 files
Seeds:          1 file
Docs:           4 files
Other:          3 files
```

---

## 🚀 Production Readiness Checklist

✅ Environment variable configuration  
✅ Error handling & logging  
✅ Input validation  
✅ Security best practices  
✅ Scalable architecture  
✅ Clean code structure  
✅ Comprehensive documentation  
✅ RESTful API design  
✅ Database indexing  
✅ Role-based access control  

---

## 🎓 Learning Resources

This backend demonstrates:
- **MVC Architecture** - Separation of concerns
- **RESTful Design** - Standard API patterns
- **Authentication** - JWT implementation
- **Authorization** - Role-based access
- **ODM Usage** - Mongoose patterns
- **Error Handling** - Try-catch & middleware
- **File Uploads** - Cloud storage integration
- **Database Design** - Schema relationships
- **Security** - Password hashing, token management
- **Best Practices** - Clean code, modularity

---

**Architecture designed and implemented for production use** ✨
