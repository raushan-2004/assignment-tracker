# Assignment Tracker

A modern React + Vite application for managing academic assignments with role-based workflows for professors and students.

**Live Demo**: https://assignment-tracker-sage.vercel.app/

## Features

- 🔐 JWT-based authentication with role-based access (Professor/Student)
- 📚 Course management with assignment tracking
- � Create assignments with individual/group submission types
- 📊 Real-time submission progress tracking with expandable student lists
- 👥 Group assignment management with leader acknowledgment
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 🔔 Toast notifications for user feedback

## Tech Stack

- React 19.1.1 + Vite 7.1.7
- Tailwind CSS 4.1.16
- Lucide React (Icons)
- localStorage for data persistence

## Quick Start

```powershell
npm install
npm run dev
```

Visit **http://localhost:5173/**

## Demo Credentials

**Professor**: `prof.anya@university.edu` / `password123`

**Students**:
- `ben.carter@student.edu` / `password123`
- `chloe.davis@student.edu` / `password123`
- `david.evans@student.edu` / `password123`

## Project Structure

```
src/
├─ AppNew.jsx              # Main app with auth & routing
├─ constants.js            # Demo data (users, courses, assignments)
├─ types.js                # Type definitions
├─ hooks/
│  └─ useLocalStorage.js   # localStorage hook
├─ context/
│  └─ ToastContext.jsx     # Toast notifications
└─ components/
   ├─ AuthPage.jsx                      # Login/Register
   ├─ ProfessorDashboard.jsx            # Professor course overview
   ├─ CourseAssignmentsPage.jsx         # Assignment management
   ├─ StudentDashboardNew.jsx           # Student course overview
   └─ StudentCourseAssignmentsPage.jsx  # Student assignment view
```

## Deployment

Deploy to Vercel:
1. Push to GitHub
2. Import project on Vercel
3. Set Framework: **Vite**, Build Command: `npm run build`, Output: `dist`
4. Deploy

## License

Available for educational purposes.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**

