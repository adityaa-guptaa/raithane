# API Documentation - Raithane E-Commerce Backend

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 📍 PUBLIC ENDPOINTS

### Register User
```http
POST /auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

---

### Get Products
```http
GET /products?page=1&limit=12&category=electronics&search=phone&minPrice=1000&maxPrice=50000&featured=true&sort=price-asc
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `category` - Category slug
- `search` - Search by product name
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `featured` - true/false
- `newArrival` - true/false
- `sort` - Options: price-asc, price-desc, name, rating

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Product Name",
      "slug": "product-name",
      "price": 1999,
      "originalPrice": 2999,
      "discount": 33,
      "images": [
        {
          "public_id": "...",
          "secure_url": "https://..."
        }
      ],
      "stock": 50,
      "category": {
        "_id": "...",
        "name": "Electronics",
        "slug": "electronics"
      },
      "rating": 4.5,
      "isActive": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 60,
    "itemsPerPage": 12,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Get Single Product
```http
GET /products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Product Name",
    "description": "Full description...",
    "price": 1999,
    "images": [...],
    "stock": 50,
    "category": {...},
    "specifications": {
      "brand": "XYZ",
      "warranty": "1 year"
    },
    "tags": ["electronics", "trending"],
    "rating": 4.5,
    "numReviews": 120
  }
}
```

### Get Categories
```http
GET /categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Electronics",
      "slug": "electronics",
      "description": "...",
      "image": {
        "secure_url": "https://..."
      },
      "isActive": true
    }
  ]
}
```

---

## 🔒 USER ENDPOINTS (Requires Authentication)

### Get Current User
```http
GET /auth/me
```
**Headers:** `Authorization: Bearer <token>`

### Update Profile
```http
PUT /auth/update-profile
```
**Body:**
```json
{
  "name": "John Updated",
  "phone": "9876543210",
  "address": {
    "street": "456 New St",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001"
  }
}
```

### Get Cart
```http
GET /cart
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "user": "...",
    "items": [
      {
        "_id": "...",
        "product": {
          "_id": "...",
          "name": "Product Name",
          "price": 1999,
          "images": [...],
          "stock": 50
        },
        "quantity": 2,
        "price": 1999
      }
    ],
    "totalItems": 2,
    "totalPrice": 3998
  }
}
```

### Add to Cart
```http
POST /cart/add
```

**Body:**
```json
{
  "productId": "...",
  "quantity": 2
}
```

### Update Cart Item
```http
PUT /cart/update/:itemId
```

**Body:**
```json
{
  "quantity": 3
}
```

### Remove from Cart
```http
DELETE /cart/remove/:itemId
```

### Clear Cart
```http
DELETE /cart/clear
```

### Create Order
```http
POST /orders
```

**Body:**
```json
{
  "shippingAddress": {
    "name": "John Doe",
    "phone": "9876543210",
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "paymentMethod": "cod",
  "customerNote": "Please deliver in evening"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "orderNumber": "ORD-12345678901",
    "items": [...],
    "itemsPrice": 3998,
    "shippingPrice": 0,
    "taxPrice": 719.64,
    "totalPrice": 4717.64,
    "status": "pending",
    "createdAt": "..."
  },
  "message": "Order placed successfully"
}
```

### Get User Orders
```http
GET /orders?page=1&limit=10
```

### Get Order Details
```http
GET /orders/:id
```

### Cancel Order
```http
PUT /orders/:id/cancel
```

**Body:**
```json
{
  "reason": "Changed my mind"
}
```

---

## 👨‍💼 ADMIN ENDPOINTS (Requires Admin Role)

All admin endpoints require `Authorization: Bearer <admin_token>`

### Products

#### Create Product
```http
POST /admin/products
```

**Body:**
```json
{
  "name": "New Product",
  "description": "Product description...",
  "shortDescription": "Short desc...",
  "price": 1999,
  "originalPrice": 2999,
  "discount": 33,
  "category": "category_id",
  "stock": 100,
  "specifications": {
    "brand": "XYZ",
    "warranty": "1 year"
  },
  "tags": ["electronics", "trending"],
  "isFeatured": true,
  "isNewArrival": true
}
```

#### Update Product
```http
PUT /admin/products/:id
```

#### Delete Product
```http
DELETE /admin/products/:id
```

#### Upload Product Images
```http
POST /admin/products/:id/images
```

**Body:**
```json
{
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ]
}
```

#### Delete Product Image
```http
DELETE /admin/products/:id/images/:imageId
```

#### Toggle Product Status
```http
PATCH /admin/products/:id/toggle-status
```

### Categories

#### Create Category
```http
POST /admin/categories
```

**Body:**
```json
{
  "name": "New Category",
  "description": "Category description...",
  "sortOrder": 1
}
```

#### Update Category
```http
PUT /admin/categories/:id
```

#### Delete Category
```http
DELETE /admin/categories/:id
```

#### Upload Category Image
```http
POST /admin/categories/:id/image
```

**Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

### Orders

#### Get All Orders
```http
GET /admin/orders?page=1&status=pending&startDate=2024-01-01&endDate=2024-12-31
```

**Query Parameters:**
- `page` - Page number
- `status` - Filter by status
- `startDate` - Filter from date
- `endDate` - Filter to date
- `orderNumber` - Search by order number

#### Update Order Status
```http
PUT /admin/orders/:id/status
```

**Body:**
```json
{
  "status": "confirmed",
  "note": "Order confirmed and ready for processing"
}
```

**Valid statuses:** pending, confirmed, processing, picked_up, out_for_delivery, delivered, cancelled

#### Assign Delivery Person
```http
PUT /admin/orders/:id/assign-delivery
```

**Body:**
```json
{
  "deliveryPersonId": "delivery_user_id"
}
```

#### Get Statistics
```http
GET /admin/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 150,
    "pendingOrders": 12,
    "deliveredOrders": 120,
    "todayOrders": 5,
    "totalRevenue": 450000
  }
}
```

---

## 🚚 DELIVERY ENDPOINTS (Requires Delivery Role)

All delivery endpoints require `Authorization: Bearer <delivery_token>`

### Get Assigned Orders
```http
GET /delivery/orders?page=1&status=processing
```

### Get Order Details
```http
GET /delivery/orders/:id
```

### Update Order Status
```http
PUT /delivery/orders/:id/status
```

**Body:**
```json
{
  "status": "picked_up",
  "note": "Package picked up from warehouse"
}
```

**Allowed statuses for delivery:**
- `picked_up` - From processing
- `out_for_delivery` - From picked_up
- `delivered` - From out_for_delivery

### Get Delivery Statistics
```http
GET /delivery/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAssignedOrders": 45,
    "pendingPickup": 3,
    "outForDelivery": 2,
    "deliveredToday": 5,
    "totalDelivered": 40
  }
}
```

---

## ⚠️ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

---

## 📝 Notes

1. **Pagination:** Most list endpoints support pagination via `page` and `limit` query params
2. **Image Upload:** Send images as base64 strings in request body
3. **Dates:** All dates are in ISO 8601 format
4. **Prices:** All prices are in Nepali Rupees (NPR - Rs.)
5. **Stock:** Stock is automatically managed on order placement/cancellation
6. **Shipping:** Free shipping on orders over Rs.500, otherwise Rs.50
7. **Tax:** 18% GST automatically applied to all orders

---

## 🔐 Default Test Credentials

**Admin:**
```
Email: admin@raithane.com
Password: Admin@123
```

**Delivery:**
```
Email: delivery@raithane.com
Password: Delivery@123
```

⚠️ Change these in production!
