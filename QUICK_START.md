# 🚀 Quick Start Guide - Raithane E-Commerce

## ⚡ Start the Application (2 Commands)

### Terminal 1 - Backend

```bash
cd /Users/adityagupta/Personal/raithane/backend
npm run dev
```

✅ Backend will run on: **http://localhost:5001**

### Terminal 2 - Frontend

```bash
cd /Users/adityagupta/Personal/raithane/frontend
npm run dev
```

✅ Frontend will run on: **http://localhost:5173**

---

## 🧪 Quick Test (5 Minutes)

### 1. Register & Login

- Open http://localhost:5173
- Click **"Register"**
- Create account with:
  - Name: Test User
  - Email: test@example.com
  - Password: password123
  - Phone: 9876543210

### 2. Add Products to Cart

- Browse products on homepage
- Click **"Add to Cart"** on any product
- See cart count update in navbar

### 3. Complete Checkout

- Click cart icon in navbar
- Click **"Proceed to Checkout"**
- Fill shipping address:
  - Street: 123 Main Street
  - City: Kathmandu
  - State: Bagmati
  - ZIP: 44600
  - Country: Nepal
- Click **"Place Order"**

### 4. View Success & Track Order

- See beautiful success page ✨
- Click **"View My Orders"**
- Click on your order to see details
- See order timeline and status

---

## 👥 Test Accounts

### Admin Access

```
Email: admin@raithane.com
Password: admin123
URL: http://localhost:5173/admin
```

### Delivery Access

```
Email: delivery@raithane.com
Password: delivery123
URL: http://localhost:5173/delivery
```

---

## 📊 Order Status Flow

```
Pending → Confirmed → Processing → Picked Up → Out for Delivery → Delivered
```

---

## 🔧 Troubleshooting

### Backend Not Starting?

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Frontend Not Starting?

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### MongoDB Connection Error?

- Check `.env` file in backend folder
- Verify `MONGODB_URI` is correct
- Ensure internet connection is active

### Port Already in Use?

```bash
# Kill process on port 5001 (backend)
lsof -ti:5001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

---

## 📁 Project Structure

```
raithane/
├── backend/                 # Node.js + Express API
│   ├── models/             # MongoDB models
│   ├── controllers/        # Route controllers
│   ├── routes/             # API routes
│   ├── middleware/         # Auth & error handling
│   └── index.js           # Server entry point
│
├── frontend/               # React + TypeScript
│   ├── src/
│   │   ├── pages/         # All pages
│   │   ├── components/    # Reusable components
│   │   ├── context/       # State management
│   │   └── config/        # API configuration
│   └── index.html
│
└── Documentation/
    ├── COMPLETE_ORDER_FLOW.md
    ├── TESTING_GUIDE.md
    └── PROJECT_COMPLETION_SUMMARY.md
```

---

## ✅ What's Working

- ✅ User authentication
- ✅ Product browsing
- ✅ Cart management
- ✅ Complete checkout
- ✅ Order placement
- ✅ Order tracking
- ✅ Order cancellation
- ✅ Admin dashboard
- ✅ Delivery management
- ✅ Stock management

---

## 📞 Need Help?

1. Check **TESTING_GUIDE.md** for detailed testing
2. Check **COMPLETE_ORDER_FLOW.md** for setup details
3. Check **PROJECT_COMPLETION_SUMMARY.md** for features
4. Check browser console for errors
5. Check backend terminal for API errors

---

**Status**: ✅ Ready to Use
**Version**: 1.0.0
**Last Updated**: January 14, 2026
