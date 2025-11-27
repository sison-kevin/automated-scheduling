# Userpanel Backend (Lavalust PHP)

This is the separated backend API for the Userpanel application, built with the Lavalust PHP framework.

## Directory Structure

```
userpanel-backend/
├── app/                    # Application code
│   ├── config/            # Configuration files
│   ├── controllers/       # API controllers
│   ├── models/            # Database models
│   ├── views/             # PHP views (optional for API-only mode)
│   └── helpers/           # Helper functions
├── scheme/                # Lavalust framework core
├── public/                # Static assets
├── writable/              # Writable directories (logs, uploads, qrcodes)
├── vendor/                # Composer dependencies
├── index.php              # Main entry point
└── composer.json          # PHP dependencies
```

## Setup Instructions

### 1. Install Dependencies

```powershell
cd C:\xampp\htdocs\userpanel-event\userpanel-backend
composer install
```

### 2. Configure Database

Edit `app/config/database.php` and set your database credentials:

```php
$database['hostname'] = 'localhost';
$database['username'] = 'root';
$database['password'] = '';
$database['database'] = 'your_database_name';
```

### 3. Update Base URL

Edit `app/config/config.php` and ensure the base URL matches your setup:

```php
$config['base_url'] = 'http://localhost/userpanel-event/userpanel-backend/';
```

For network access (e.g., mobile testing), use your machine's IP:

```php
$config['base_url'] = 'http://192.168.1.X/userpanel-event/userpanel-backend/';
```

### 4. Configure XAMPP Virtual Host (Optional but Recommended)

Add to `C:\xampp\apache\conf\extra\httpd-vhosts.conf`:

```apache
<VirtualHost *:80>
    ServerName userpanel-backend.local
    DocumentRoot "C:/xampp/htdocs/userpanel-event/userpanel-backend"
    <Directory "C:/xampp/htdocs/userpanel-event/userpanel-backend">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Add to `C:\Windows\System32\drivers\etc\hosts`:

```
127.0.0.1 userpanel-backend.local
```

Then restart Apache and update `base_url` to `http://userpanel-backend.local/`.

### 5. Set Up .htaccess (URL Rewriting)

Copy `htaccess.example` to `.htaccess` if it doesn't exist, or ensure you have:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php/$1 [L]
```

## CORS Configuration

The backend is already configured to accept requests from React dev servers running on:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (Create React App default)
- `http://127.0.0.1:5173`

To add more origins, edit `index.php` and update the `$allowed_origins` array:

```php
$allowed_origins = ['http://localhost:5173', 'http://your-custom-origin:port'];
```

## API Endpoints

The backend provides the following controllers:

- **AuthController**: `/auth/*` - User authentication (login, register, logout)
- **DashboardController**: `/dashboard/*` - User dashboard data
- **PetsController**: `/pets/*` - Pet management (CRUD operations)
- **AppointmentsController**: `/appointments/*` - Appointment scheduling
- **VeterinariansController**: `/veterinarians/*` - Veterinarian listings
- **SettingsController**: `/settings/*` - User settings management

Check `app/config/routes.php` for the complete routing configuration.

## Testing the Backend

Access the backend directly in your browser:

```
http://localhost/userpanel-event/userpanel-backend/
```

Test an API endpoint (example):

```powershell
curl http://localhost/userpanel-event/userpanel-backend/api/test
```

Or use a tool like Postman or Insomnia.

## Writable Directories

Ensure the following directories are writable:

- `writable/logs/` - Application logs
- `writable/qrcodes/` - Generated QR codes
- `app/uploads/pets/` - Pet image uploads

## Environment

The backend runs in development mode by default. To switch to production:

Edit `app/config/config.php`:

```php
$config['ENVIRONMENT'] = 'production';
$config['log_threshold'] = 1;  // Enable error logging
```

## Troubleshooting

### 404 Errors

- Check that Apache `mod_rewrite` is enabled
- Verify `.htaccess` is present and readable
- Check `base_url` in `config.php` matches your actual URL

### Database Connection Errors

- Verify MySQL is running in XAMPP
- Check credentials in `app/config/database.php`
- Ensure the database exists

### CORS Errors

- Check the frontend origin is listed in `$allowed_origins` in `index.php`
- Verify the browser is sending the `Origin` header
- Check Apache error logs: `C:\xampp\apache\logs\error.log`

## Next Steps

- Configure your database schema (see `scheme/database/` for migrations if available)
- Implement additional API endpoints as needed
- Add authentication middleware for protected routes
- Review and update security settings for production deployment

## Original Lavalust Documentation

See `LAVALUST_README.md` for the original Lavalust framework documentation and links.
