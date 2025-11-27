# Userpanel Frontend (React)

This folder is a minimal React (Vite) frontend separated from the existing Lavalust backend.

Quick start (Windows PowerShell):

```powershell
cd C:\xampp\htdocs\userpanel-event\userpanel-frontend
npm install
npm run dev
```

By default the app reads `VITE_API_BASE_URL` from environment variables. Copy `.env.example` to `.env` and update the value to point at your Lavalust backend.

Example `.env` for the separated backend:

```
VITE_API_BASE_URL=http://localhost/userpanel-event/userpanel-backend/
```

Notes about CORS and cookies:
- The backend (`userpanel-backend/`) is pre-configured to accept requests from `http://localhost:5173` (Vite default port).
- CORS is already enabled in `userpanel-backend/index.php`.
- If you need to add more origins, edit the `$allowed_origins` array in the backend's `index.php` file.

Next steps:
- Build React UI in `src/` and call backend endpoints via `src/api.js`.
- Optionally configure a proxy in `vite.config.js` if you prefer not to enable CORS on the backend during development.
