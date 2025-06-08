# 🛒 E-Commerce Backend

This is the backend service for a custom-built e-commerce platform developed with **Node.js**, **Express.js**, and **MongoDB**. It features secure authentication, admin control, order management, product image uploads, and more. Designed with scalability and real-world production readiness in mind.

## 🔧 Tech Stack

- **Backend Framework**: Node.js, Express.js  
- **Database**: MongoDB + Mongoose  
- **Authentication**: JWT with HTTP-only cookies  
- **Email Services**: Nodemailer (SendGrid or Gmail)  
- **File Uploads**: Cloudinary + Multer  
- **CI/CD & Deployment**: GitLab, Docker, (optional AWS/Vercel for frontend)  
- **Testing**: In progress (Jest, Supertest)

## 🚀 Features

### 👤 User & Auth
- Signup with email verification (token + expiry)
- Login with JWT in HTTP-only cookies
- Forgot/Reset password via email link
- Two-Factor / email verification logic with expiry handling
- Role-based access (User / Admin)

### 🛍️ Product Management
- Admin product CRUD
- Cloudinary image upload support
- Category and tag filtering (in progress)
- Pagination & search support

### 📦 Orders & Cart
- Add to cart, update quantity, delete
- Place order (Cash on Delivery supported)
- Manual payment confirmation logic (no Stripe webhook)
- Track order status (e.g., delivered/pending)
- Order history per user

### 📊 Admin Dashboard
- Total revenue calculation
- User count, order count
- Monthly/weekly statistics endpoints
- Basic analytics-ready structure

### ❤️ Extras (WIP)
- Wishlist functionality
- Product reviews with rating & text
- Password update via settings
- Email confirmations on order/payment

---

## 📂 Project Structure

```

ecommerce-backend/
│
├── config/              # DB, Cloudinary, ENV setup
├── controllers/         # Core route logic (auth, order, product, user)
├── middleware/          # JWT auth, role-based access, error handlers
├── models/              # Mongoose schemas for User, Product, Order, etc.
├── routes/              # Express routers
├── utils/               # Email sending, token generation, storage utils
├── uploads/             # (optional local image storage)
├── .env.example         # Sample environment file
└── server.js            # Entry point

```

---

## 🧪 Environment Variables (`.env`)

Create a `.env` file in the root folder:

```

PORT=5000
MONGODB\_URI=your\_mongo\_uri
JWT\_SECRET=your\_jwt\_secret
JWT\_EXPIRY=1d
EMAIL\_HOST=smtp.example.com
EMAIL\_PORT=587
EMAIL\_USER=your\_email
EMAIL\_PASS=your\_password
CLOUDINARY\_CLOUD\_NAME=your\_cloud\_name
CLOUDINARY\_API\_KEY=your\_api\_key
CLOUDINARY\_API\_SECRET=your\_api\_secret

````

---

## 🛠️ Getting Started (Local Dev)

```bash
git clone https://gitlab.com/EshanHarshana/ecommerce-backend.git
cd ecommerce-backend
npm install
cp .env.example .env
# Fill in the env file
npm run dev
````

The server runs on `http://localhost:5000/` (or whatever your env port is).

---

## 📬 API Routes Overview

| Route                                 | Description                       |
| ------------------------------------- | --------------------------------- |
| POST `/api/auth/signup`               | Register new user + email verify  |
| POST `/api/auth/login`                | Login with JWT cookie             |
| POST `/api/auth/forgot-password`      | Email password reset link         |
| PUT `/api/auth/reset-password/:token` | Reset password                    |
| GET `/api/users/me`                   | Authenticated user profile        |
| POST `/api/products`                  | Admin product upload (with image) |
| GET `/api/products`                   | Public product list with filters  |
| POST `/api/orders`                    | Place a new order                 |
| GET `/api/orders/mine`                | Get logged-in user's orders       |
| GET `/api/admin/stats`                | Admin dashboard stats             |

> Full API docs with Postman collection coming soon 📬

---

## 🧠 Future Plans

* Add Stripe (or other gateway) with webhook handling
* Full unit/integration test coverage
* Deploy on Render/Vercel + MongoDB Atlas
* Dockerize for local + production CI/CD
* Implement rate limiting & advanced security (Helmet, CSP, etc.)

---

## 🧑‍💻 Author

**Eshan Harshana**
Full-Stack Developer | Kegalle, Sri Lanka
📧 [eshanharshanag@gmail.com](mailto:eshanharshanag@gmail.com)
🔗 [LinkedIn](https://linkedin.com/in/eshanharshana) | [GitLab](https://gitlab.com/EshanHarshana)

---

> Built with love, sweat, and many cups of tea 🍵.
> Let's get this e-commerce engine running at scale. 💸
