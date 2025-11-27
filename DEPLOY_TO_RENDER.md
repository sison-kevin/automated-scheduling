Overview

This repository is prepared to deploy to Render.com. The `render.yaml` defines two services:

- `userpanel-backend` — Docker web service using the repo `Dockerfile` and `userpanel-backend` as the app root.
- `userpanel-frontend` — Static site built from `userpanel-frontend` (Vite). The built assets are published from `userpanel-frontend/dist`.

Important: Do NOT change any existing database configuration in `app/config/database.php` (or other files). Your system is already configured to use the FreeSQLDatabase; keep those settings as-is.

Quick checklist before deploying

- Ensure your repo is committed and pushed to a Git provider (GitHub, GitLab, Bitbucket) that Render can access.
- Confirm any network access requirements for the FreeSQLDatabase (allow Render's outbound IPs or ensure the DB is publicly reachable using the existing credentials).
- If your application reads DB connection settings from environment variables instead of hard-coded values, prefer configuring the same credentials in Render's service environment variables; if it's already hard-coded to the FreeSQLDatabase, you may skip adding env vars.

Files added

- `render.yaml` — Render manifest for automating service creation (backend and frontend).

How to deploy (recommended)

1. Commit and push these files to your remote repository.

PowerShell commands (run from `c:\xampp\htdocs\userpanel-event`):

```powershell
git add render.yaml DEPLOY_TO_RENDER.md
git commit -m "Add Render manifest and deployment instructions"
git push origin main
```

(Replace `main` with your branch name if different.)

2. Open Render (https://render.com) and connect your GitHub/GitLab/Bitbucket account.

3. When creating a new service, Render will detect `render.yaml` in the repository and propose creating the defined services automatically. Choose to create both services from the manifest.

4. Review each service on Render:
- Backend (`userpanel-backend`): uses Docker. Confirm `dockerfilePath` is `./Dockerfile` and `root` is `userpanel-backend` (this matches the project layout). Set any environment variables only if strictly necessary — do NOT change DB configuration unless you intentionally want to point to a different database.
- Frontend (`userpanel-frontend`): uses `npm install && npm run build` to create the `dist` folder. If your `package.json` uses a different build command, update `render.yaml` or edit the service settings in the Render dashboard.

5. If Render fails to reach your FreeSQLDatabase during deploy/runtime:
- Check that the database host accepts connections from Render's IP ranges or is publicly reachable.
- If your DB requires credentials provided via environment variables, set the same credentials in the Render service environment variables (Dashboard → Service → Environment → Environment Variables). Again, this step is only required if your app expects env vars rather than fixed values in `app/config/database.php`.

6. Monitor the deploy logs in the Render dashboard and confirm both services become healthy.

Troubleshooting notes

- If the backend needs PHP-FPM / Apache setup not provided by the root `Dockerfile`, you may need to create a Dockerfile inside `userpanel-backend` (or adjust the root `Dockerfile`) tailored to serve that folder. The current `render.yaml` assumes the root `Dockerfile` can build the `userpanel-backend` context.
- If the frontend publishes to a different directory than `userpanel-frontend/dist`, update `publishPath` accordingly.

If you want, I can:
- Inspect `Dockerfile` and confirm it builds the backend correctly, or
- Create a small Dockerfile under `userpanel-backend` tailored to run the PHP app on Render, or
- Connect environment variable templates for Render (safe defaults) without changing your DB config.

Next steps

If you'd like me to proceed, tell me which of these you'd like me to do first:
- Verify the root `Dockerfile` is suitable for the backend and patch if necessary (I will not modify DB settings).
- Add a small backend-specific `Dockerfile` under `userpanel-backend` and adjust `render.yaml` to use it.
- Walk through the Render dashboard setup interactively and provide exact values to paste into Render UI.
