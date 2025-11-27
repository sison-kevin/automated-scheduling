# Project Architecture and Integration Guide

This document explains how the userpanel-frontend, userpanel-backend, and the database are connected and how the overall system works.

## 1. Overview

- **Frontend**: Built with modern JavaScript (likely React + Vite), located in `userpanel-frontend/`.
- **Backend**: PHP application (possibly using LavaLust or similar), located in `userpanel-backend/`.
- **Database**: MySQL or MariaDB, configured in the backend.

---

## 2. How the Frontend Connects to the Backend

- The frontend makes HTTP requests (usually via `fetch` or `axios`) to the backend API endpoints.
- API endpoints are defined in the backend (e.g., `/api/pets`, `/api/auth/login`).
- The backend processes these requests, interacts with the database, and returns JSON responses.
- The frontend consumes these responses to update the UI.

### Example Flow
1. User logs in via the frontend login form.
2. The frontend sends a POST request to `http://localhost:8000/api/auth/login` with user credentials.
3. The backend validates credentials, queries the database, and returns a success or error response.
4. The frontend stores the authentication token (if any) and uses it for subsequent API requests.

---

## 3. How the Backend Connects to the Database

- The backend uses PHP (with PDO or MySQLi) to connect to the database.
- Database configuration is typically found in `userpanel-backend/app/config/database.php`.
- Credentials (host, username, password, dbname) are set here.
- Backend controllers (e.g., `PetsController.php`, `AuthController.php`) use models to query/update the database.

### Example Database Connection (PHP)
```php
// In app/config/database.php
return [
    'host' => 'localhost',
    'username' => 'db_user',
    'password' => 'db_pass',
    'database' => 'userpanel_db',
];
```

---

## 4. How Everything Works Together

1. **Frontend** is started with `npm run dev` and runs on a port (e.g., 5173).
2. **Backend** is started with `php -S localhost:8000 -t public` and listens for API requests.
3. **Frontend** makes API calls to the backend (CORS must be enabled in the backend for local development).
4. **Backend** processes requests, interacts with the **database**, and returns data to the frontend.
5. **Frontend** updates the UI based on backend responses.

---

## 5. Development Setup

### Frontend
- Install dependencies: `npm install`
- Start dev server: `npm run dev`

### Backend
- Install dependencies: `composer install`
- Start server: `php -S localhost:8000 -t public`
- Configure database in `app/config/database.php`

### Database
- Set up MySQL/MariaDB server.
- Create the database and user.
- Import schema if provided (e.g., via a `.sql` file).

---

## 6. Example API Call (Frontend)
```js
fetch('http://localhost:8000/api/pets', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <token>'
  }
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 7. Notes
- Ensure CORS is enabled in the backend for frontend-backend communication during development.
- Use environment variables or config files to manage API URLs and credentials securely.
- For production, set up proper domains, HTTPS, and secure credentials.

---

## 8. Troubleshooting
- If the frontend cannot reach the backend, check CORS, server ports, and network settings.
- If the backend cannot connect to the database, verify credentials and database server status.
- Check browser console and backend logs for errors.

---

For more details, refer to the `README.md` files in each project folder.
