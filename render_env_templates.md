Render environment variable templates and notes

Purpose
- Provide safe example environment variable names and descriptions for services deployed to Render.
- Do NOT change any existing database configuration files in the codebase.

How to use
- Copy values from `.env.render.example` into the Render dashboard when creating or updating a service.
- Only set DB_* variables if your application reads database credentials from environment variables. If your app uses a hard-coded config in `userpanel-backend/app/config/database.php`, you can skip setting DB_* vars.

Recommended variables
- `APP_ENV`: `production` or `staging`.
- `APP_DEBUG`: `false` in production.
- `APP_URL`: Public URL for the service.

Database variables (optional)
- `DB_HOST`: Hostname or IP of your FreeSQLDatabase.
- `DB_PORT`: Usually `3306` for MySQL.
- `DB_DATABASE`: Database name.
- `DB_USERNAME`: Database user.
- `DB_PASSWORD`: Database password.

Security notes
- Do not commit actual credentials to the repo. Use Render's encrypted environment variables.
- If your project reads credentials from file (e.g., `app/config/database.php`), prefer migrating to environment variables for best practice — but only do this if you are ready to update the code.

If you'd like, I can prepare a small code snippet to read DB config from environment variables and fall back to the existing config file — I will not change `app/config/database.php` unless you request it explicitly.
