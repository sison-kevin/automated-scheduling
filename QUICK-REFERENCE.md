# Quick Reference Card

## 🚀 Getting Started (First Time Setup)

### Backend Setup
```powershell
cd C:\xampp\htdocs\userpanel-event\userpanel-backend
composer install
# Edit app/config/database.php with your MySQL credentials
# Test: http://localhost/userpanel-event/userpanel-backend/
```

### Frontend Setup
```powershell
cd C:\xampp\htdocs\userpanel-event\userpanel-frontend
npm install
Copy-Item .env.example .env
# Edit .env if needed (default should work)
npm run dev
# Open: http://localhost:5173
```

---

## 🔄 Daily Development

### Start Both Services

**Terminal 1** (Backend):
```powershell
# Just ensure XAMPP Apache + MySQL are running
# No terminal needed - runs via Apache
```

**Terminal 2** (Frontend):
```powershell
cd C:\xampp\htdocs\userpanel-event\userpanel-frontend
npm run dev
```

### Access URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost/userpanel-event/userpanel-backend/

---

## 📁 Where to Edit Files

### Frontend (UI Changes)
```
userpanel-frontend/src/
├── App.jsx          ← Main component
├── api.js           ← API calls to backend
└── styles.css       ← Global styles
```

### Backend (API Changes)
```
userpanel-backend/app/
├── controllers/     ← API endpoints (add *Controller.php files)
├── models/          ← Database models (add *Model.php files)
└── config/
    └── routes.php   ← URL routing
```

---

## 🔌 Making API Calls

### Frontend (React)
```javascript
import { get, post } from './api'

// GET request
const pets = await get('/pets/list')

// POST request
const result = await post('/appointments/create', {
  pet_id: 1,
  date: '2025-11-20',
  time: '10:00'
})
```

### Backend (PHP Controller)
```php
class PetsController extends Controller {
    public function list() {
        $pets = $this->PetModel->get_all();
        echo json_encode(['success' => true, 'data' => $pets]);
    }
    
    public function create() {
        $data = json_decode(file_get_contents('php://input'), true);
        $result = $this->PetModel->insert($data);
        echo json_encode(['success' => $result]);
    }
}
```

---

## 🛠️ Common Tasks

### Add a New API Endpoint

1. **Create controller method** (backend):
   ```php
   // userpanel-backend/app/controllers/PetsController.php
   public function get_by_id($id) {
       $pet = $this->PetModel->find($id);
       echo json_encode(['success' => true, 'data' => $pet]);
   }
   ```

2. **Add route** (backend):
   ```php
   // userpanel-backend/app/config/routes.php
   $router->get('api/pets/{id}', 'PetsController@get_by_id');
   ```

3. **Call from frontend**:
   ```javascript
   // userpanel-frontend/src/App.jsx
   const pet = await get(`/api/pets/${petId}`)
   ```

### Add a New React Component

1. **Create component file**:
   ```javascript
   // userpanel-frontend/src/PetList.jsx
   export default function PetList({ pets }) {
       return (
           <div>
               {pets.map(pet => (
                   <div key={pet.id}>{pet.name}</div>
               ))}
           </div>
       )
   }
   ```

2. **Import in App.jsx**:
   ```javascript
   import PetList from './PetList'
   // Use: <PetList pets={petsData} />
   ```

---

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend
```powershell
# Check .env file
cat userpanel-frontend\.env
# Should be: VITE_API_BASE_URL=http://localhost/userpanel-event/userpanel-backend/

# Test backend directly
curl http://localhost/userpanel-event/userpanel-backend/
# Should return HTML (200 OK)
```

### CORS Errors
```powershell
# Edit: userpanel-backend/index.php
# Add your frontend URL to $allowed_origins array
$allowed_origins = ['http://localhost:5173', 'http://your-url'];
```

### Database Connection Failed
```php
// Edit: userpanel-backend/app/config/database.php
$database['hostname'] = 'localhost';
$database['username'] = 'root';        // ← Check this
$database['password'] = '';            // ← Check this
$database['database'] = 'your_db';     // ← Check this
```

### 404 on Backend Routes
```powershell
# Check .htaccess exists
Test-Path userpanel-backend\.htaccess

# Check RewriteBase in .htaccess
# Should be: RewriteBase /userpanel-event/userpanel-backend/
```

---

## 📦 Building for Production

### Frontend
```powershell
cd userpanel-frontend
npm run build
# Output: dist/ folder (deploy to Netlify, Vercel, etc.)
```

### Backend
```php
// Edit: userpanel-backend/app/config/config.php
$config['ENVIRONMENT'] = 'production';
$config['log_threshold'] = 1;
// Upload entire userpanel-backend/ to PHP hosting
```

---

## 🔧 Helper Scripts

```powershell
# Verify setup
.\verify-setup.ps1

# Quick start frontend
.\start-frontend.ps1
```

---

## 📚 Documentation Files

- `README.md` - Main project overview
- `SEPARATION-SUMMARY.md` - What was changed
- `ARCHITECTURE.md` - Visual diagrams
- `userpanel-frontend/README.md` - Frontend details
- `userpanel-backend/README.md` - Backend details

---

## 🆘 Need Help?

1. Check browser console (F12) for errors
2. Check Apache error log: `C:\xampp\apache\logs\error.log`
3. Check backend is running: http://localhost/userpanel-event/userpanel-backend/
4. Run verification script: `.\verify-setup.ps1`

---

**Last Updated**: November 16, 2025
