# Veterinary Services User Panel

> **Automated Scheduling and Tracking System for Veterinary Services**  
> Calapan City, Oriental Mindoro

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-React%2018.2.0-blue)
![Backend](https://img.shields.io/badge/backend-Lavalust%204.4.0-orange)

---

## 🎯 Overview

Complete separation of frontend (React) and backend (Lavalust PHP) for a veterinary appointment booking system. Features pet management, appointment scheduling with real-time time slot checking, veterinarian directory, and user profile management.

### ✨ Key Features

- 🐾 **Pet Management**: Add, edit, delete pets with photo uploads and QR code generation
- 📅 **Smart Booking**: Real-time appointment scheduling with time slot availability
- 👨‍⚕️ **Vet Directory**: Browse veterinarians with specializations and contact info
- 🔐 **Secure Auth**: Session-based authentication with password hashing
- 📱 **Responsive UI**: Exact pixel-perfect replication of original PHP views
- 🎨 **Modern Design**: Glassmorphism, gradients, smooth animations

---

## 🚀 Quick Start

### Prerequisites
- XAMPP (Apache + MySQL)
- Node.js 16+ and npm
- Modern web browser

### 1. Start Backend
```powershell
# Open XAMPP Control Panel
# Start Apache and MySQL
```

### 2. Start Frontend
```powershell
cd userpanel-frontend
npm install
npm run dev
```

### 3. Access Application
**Frontend**: http://localhost:5174/  
**Backend**: http://localhost/userpanel-event/userpanel-backend/

---

## 📁 Project Structure

```
userpanel-event/
├── userpanel-frontend/          # React + Vite frontend
│   ├── src/pages/              # All page components
│   ├── src/components/         # Layout & reusable components
│   ├── src/AuthContext.jsx    # Auth state management
│   └── src/api.js             # Axios API wrapper
│
├── userpanel-backend/          # Lavalust 4.4.0 PHP backend
│   ├── app/controllers/       # Dual-mode API controllers
│   ├── app/models/           # Database models
│   ├── app/config/           # Database & routes config
│   └── writable/qrcodes/     # Generated QR codes
│
├── API_REFERENCE.md           # Complete API documentation
├── IMPLEMENTATION_COMPLETE.md # Technical details
├── QUICK_START.md            # Getting started guide
└── README.md                 # This file
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **Vite 5.0.0** - Build tool & dev server
- **Axios** - HTTP client
- **React Router** - Navigation
- **Context API** - State management

### Backend
- **Lavalust 4.4.0** - PHP framework
- **MySQL** - Database
- **PHP QR Code** - QR generation
- **PHP Session** - Authentication

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](QUICK_START.md) | Step-by-step setup guide |
| [API_REFERENCE.md](API_REFERENCE.md) | Complete API endpoints documentation |
| [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md) | Full technical implementation details |

---

## 🎨 Features in Detail

### Pet Management
- ✅ Add pets with photos
- ✅ Auto-calculate age from birthdate
- ✅ Generate unique QR codes per pet
- ✅ Download QR codes as PNG
- ✅ Edit pet details
- ✅ Delete pets with confirmation

### Appointment System
- ✅ Book appointments with date picker
- ✅ Time slot selection (09:00-16:00)
- ✅ Real-time availability checking
- ✅ Service selection with pricing
- ✅ Veterinarian filtering by specialization
- ✅ View upcoming & past appointments
- ✅ Cancel pending appointments
- ✅ Status tracking (Pending, Confirmed, Completed, Cancelled)

### User Management
- ✅ Secure registration & login
- ✅ Session-based authentication
- ✅ Profile updates
- ✅ Password change with validation
- ✅ Protected routes

### Veterinarian Directory
- ✅ View all active vets
- ✅ Specialization badges
- ✅ Contact information
- ✅ Years of experience display

---

## 🎯 Status

**Current Version**: 1.0.0  
**Status**: ✅ **Production Ready**  
**Last Updated**: January 16, 2025

### Completed Features
✅ Full authentication system  
✅ Pet CRUD with photo uploads  
✅ QR code generation & download  
✅ Smart appointment booking  
✅ Real-time time slot checking  
✅ Veterinarian directory  
✅ User profile management  
✅ Password change functionality  
✅ Responsive sidebar navigation  
✅ Exact UI replication from PHP views  
✅ Dual-mode backend (API + Views)  
✅ CORS configuration  
✅ Session management  
✅ Form validation  
✅ Error handling  

---

## 🐛 Troubleshooting

### Common Issues

**Backend not loading**
- Check XAMPP Apache & MySQL are running (green lights)
- Verify URL: `http://localhost/userpanel-event/userpanel-backend/`

**Frontend not loading**
- Check terminal for Vite errors
- Run `npm install` if packages missing
- Verify port 5174 is available

**CORS errors**
- Check backend `index.php` has CORS headers
- Verify `.env` has correct API URL
- Ensure `withCredentials: true` in axios

**Login issues**
- Clear browser cookies
- Check backend session directory is writable
- Verify database connection

---

## 📞 Support

For issues or questions:
1. Check [QUICK_START.md](QUICK_START.md) for setup help
2. Review [API_REFERENCE.md](API_REFERENCE.md) for endpoint details
3. Check browser console for frontend errors (F12)
4. Review PHP error logs (`xampp/apache/logs/error.log`)

---

**Made with ❤️ for Veterinary Services in Calapan City, Oriental Mindoro**

🐾 **Happy Pet Care!** 🐾
