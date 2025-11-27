# Quick Start Guide

## Prerequisites
- ✅ XAMPP installed (Apache + MySQL)
- ✅ Node.js and npm installed
- ✅ Git (optional)

---

## 1. Start Backend (Lavalust PHP)

### Start XAMPP
1. Open XAMPP Control Panel
2. Start **Apache**
3. Start **MySQL**

### Verify Backend
Open in browser: `http://localhost/userpanel-event/userpanel-backend/`

---

## 2. Start Frontend (React)

### Open Terminal
```powershell
cd c:\xampp\htdocs\userpanel-event\userpanel-frontend
npm run dev
```

### Access Application
Open browser: **http://localhost:5174/**

---

## 3. First-Time Setup

### Create Account
1. Click **Sign Up** button
2. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Password: (at least 8 characters)
   - Confirm Password: (same as above)
3. Click **Register**

### Login
1. Enter email and password
2. Click **Login**
3. You'll be redirected to landing page

---

## 4. Using the Application

### Add Your First Pet
1. Click **Pets** in sidebar
2. Click **+ Add Pet**
3. Fill in details:
   - Name: e.g., "Max"
   - Species: e.g., "Dog"
   - Breed: e.g., "Golden Retriever"
   - Birthdate: Select date (age auto-calculates)
   - Medical History: Any notes
   - Photo: Click to upload image
4. Click **Add Pet**

### Book an Appointment
1. Click **Appointments** in sidebar
2. Click **+ Book Appointment**
3. Select:
   - **Pet**: Choose from your pets
   - **Service**: Pick a service (shows price)
   - **Veterinarian**: Choose vet (filtered by specialization)
   - **Date**: Select date (today or future)
   - **Time**: Click available time slot (grayed out = booked)
5. Click **Book Appointment**

### View Veterinarians
1. Click **Veterinarians** in sidebar
2. Browse vet cards with:
   - Photo
   - Specialization
   - Contact info
   - Experience

### Update Your Profile
1. Click **Settings** in sidebar
2. **Update Profile**:
   - Change name or email
   - Click **Update Profile**
3. **Change Password**:
   - Enter current password
   - Enter new password
   - Confirm new password
   - Click **Change Password**

---

## 5. Features Overview

### ✅ Pet Management
- Add unlimited pets
- Upload pet photos
- Edit pet details
- Delete pets
- Generate QR codes
- Download QR codes

### ✅ Appointment System
- Book appointments with time slot picker
- Real-time availability checking
- View upcoming appointments
- See appointment history
- Cancel pending appointments
- Status tracking (Pending, Confirmed, Completed, Cancelled)

### ✅ Veterinarian Directory
- View all available vets
- See specializations
- Contact information
- Years of experience

### ✅ User Settings
- Update profile information
- Change password
- Session management

---

## 6. Troubleshooting

### Backend Not Loading
- ✅ Check XAMPP Apache is running (green)
- ✅ Check XAMPP MySQL is running (green)
- ✅ Verify URL: `http://localhost/userpanel-event/userpanel-backend/`

### Frontend Not Loading
- ✅ Check terminal for errors
- ✅ Verify npm packages installed: `npm install`
- ✅ Check port 5174 is available
- ✅ Look for console errors in browser (F12)

### CORS Errors
- ✅ Verify backend `index.php` has CORS headers
- ✅ Check frontend `.env` has correct API URL
- ✅ Ensure both servers are running

### Login/Session Issues
- ✅ Clear browser cookies
- ✅ Check session in backend (PHP session files)
- ✅ Verify `withCredentials: true` in axios config

### File Upload Not Working
- ✅ Check `app/uploads/pets/` directory exists
- ✅ Verify directory is writable (permissions)
- ✅ Check file size limits in `php.ini`
- ✅ Use FormData for file uploads

### Time Slots Not Loading
- ✅ Ensure service is selected first
- ✅ Check veterinarian is selected
- ✅ Verify date is today or future
- ✅ Check console for API errors

---

## 7. Development Commands

### Frontend Commands
```powershell
# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Commands
```powershell
# No build needed - PHP runs directly
# Just ensure XAMPP Apache is running
```

---

## 8. Project Structure Quick Reference

```
userpanel-event/
├── userpanel-frontend/          # React frontend
│   ├── src/
│   │   ├── pages/              # All page components
│   │   ├── components/         # Reusable components
│   │   ├── AuthContext.jsx    # Auth state management
│   │   ├── api.js             # API wrapper
│   │   └── main.jsx           # Entry point
│   ├── .env                    # Environment config
│   └── package.json           # Dependencies
│
├── userpanel-backend/          # Lavalust PHP backend
│   ├── app/
│   │   ├── controllers/       # API controllers
│   │   ├── models/           # Database models
│   │   ├── views/            # PHP views (legacy)
│   │   └── config/           # Configuration
│   ├── writable/qrcodes/     # Generated QR codes
│   ├── app/uploads/pets/     # Pet photos
│   └── index.php             # Entry point + CORS
│
├── API_REFERENCE.md           # Complete API docs
├── IMPLEMENTATION_COMPLETE.md # Full documentation
└── QUICK_START.md            # This file
```

---

## 9. Database Tables

### users
- id, name, email, password, created_at

### pets
- id, user_id, name, species, breed, birthdate, medical_history, photo, qr_code

### appointments
- id, user_id, pet_id, vet_id, service_id, appointment_date, appointment_time, status, remarks

### veterinarians
- id, name, specialization, email, contact_number, years_of_experience, photo, is_active

### services
- id, service_name, fee, description

---

## 10. Important URLs

| Service | URL | Port |
|---------|-----|------|
| Frontend | http://localhost:5174/ | 5174 |
| Backend | http://localhost/userpanel-event/userpanel-backend/ | 80 (Apache) |
| phpMyAdmin | http://localhost/phpmyadmin/ | 80 |

---

## 11. Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost/userpanel-event/userpanel-backend
```

**Note**: After changing `.env`, restart Vite dev server:
```powershell
# Stop: Ctrl+C
# Start: npm run dev
```

---

## 12. Common Issues & Solutions

### Issue: "Cannot read property 'map' of undefined"
**Solution**: Data not loaded yet. Add loading state:
```jsx
if (!data) return <div>Loading...</div>
```

### Issue: "Network Error" on API calls
**Solution**: 
1. Check backend is running
2. Verify CORS headers in `index.php`
3. Check `.env` has correct API URL

### Issue: Photos not displaying
**Solution**: 
1. Check file path in database
2. Verify `app/uploads/pets/` directory exists
3. Ensure Apache can serve from that directory

### Issue: Time slots all grayed out
**Solution**:
1. Check database has appointments table
2. Verify `booked_slots` API endpoint works
3. Check date format is YYYY-MM-DD

### Issue: QR codes not generating
**Solution**:
1. Check `writable/qrcodes/` directory exists
2. Verify directory is writable (777 permissions)
3. Ensure QR library is installed (`composer install`)

---

## 13. Testing Checklist

### Before Testing
- [ ] XAMPP Apache running
- [ ] XAMPP MySQL running
- [ ] Frontend dev server running (npm run dev)
- [ ] No console errors in browser (F12)

### Test Flow
- [ ] Register new account
- [ ] Login successfully
- [ ] View dashboard
- [ ] Add pet with photo
- [ ] Edit pet details
- [ ] View QR code
- [ ] Download QR code
- [ ] Book appointment
- [ ] Check booked time slots are grayed out
- [ ] View upcoming appointments
- [ ] Cancel appointment
- [ ] View veterinarians
- [ ] Update profile
- [ ] Change password
- [ ] Logout
- [ ] Login again (verify session)

---

## 14. Performance Tips

### Frontend
- Images automatically optimized by Vite
- Code splitting enabled
- Hot reload for fast development

### Backend
- Database queries optimized with indexes
- Session stored on server (not client)
- QR codes cached after generation

---

## 15. Security Notes

### Implemented
✅ Password hashing (PHP `password_hash`)  
✅ SQL injection prevention (prepared statements)  
✅ CSRF protection (session-based)  
✅ XSS prevention (htmlspecialchars)  
✅ File upload validation  
✅ Session timeout  

### Recommended for Production
- [ ] Add HTTPS (SSL certificate)
- [ ] Rate limiting on API endpoints
- [ ] Input sanitization on all forms
- [ ] File size limits for uploads
- [ ] Captcha on registration/login
- [ ] Email verification
- [ ] Two-factor authentication (2FA)

---

## 16. Support & Documentation

### Documentation Files
- **QUICK_START.md** - This file (getting started)
- **API_REFERENCE.md** - Complete API documentation
- **IMPLEMENTATION_COMPLETE.md** - Full technical details

### Getting Help
1. Check browser console (F12 → Console)
2. Check terminal output
3. Review PHP error logs (`xampp/apache/logs/error.log`)
4. Check network tab (F12 → Network)

---

## 17. Next Steps

After basic setup works:
1. Customize theme colors in CSS
2. Add more services to database
3. Add veterinarian profiles
4. Configure email notifications
5. Add appointment reminders
6. Implement payment gateway
7. Add admin panel

---

**Ready to Start?**

1. Start XAMPP (Apache + MySQL)
2. Open terminal: `cd c:\xampp\htdocs\userpanel-event\userpanel-frontend`
3. Run: `npm run dev`
4. Open browser: http://localhost:5174/
5. Create account and explore!

---

**Need Help?**
- Check console for errors (F12)
- Review API_REFERENCE.md for endpoint details
- Verify both servers are running
- Check CORS configuration

---

**Last Updated**: January 16, 2025  
**Version**: 1.0.0  
**Status**: Ready to Use ✅

Happy Coding! 🎉🐾
