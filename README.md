# Assignment Tracker

A modern React + Vite application for managing academic assignments with role-based workflows for professors and students.

**Live Demo**: https://assignment-tracker-sage.vercel.app/

## Features

### Professor Features
- 🔐 JWT-based authentication with email validation
- 📚 **Create & Manage Courses** - Add new courses with custom color themes
- 📝 Create assignments with individual/group submission types
- 📊 Real-time submission progress tracking with expandable student lists
- 🔍 Search and filter assignments by status and type
- 👥 View detailed student/group submission status
- 📈 Course statistics (students enrolled, assignments count)

### Student Features
- 🎓 **Enroll in Courses** - Browse and enroll in available courses
- 👥 **Group Management System**:
  - Create groups with custom names
  - Send invitations to other students
  - Accept/reject group invitations with notifications
  - View group members and leader
  - Leave groups
- 📋 View all assignments with submission tracking
- ✅ Acknowledge individual assignment completion
- 🤝 Group leader submission acknowledgment
- 📊 Track progress across all enrolled courses (Completed & Total Assignments)
- 🔔 Real-time invitation notifications with badges

### UI/UX
- 🎨 Beautiful, responsive UI with Tailwind CSS
- ✨ Smooth animations and transitions
- 🔔 Toast notifications for user feedback
- 📱 Mobile-friendly design
- 🎯 Intuitive navigation and workflows

## Tech Stack

- React 19.1.1 + Vite 7.1.7
- Tailwind CSS 4.1.16
- Lucide React (Icons)
- localStorage for data persistence
- Context API for state management

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
   ├─ StudentCourseAssignmentsPage.jsx  # Student assignment view
   ├─ GroupManagementModal.jsx          # Group creation & invitations
   └─ Toast.jsx                         # Toast notifications
```

## Key Features Walkthrough

### For Professors:
1. **Create Courses** - Click "Create Course" button, choose name, code, semester, and color theme
2. **Manage Assignments** - Create individual or group assignments with OneDrive links
3. **Track Progress** - Click progress bars to see which students have submitted
4. **Search & Filter** - Find assignments quickly by status or submission type

### For Students:
1. **Enroll in Courses** - Click "Enroll in Course" button, browse available courses, and enroll instantly
2. **Form Groups** - Click "Groups" button on any course card to:
   - Create a new group and invite members
   - Accept/reject invitations from other students
   - View your group members and leader
3. **Submit Assignments** - Acknowledge individual assignments or wait for group leader
4. **Track Progress** - Dashboard shows completed and total assignments across all courses

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

