# Raithane E-Commerce Platform - Frontend

Full-stack e-commerce application built with React, TypeScript, and Tailwind CSS.

## Features

### Customer Features
- Browse products with search, filter, and pagination
- View product details with image gallery
- Add to cart and manage quantities
- Checkout with shipping address
- Track orders with status updates
- User authentication (login/register)

### Admin Features
- Dashboard with statistics
- Product management (CRUD operations)
- Category management
- Order management
- Assign delivery personnel to orders
- Update order status

### Delivery Personnel Features
- View assigned deliveries
- Update delivery status
- Track delivery statistics
- View customer and delivery information

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router v7** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── NavbarAuth.tsx   # Navigation with auth
│   │   ├── ProtectedRoute.tsx
│   │   └── ...
│   ├── context/             # React Context providers
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── CartContext.tsx  # Shopping cart state
│   ├── pages/               # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── admin/           # Admin pages
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminProductsPage.tsx
│   │   │   ├── AdminProductFormPage.tsx
│   │   │   ├── AdminOrdersPage.tsx
│   │   │   └── AdminOrderDetailPage.tsx
│   │   └── delivery/        # Delivery pages
│   │       ├── DeliveryDashboard.tsx
│   │       ├── DeliveryOrdersPage.tsx
│   │       └── DeliveryOrderDetailPage.tsx
│   ├── config/
│   │   └── api.ts           # API configuration
│   ├── App.tsx              # Root component with routes
│   └── main.tsx             # Entry point
├── .env                     # Environment variables
├── package.json
└── vite.config.ts
```

## API Integration

The frontend communicates with the backend API using the following structure:

### API Configuration (`src/config/api.ts`)

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    // ...
  },
  // Product endpoints
  PRODUCTS: {
    GET_ALL: '/api/products',
    GET_PRODUCT: (id: string) => `/api/products/${id}`,
    // ...
  },
  // ... more endpoints
};
```

### Making API Requests

```typescript
import { API_ENDPOINTS, apiRequest } from '../config/api';

// GET request
const response = await apiRequest(API_ENDPOINTS.PRODUCTS.GET_ALL);

// POST request
const response = await apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});
```

## Authentication

The app uses JWT tokens stored in `localStorage`. The `AuthContext` provides:

- `user` - Current user object
- `login(email, password)` - Login function
- `register(userData)` - Registration function
- `logout()` - Logout function
- `isAdmin()` - Check if user is admin
- `isDelivery()` - Check if user is delivery personnel
- `isCustomer()` - Check if user is customer

## Protected Routes

Routes are protected using the `ProtectedRoute` component:

```typescript
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

## User Roles

### Admin
- Can access `/admin/*` routes
- Manage products, categories, orders
- Assign delivery personnel
- View dashboard statistics

### Delivery Personnel
- Can access `/delivery/*` routes
- View assigned orders
- Update delivery status
- Track delivery statistics

### Customer (Default)
- Can access public and customer routes
- Browse and purchase products
- Manage cart
- View order history

## Testing Accounts

You can create test accounts using the registration page or use the seeded accounts from the backend:

**Admin:**
- Email: `admin@raithane.com`
- Password: `admin123`

**Delivery:**
- Email: `delivery@raithane.com`
- Password: `delivery123`

**Customer:**
- Create via registration page

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

## Key Features Implementation

### Product Browsing
- Real-time search
- Category filtering
- Price sorting (ascending/descending)
- Pagination with page navigation
- Stock availability display

### Shopping Cart
- Add/remove items
- Update quantities
- Real-time total calculation
- Persistent cart (synced with backend)
- Free shipping threshold indicator

### Checkout Process
1. Cart review
2. Shipping address entry
3. Payment method selection (COD/Online)
4. Order confirmation
5. Redirect to order details

### Order Tracking
- Order list with status badges
- Detailed order view
- Status timeline (pending → confirmed → processing → shipped → delivered)
- Delivery person information (when assigned)

### Admin Dashboard
- Statistics cards (revenue, orders, products, users)
- Recent orders table
- Quick action links
- Product management with search
- Order management with filters
- Delivery assignment interface

### Delivery Dashboard
- Delivery statistics (assigned, pending, in-transit, delivered)
- Quick filters by status
- Customer contact information
- Google Maps integration for addresses
- Status update buttons

## Troubleshooting

### CORS Errors
Make sure the backend has CORS enabled for `http://localhost:5173`

### Authentication Issues
- Clear localStorage and try logging in again
- Check if backend is running
- Verify JWT token in localStorage

### API Connection Errors
- Verify `.env` file has correct `VITE_API_URL`
- Ensure backend is running on the specified port
- Check browser console for error details

## Future Enhancements

- [ ] Image upload for products (Cloudinary integration)
- [ ] Real-time order status updates (WebSocket)
- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
