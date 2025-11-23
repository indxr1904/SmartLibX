# 📚 SmartLibX – Role-Based Library Management System

SmartLibX is a modern MERN-based Library Management System designed for schools, colleges, and institutions. It provides secure Role-Based Access Control (RBAC), automated book assignment workflows, overdue detection, centralized dashboards, and a polished UI for easy management of library operations.

This system replaces manual logbooks with a smart digital platform that automates issuing, returning, tracking, and reporting of books.

---

[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-API-b23a48.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen.svg)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-ODM-red.svg)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-orange.svg)](https://jwt.io/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-yellow.svg)](https://nodemailer.com/about/)
[![Mailtrap](https://img.shields.io/badge/Mailtrap-Testing_Email-5A4FCF.svg)](https://mailtrap.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-0ea5e9.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-Build_Tool-purple.svg)](https://vitejs.dev/)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()



## 🚀 Quick Start (5 Minutes)
### Prerequisites

- Node.js 18+
- MongoDB (Local or Atlas)
- Git installed
- A modern browser

## Setup Steps
```bash
# 1. Clone repository
git clone https://github.com/indxr1904/SmartLibX.git
cd SmartLibX

# 2. Setup Backend
cd backend
npm install
cp .env.example .env   # Add your MongoDB URL & JWT secret
npm start              # Starts backend at http://localhost:3000

# 3. Setup Frontend
cd ../frontend
npm install
npm run dev            # Starts frontend at http://localhost:5173
```
## 🔑 Default Login 

### For Admin:
 - 📧 Email: exampleadmin@gmail.com.com
 - 🔐 Password: admin123

### For Librarian:
 - 📧 Email: librarian@gmail.com.com
 - 🔐 Password: librarian123

### For Student:
 - 📧 Email: student@gmail.com.com
 - 🔐 Password: student123

### ⚠️ Change default credentials immediately!**

## 📦 What Components Are Running?

| Component |	Port |	Description |
|-----------|------|--------------|
| Frontend (React) |	5173 |	User Interface |
| Backend (Express API) |	3000 |	Authentication, Assignments, Books |
| MongoDB	| 27017 or Atlas |	Database |

## 🏗 Project Structure

```
SmartLibX/
├── backend/
│   ├── controllers/         # Business logic
│   ├── models/              # Mongoose schemas
│   ├── routes/              # REST API routes
│   ├── middleware/          # Auth & error handling
│   ├── config/              # DB connection
│   ├── utils/               # Helpers
│   ├── server.js            # App entry point
│   └── .env.example         # Environment template
│
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Pages
│   │   ├── context/         # Auth & state
│   │   ├── router/          # Protected routes
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── vite.config.js
│
└── README.md
```
---

 ## 🛠 Development Workflow

 **Make Code Changes**

 **React + Node both support hot reload.**

 ## Frontend:
 ```bash
# Start Frontend Server
npm run dev
```
## Backend:
```bash
# Start Backend Server
npm start
```
## View Logs:
**Backend Logs**
```bash
# Check Logs
npm run logs
```
## MongoDB logs:

-Local: mongod --verbose
-Atlas: Via dashboard logging

## Install New Backend Dependencies

```bash
# Install a new backend dependency
npm install <package-name>

# Start the backend server
npm start
```

## Install New Frontend Dependencies
```bash
# Install a new frontend dependency
npm install <package-name>

# Start the development server (Vite)
npm run dev
```

## 🔌 Environment Variables

**Backend (.env)**
```bash
# MongoDB connection string (Local or Atlas)
MONGO_URI=mongodb://localhost:27017/smartlibx

# Secret key used to sign JWT authentication tokens
JWT_SECRET=your_jwt_secret

# Port on which the backend server will run
PORT=3000

# JWT token expiration duration
TOKEN_EXPIRE=7d
```
## 📖 API Documentation
**SmartLibX exposes multiple REST API routes.**

## 🔐 Auth APIs
```bash
# Create user (Admin role only)
POST /api/v1/auth/register

# Login + JWT response
POST /api/v1/auth/login
```
## 📚 Book APIs
```bash
# Add a new book
POST /api/v1/books

Body:
{
  "title": "JavaScript Guide",   // Title of the book
  "author": "John Doe",         // Name of the book's author
  "isbn": "123456789"           // Unique ISBN identifier for the book
}

# Get all books
GET /api/v1/books

# Update book
PUT /api/v1/books/:id

# Delete book
DELETE /api/v1/books/:id
```
## 📧 Email Service
### Used internally for:

- Sending overdue notifications
- Sending registration confirmation (if enabled)
- Sending password reset emails (optional future feature)

### Example backend usage:
```bash
// Send an email using Nodemailer transporter
await transporter.sendMail({
  
  // Recipient email address (student receiving the notice)
  to: student.email,

  // Subject line of the email
  subject: "Book Overdue Notice",

  // HTML content of the email body
  html: `
    <p>Your borrowed book is now overdue.</p>
    <p>Please return it as soon as possible to avoid penalties.</p>
  `
});
```

## 🐛 Troubleshooting
## ❌ Frontend not loading?
```bash
# Install all frontend dependencies listed in package.json
npm install

# Start the frontend development server (Vite)
npm run dev
```

## ❌ Backend not connecting to MongoDB?
```bash
# Verify that your MongoDB URL is correctly set in the backend .env file
# Example:
# MONGO_URI=mongodb://localhost:27017/smartlibx
Check MONGO_URI in .env

# Make sure your MongoDB server is running locally or your Atlas cluster is online
Ensure MongoDB is running
```

## ❌ CORS errors?
### - Add frontend URL in backend CORS config.

## ❌ JWT errors?
### Ensure:
### - Valid JWT_SECRET
### - Correct Authorization header

## ❌ Assignment delete failing?
### - Make sure you're passing _id not _1d.

## 🚀 Deployment Guide
### Frontend Deployment (Netlify/Vercel)
```bash
# Upload the dist/ folder.
npm run build
```

## Backend Deployment (Render/Railway)
### - Set environment variables
### - Deploy GitHub repo
### - Add MongoDB Atlas connection

## Database (MongoDB Atlas)
### - Create free cluster
### - Whitelist all IPs
### - Use connection string in backend .env

## 📚 Tech Stack
### Frontend

- React.js
- Vite
- TailwindCSS
- React Router
- React Icons
  
### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer
- Mailtrap

## 👥 Team Collaboration
### Git Workflow
```bash
# Create and switch to a new feature branch
# Use this when you start working on a new feature or change
git checkout -b feature/your-feature

# Stage all modified files for commit
git add .

# Commit your changes with a meaningful message
git commit -m "Added new feature"

# Push your new branch to the remote repository on GitHub
git push origin feature/your-feature
```
## Pull Requests
### - Always create PRs for new features.

## 🎯 Roadmap

- [x] Role-based authentication
- [x] Book management
- [x] Book assignment
- [x] Overdue detection
- [x] Server-side pagination
- [x] Email reminders
- [x] Dashboard analytics
- [x] Student onboarding email
- [ ] Mobile app
- [ ] Email templates for overdue reminders
- [ ] Book availability notification
- [ ] Daily summary email for librarians
- [ ] Admin weekly analytics email

 ---

## 📖 Additional Documentation

- [React.js Official Docs](https://react.dev/)
- [Vite Build Tool Docs](https://vitejs.dev/guide/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Routing Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB 6.x Manual](https://www.mongodb.com/docs/manual/)
- [Mongoose ODM Docs](https://mongoosejs.com/docs/)
- [JWT.io (JSON Web Tokens)](https://jwt.io/introduction)
- [Nodemailer Documentation](https://nodemailer.com/about/)
- [Mailtrap Email Testing Docs](https://help.mailtrap.io/)
- [REST API Best Practices](https://restfulapi.net/)
- [JavaScript ES6+ Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [HTTP Status Codes Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

## 📝 License

[Your License Here]

---

## 💬 Support

For issues or questions:
- Open an issue on GitHub
- Contact: [Your Contact Info]
- Documentation: [Your Docs URL]

---

**Made with ❤️ to support coding community**

**Happy Coding! 🎉**
