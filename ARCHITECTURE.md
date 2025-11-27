# Architecture Diagram

## Before Separation (Monolithic)

```
Userpanel-web_project/
└── LavaLust-dev-v4/
    ├── app/
    │   ├── controllers/  (Mixed: HTML views + API logic)
    │   ├── models/
    │   └── views/        (PHP templates with inline JS)
    ├── public/           (CSS, JS, images)
    └── index.php

Single codebase, tightly coupled frontend and backend
```

## After Separation (Decoupled)

```
┌─────────────────────────────────────────────────────────────┐
│                     userpanel-event/                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────┐  ┌───────────────────────┐  │
│  │   userpanel-frontend/     │  │  userpanel-backend/   │  │
│  │   (React + Vite)          │  │  (Lavalust PHP)       │  │
│  ├───────────────────────────┤  ├───────────────────────┤  │
│  │                           │  │                       │  │
│  │  src/                     │  │  app/                 │  │
│  │  ├── App.jsx              │  │  ├── controllers/     │  │
│  │  ├── main.jsx             │  │  │   └── *API.php    │  │
│  │  ├── api.js  ─────────────┼──┼──┤   (JSON responses) │  │
│  │  └── styles.css           │  │  ├── models/          │  │
│  │                           │  │  └── config/          │  │
│  │  index.html               │  │                       │  │
│  │  package.json             │  │  index.php            │  │
│  │  .env                     │  │  .htaccess            │  │
│  │                           │  │  composer.json        │  │
│  │                           │  │                       │  │
│  │  Port: 5173               │  │  URL: /userpanel-     │  │
│  │  (Vite dev server)        │  │  event/userpanel-     │  │
│  │                           │  │  backend/             │  │
│  └───────────────────────────┘  └───────────────────────┘  │
│                                                               │
│          HTTP/JSON API                                        │
│     (CORS enabled, credentials supported)                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

```
┌──────────┐                ┌──────────┐               ┌──────────┐
│          │   React API    │          │  PHP Routes   │          │
│  Browser │───────────────>│  Vite    │──────────────>│  Apache  │
│          │   (fetch)      │  Dev     │   CORS        │  XAMPP   │
│          │                │  Server  │   Proxy       │          │
└──────────┘                └──────────┘               └──────────┘
     ^                           │                           │
     │                           │                           v
     │                           │                    ┌─────────────┐
     │                           │                    │  Lavalust   │
     │                           │                    │  Framework  │
     │                           │                    └─────────────┘
     │                           │                           │
     │                           │                           v
     │                           │                    ┌─────────────┐
     │                           │                    │ Controllers │
     │    JSON Response          │                    │   Models    │
     │<──────────────────────────┼────────────────────│   Database  │
     │                           │                    └─────────────┘
     │                           │                           │
     v                           v                           v
┌──────────────────────────────────────────────────────────────┐
│                        MySQL Database                         │
│                 (pets, users, appointments, etc.)             │
└──────────────────────────────────────────────────────────────┘
```

## Development Workflow

```
Developer Workflow:

1. Frontend Development (React)
   ┌─────────────────────────────┐
   │ cd userpanel-frontend       │
   │ npm run dev                 │
   └─────────────────────────────┘
        │
        ├─> Edit src/App.jsx (components)
        ├─> Edit src/api.js (API calls)
        └─> Hot reload in browser
        
2. Backend Development (PHP)
   ┌─────────────────────────────┐
   │ XAMPP Apache running        │
   │ Access via browser          │
   └─────────────────────────────┘
        │
        ├─> Edit app/controllers/*.php
        ├─> Edit app/models/*.php
        ├─> Edit app/config/routes.php
        └─> Refresh browser to test

3. API Integration
   ┌─────────────────────────────┐
   │ Frontend calls backend APIs │
   │ via configured base URL     │
   └─────────────────────────────┘
        │
        ├─> GET /api/pets/list
        ├─> POST /api/appointments/create
        └─> PUT /api/users/update
```

## Deployment Architecture

```
Production Setup:

┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
└─────────────────┬───────────────────────────┬───────────────┘
                  │                           │
        ┌─────────v─────────┐       ┌────────v────────┐
        │   CDN / Static    │       │   PHP Hosting   │
        │   Hosting         │       │   (Apache/Nginx)│
        │   (Netlify, etc.) │       │                 │
        │                   │       │                 │
        │  Frontend Build   │       │  Backend API    │
        │  (dist/)          │       │  (PHP files)    │
        └───────────────────┘       └────────┬────────┘
                                              │
                                     ┌────────v────────┐
                                     │  MySQL Database │
                                     │  (Production)   │
                                     └─────────────────┘

Frontend: Compiled React app served as static files
Backend: PHP application with database connection
Communication: HTTPS REST API calls
```

## Directory Mapping

```
Old Structure → New Structure

Userpanel-web_project/LavaLust-dev-v4/
├── app/
│   ├── controllers/       → userpanel-backend/app/controllers/
│   ├── models/            → userpanel-backend/app/models/
│   ├── views/*.php        → (Replaced by React components)
│   └── config/            → userpanel-backend/app/config/
├── public/
│   ├── css/               → userpanel-frontend/src/styles.css
│   ├── js/                → userpanel-frontend/src/**/*.jsx
│   └── images/            → userpanel-backend/public/ (API assets)
└── index.php              → userpanel-backend/index.php

New Frontend Structure:
userpanel-frontend/
└── src/
    ├── App.jsx            → Main React component (new)
    ├── main.jsx           → Entry point (new)
    ├── api.js             → Backend communication (new)
    └── styles.css         → Global styles (new)
```

## Technology Comparison

| Aspect | Before | After |
|--------|--------|-------|
| **Frontend** | PHP views + inline JS | React + JSX |
| **State Management** | Page reloads | React state/hooks |
| **Styling** | Global CSS | Component-scoped CSS |
| **Build Tool** | None | Vite (fast HMR) |
| **Backend** | Lavalust MVC | Lavalust API-only |
| **Communication** | Form posts | REST API (JSON) |
| **Development** | Single XAMPP server | Separate dev servers |
| **Deployment** | Monolithic | Decoupled services |

## Benefits Visualization

```
┌──────────────────────────────────────────────────────────────┐
│                    SEPARATION BENEFITS                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  🚀 Modern UI Framework (React)                              │
│     └─> Component reusability, hooks, virtual DOM            │
│                                                               │
│  ⚡ Fast Development (Vite HMR)                              │
│     └─> Instant feedback on code changes                     │
│                                                               │
│  🔄 Independent Scaling                                      │
│     └─> Scale frontend/backend separately                    │
│                                                               │
│  🔌 API-First Design                                         │
│     └─> Easy to add mobile apps or other clients            │
│                                                               │
│  👥 Team Collaboration                                       │
│     └─> Frontend & backend devs work in parallel            │
│                                                               │
│  🧪 Better Testing                                           │
│     └─> Unit test components and APIs separately            │
│                                                               │
│  📦 Flexible Deployment                                      │
│     └─> Frontend to CDN, backend to PHP hosting             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

**Legend**:
- `→` : Migrated/replaced
- `├──` : Directory/file structure
- `│` : Vertical connection
- `└──` : Last item in list
- `───>` : Data flow direction
