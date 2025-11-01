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

## Folder structure overview

The project follows a clean React application structure with logical separation of concerns:

```
src/
├─ App.jsx              # Root component, manages global state (users, currentUser)
├─ main.jsx             # Entry point, renders App into DOM
├─ index.css            # Global styles and Tailwind imports
├─ constants.js         # Static data (demo users, initial assignments)
├─ types.js             # Shared type definitions (Role enum)
├─ metadata.json        # Project metadata
├─ hooks/
│  └─ useLocalStorage.js # Custom hook for localStorage persistence
└─ components/
   ├─ Header.jsx         # Top navigation with user selection and auth
   ├─ AdminDashboard.jsx # Admin view with assignment creation/management
   ├─ StudentDashboard.jsx # Student view showing available assignments
   ├─ AssignmentItem.jsx # Reusable assignment card (dual admin/student modes)
   ├─ ProgressBar.jsx    # Visual progress indicator component
   ├─ CreateAssignmentModal.jsx # Modal form for creating assignments
   ├─ ConfirmationModal.jsx # Reusable confirmation dialog
```

### Key organizational principles:
- **Separation by feature**: Components are organized by their primary responsibility
- **Reusable components**: Icons, modals, and UI elements are kept modular
- **Custom hooks**: Business logic for localStorage is abstracted into `useLocalStorage`
- **Constants separation**: Static data lives in dedicated files, not embedded in components

## Component structure and design decisions

### State Management Architecture
- **Local state with persistence**: Uses `useLocalStorage` hook instead of external state libraries
- **Prop drilling pattern**: State flows down from `App.jsx` through props (simple but effective for this scale)
- **Single source of truth**: `App.jsx` manages users and currentUser; dashboards manage their specific data

### Component Design Patterns

#### 1. **Conditional Rendering Based on User Roles**
```jsx
// In App.jsx
{currentUser.role === 'admin' ? 
  <AdminDashboard admin={currentUser} users={users} /> : 
  <StudentDashboard student={currentUser} />
}
```
- Clean separation between admin and student experiences
- No shared UI concerns between different user types

#### 2. **Dual-Mode Components**
`AssignmentItem.jsx` serves both admin and student views:
- **Student mode**: Shows submission form, tracks submission status
- **Admin mode**: Displays progress bar, student submission list
- Reduces code duplication while maintaining clear separation of concerns

#### 3. **Modal Pattern**
```jsx
// Consistent modal pattern across the app
{isModalOpen && (
  <Modal onClose={() => setIsModalOpen(false)} onAction={handleAction} />
)}
```
- Conditional rendering with portal-like behavior
- Consistent backdrop and escape handling

#### 4. **Form Validation Strategy**
- **Client-side validation**: Immediate feedback for required fields
- **URL validation**: Real-time validation for submission links
- **Progressive disclosure**: Error messages appear contextually

### Data Flow Decisions

#### 1. **localStorage as Database**
- **Pros**: No backend needed, persists across sessions, simple implementation
- **Cons**: Data tied to browser, no multi-user sync, no server validation
- **Choice rationale**: Appropriate for demo/educational purposes

#### 2. **Assignment-Submission Relationship**
```js
// Assignments created by admins
{id: 'assign-1', title: '...', createdBy: 'user-1'}

// Submissions link to assignments and students
{assignmentId: 'assign-1', studentId: 'user-2', submittedAt: '...'}
```
- Normalized data structure allows many-to-many relationships
- Easy to query submissions by assignment or by student

#### 3. **ID Generation Strategy**
```js
id: `user-${Date.now()}`    // For users
id: `assign-${Date.now()}`  // For assignments
```
- Simple timestamp-based IDs avoid collision in single-user context
- Would need UUIDs or server-generated IDs in production

### Styling Decisions
- **Tailwind CSS**: Utility-first approach for rapid development
- **Responsive design**: Mobile-first with `md:` and `lg:` breakpoints
- **Consistent color palette**: Slate for text, Indigo for primary actions, Green for success states



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


