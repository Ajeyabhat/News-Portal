# News Portal

A comprehensive news platform with article management, user authentication, institution support, and admin dashboard.

## Project Overview

- **Frontend:** React 18 + Vite + Tailwind CSS v4 + React Router v6
- **Backend:** Node.js + Express + MongoDB + Mongoose  
- **Authentication:** JWT (7-day) + OTP (6-digit, 5-min) + bcryptjs
- **File Handling:** Multer + Sharp (80% compression, WebP format)
- **Features:** Article management, bookmarks, institution submissions, admin controls (bulk delete users), dark mode, multi-language support

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

### Frontend Setup

```bash
cd client
npm install
```

Create `.env`:
```
VITE_API_BASE_URL=http://localhost:5000
```

Start dev server:
```bash
npm run dev
```

Runs at `http://localhost:3001`

### Backend Setup

```bash
cd server
npm install
```

Create `.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start server:
```bash
npm start
```

Server runs at `http://localhost:5000`

## Project Structure

```
News-Portal/
├── client/              # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/              # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── index.js
│   └── package.json
├── .gitignore
└── STRUCTURE.md         # Detailed architecture
```

## Key Features

### User Roles
- **Reader** - Browse, search, and bookmark articles
- **Institution** - Submit articles via dashboard
- **Admin** - Manage users, content, and submissions

### Authentication
- Secure login/registration
- 6-digit OTP verification (5-min expiration)
- JWT tokens (7-day validity)
- Password hashing with bcryptjs

### Content Management
- Rich text editor for article creation
- Image upload with auto-compression (80% reduction)
- Article search and filtering
- Bookmarking system

### Admin Panel
- User management with role badges
- Content submission inbox (Institution + External)
- Article publishing workflow
- Event management

## Available Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
npm start            # Start server
npm run dev          # Start with nodemon (auto-reload)
```

## Tech Stack

**Frontend:**
- React 18, React Router v6, Vite
- Tailwind CSS v4, Axios
- React Quill (text editor), Lucide React (icons)
- React Hot Toast (notifications)

**Backend:**
- Express.js, MongoDB, Mongoose
- JWT, Bcryptjs (security)
- Multer + Sharp (file uploads & compression)
- Nodemailer (email verification)
- CORS, Rate Limiting

## Documentation

- `STRUCTURE.md` - Detailed project architecture and folder organization
- API endpoints documented in backend routes

## Browser Support

Chrome, Firefox, Safari, Edge (latest versions)

## License

Proprietary and confidential.
