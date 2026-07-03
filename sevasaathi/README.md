# SevaSaathi — India's Smart Local Service Marketplace

Book Trusted Mechanics, Electricians, Plumbers, Cooks & Local Experts at Your Doorstep.

## Stack
- **Frontend:** React.js (Vite), Tailwind CSS, React Router DOM, Axios, React Hook Form, Context API, Framer Motion
- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcrypt, Multer, Nodemailer, PDFKit

## What's included so far
- ✅ Phase 1 — Project Setup (folder structure, configs, DB connection)
- ✅ Phase 2 — Authentication Module (Register, Login, Logout, Forgot/Reset Password, JWT, Role-based middleware, frontend pages)

Remaining phases (Profile, Providers, Categories, Bookings, Reviews, Favorites,
Emergency Booking, Marketplace, Vehicle Garage, Invoices, Notifications,
Provider Dashboard, Admin Panel, Final UI polish, Deployment) will be built
module-by-module on request, per the original spec.

## Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env   # then fill in your MongoDB URI, JWT secret, SMTP creds
npm run dev             # starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev             # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so no
extra CORS config is needed in development.

## API Endpoints (Phase 2)

| Method | Endpoint                              | Access  | Description             |
|--------|----------------------------------------|---------|--------------------------|
| POST   | /api/auth/register                    | Public  | Register customer/provider |
| POST   | /api/auth/login                       | Public  | Login, returns JWT       |
| POST   | /api/auth/logout                      | Private | Clears auth cookie       |
| GET    | /api/auth/me                          | Private | Get logged-in user       |
| POST   | /api/auth/forgot-password             | Public  | Sends reset email        |
| PUT    | /api/auth/reset-password/:resetToken  | Public  | Sets new password        |

## Folder Structure

```
sevasaathi/
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Route handler logic
│   ├── middleware/     # Auth, error handling, async wrapper
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── services/       # (for future business logic layer)
│   ├── utils/          # Token, email, custom error helpers
│   ├── uploads/         # Multer file uploads
│   ├── app.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/  # Navbar, ProtectedRoute, etc.
        ├── pages/       # Login, Register, ForgotPassword, Home
        ├── layouts/     # MainLayout
        ├── context/     # AuthContext
        ├── services/    # Axios instance
        ├── App.jsx
        └── main.jsx
```

## Next Steps
Tell me which phase to build next (e.g. "Phase 3 — User Profile Module") and
I'll generate the models, APIs, and frontend pages for it, following the same
structure and patterns established here.
