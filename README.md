# Assignment Tracker

Assignment Tracker is a small React + Vite application for creating and tracking assignments for students and admins. It includes modals for creating assignments, a progress bar component, and local-storage persistence via a custom hook.

## Tech stack

- React (JSX)
- Vite (dev server & build)
- LocalStorage for persistence (custom hook in `src/hooks`)

## Demo users

The project includes a small set of demo users (used as the initial `users` value). Use these credentials to sign in while testing the app.

```
ID        | Name             | Role    | Password
----------|------------------|---------|----------
user-1    | Professor Anya   | admin   | password123
user-2    | Ben Carter       | student | password123
user-3    | Chloe Davis      | student | password123
user-4    | David Evans      | student | password123
```

These come from `src/constants.js` and are persisted to `localStorage` once the app runs. Creating new users via the UI will append to this list and persist across reloads.

## Project structure

Top-level files

```
.
├─ index.html
├─ package.json
├─ vite.config.js
├─ eslint.config.js
├─ README.md
└─ src/
	├─ App.jsx
	├─ main.jsx
	├─ index.css
	├─ constants.js
	├─ types.js
	├─ metadata.json
	├─ hooks/
	│  └─ useLocalStorage.js
	└─ components/
		├─ Header.jsx
		├─ AdminDashboard.jsx
		├─ StudentDashboard.jsx
		├─ AssignmentItem.jsx
		├─ ProgressBar.jsx
		├─ CreateAssignmentModal.jsx
		├─ ConfirmationModal.jsx
		└─ icons/
			├─ CheckCircleIcon.jsx
			├─ DriveIcon.jsx
			├─ PlusIcon.jsx
			└─ XCircleIcon.jsx
```

## Quick commands

Open a terminal (PowerShell on Windows) in the project root and run:

Install dependencies

```powershell
npm install
```

Run development server (hot reload)

```powershell
npm run dev
```

Build for production

```powershell
npm run build
```

Preview the production build locally

```powershell
npm run preview
```

If the project includes lint or test scripts, they can be run via `npm run <script>`.

## Deployment (Vercel example)

This project builds to a static `dist` folder using Vite. You can deploy it to Vercel with these simple steps:

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Create a Vercel account (https://vercel.com) and click "New Project".
3. Import your repository and accept the defaults. Set the framework to "Vite" if prompted.
	- Build Command: npm run build
	- Output Directory: dist
4. Deploy. Vercel will run the build and publish the site.

Deployment URL:

```
https://assignment-tracker-sage.vercel.app/
```

Tips
- If you need environment variables, add them in the Vercel project settings.
- For a custom domain, configure it in the Vercel dashboard and update DNS with your provider.

## Usage notes

- Data is persisted in the browser's localStorage (see `src/hooks/useLocalStorage.js`). Clearing site data will reset saved assignments.
- The app is intended as a small demo; consider adding authentication and a backend if you need multi-user persistence.


