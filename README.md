# Assignment Tracker
A modern, full-featured React + Vite application for managing academic assignments with role-based workflows for professors and students. Features beautiful UI/UX with Tailwind CSS, JWT authentication simulation, course management, individual/group assignments, and real‑time progress tracking.

Live demo: https://assignment-tracker-sage.vercel.app/

## ✨ Features

### Authentication System
- 🔐 Modern login/register interface with email validation
- 🎫 JWT token simulation for secure sessions
- 👥 Role-based access control (Professor/Student)
- ✅ Form validation with real-time error feedback

### Professor Flow
- 📚 **Dashboard**: Visual course cards with statistics
- 📝 **Assignment Management**: Create, edit, delete assignments
- 📊 **Analytics**: Submission progress bars and completion tracking
- 🔍 **Search & Filter**: Find assignments by status and type
- 👥 **Student Tracking**: See which students/groups have submitted

### Student Flow
- 🎓 **Dashboard**: Enrolled courses with completion progress
- 📋 **Assignment Viewing**: All assignment details and deadlines
- ✅ **Individual Submissions**: Acknowledge completion independently
- 👥 **Group Submissions**: Group leader acknowledgment system
- ⚠️ **Smart Alerts**: Visual indicators for past-due assignments

### UI/UX Excellence
- 🎨 Beautiful gradient designs with Tailwind CSS
- ✨ Smooth animations and transitions
- 📱 Fully responsive (mobile-first design)
- 🔔 Toast notifications for user feedback
- 🎯 Intuitive navigation and workflows

## Tech Stack

- **Frontend**: React 19.1.1 with JSX
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 4.1.16
- **Icons**: Lucide React 0.552.0
- **State Management**: React Context API + Custom Hooks
- **Data Persistence**: localStorage with custom hook
- **Animations**: Custom CSS keyframes + Tailwind transitions

## Demo Credentials

### Professor Account
- **Email**: `prof.anya@university.edu`
- **Password**: `password123`
- **Courses**: Advanced Calculus, Modern Physics

### Student Accounts
- **Email**: `ben.carter@student.edu` | **Password**: `password123`
- **Email**: `chloe.davis@student.edu` | **Password**: `password123`
- **Email**: `david.evans@student.edu` | **Password**: `password123`
- **Email**: `emma.foster@student.edu` | **Password**: `password123`

All demo users are pre-enrolled in Fall 2025 courses with sample assignments.

## Quick Start

### Installation

Open a terminal (PowerShell on Windows) in the project root:

```powershell
npm install
```

### Development

Run the development server with hot reload:

```powershell
npm run dev
```

Visit **http://localhost:5173/** in your browser.

### Production Build

```powershell
npm run build
npm run preview
```

### Troubleshooting Login Issues

If you encounter "Invalid credentials" errors:
1. Click the "Having issues? Click here to reset app data" link on the login page
2. Or manually clear localStorage in your browser DevTools
3. Refresh the page and try again with demo credentials

## Folder Structure Overview

The project follows a modern React application architecture with clear separation of concerns:

```
src/
├─ AppNew.jsx           # Main app with auth, routing, and state management
├─ main.jsx             # Entry point, renders App with providers
├─ index.css            # Global styles, animations, and Tailwind imports
├─ constants.js         # Demo data: users, courses, assignments, groups
├─ types.js             # Type definitions (Role, SubmissionType, etc.)
├─ metadata.json        # Project metadata
├─ hooks/
│  └─ useLocalStorage.js # Custom hook for localStorage persistence
├─ context/
│  └─ ToastContext.jsx  # Global toast notification state management
└─ components/
   ├─ AuthPage.jsx                      # Login/Register with validation
   ├─ ProfessorDashboard.jsx            # Professor course overview
   ├─ CourseAssignmentsPage.jsx         # Assignment management (create/edit/delete)
   ├─ StudentDashboardNew.jsx           # Student course overview
   ├─ StudentCourseAssignmentsPage.jsx  # Student assignment viewing
   ├─ Toast.jsx                         # Toast notification component
   ├─ Header.jsx                        # (Legacy) Top navigation
   ├─ AdminDashboard.jsx                # (Legacy) Old admin view
   ├─ StudentDashboard.jsx              # (Legacy) Old student view
   ├─ AssignmentItem.jsx                # (Legacy) Assignment card
   ├─ ProgressBar.jsx                   # Progress indicator
   ├─ CreateAssignmentModal.jsx         # (Legacy) Old modal
   ├─ ConfirmationModal.jsx             # Confirmation dialogs
   └─ icons/                            # SVG icon components
```

**Note**: The app uses `AppNew.jsx` as the main entry point with enhanced features. Legacy components from the original prototype are preserved.

### Key Organizational Principles
- **Feature-based organization**: Components grouped by user flow (Professor/Student)
- **Context API**: Global state for toast notifications
- **Custom hooks**: Business logic abstracted (localStorage, toast management)
- **Reusable components**: Modals, toasts, and UI elements kept modular
- **Constants separation**: Demo data in dedicated files

## Component Structure and Design Decisions

### State Management Architecture
- **localStorage + Context API**: Uses custom `useLocalStorage` hook with React Context for global notifications
- **Prop drilling for data**: Assignment/course data flows through props (appropriate for app scale)
- **JWT simulation**: Token-based auth state management
- **Single source of truth**: `AppNew.jsx` manages users, courses, assignments, groups, and acknowledgments

### Component Design Patterns

#### 1. **Role-Based Views with Route Simulation**
```jsx
// In AppNew.jsx
{currentUser.role === Role.Admin ? (
  currentView === 'dashboard' ? 
    <ProfessorDashboard /> : 
    <CourseAssignmentsPage />
) : (
  currentView === 'dashboard' ?
    <StudentDashboardNew /> :
    <StudentCourseAssignmentsPage />
)}
```
- Complete UI separation between professor and student experiences
- View-based navigation without external routing library

#### 2. **Assignment Creation with Full Validation**
Complete form in `CourseAssignmentsPage`:
- **All required fields**: Title, description, due date/time, submission type
- **Optional fields**: OneDrive link with URL validation
- **Visual feedback**: Real-time error highlighting
- **Loading states**: Spinner during async operations

#### 3. **Individual vs. Group Assignment Logic**
Smart handling in `StudentCourseAssignmentsPage`:
- **Individual**: Every student acknowledges independently
- **Group**: Only leader can acknowledge; all members see status
- **No group prompt**: Shows "Create Group" or "Join Group" buttons
- **Visual indicators**: Badges show submission type and status

#### 4. **Toast Notification System**
```jsx
// Global toast context for user feedback
const { showToast } = useToast();
showToast('Assignment created successfully!', 'success');
- Centralized notification management
- Four types: success, error, warning, info
- Auto-dismiss with configurable duration
- Smooth animations (slide-in from right)

### Data Flow & Architecture

#### 1. **Enhanced Data Model**
```js
// Users now include email, courses, and enrollments
{ id, name, email, role, password, enrolledCourses, semester }

// Courses link professors to students
{ id, name, code, semester, professorId, enrolledStudents, color }

// Assignments include submission types and OneDrive links
{ id, courseId, title, description, dueDate, oneDriveLink, submissionType }

// Groups for group assignments
{ id, assignmentId, name, leaderId, members }

// Acknowledgments track submissions
{ id, assignmentId, studentId, groupId, acknowledged, acknowledgedAt }
```

#### 2. **localStorage Migration System**
- Automatic detection of old data structure
- Seamless migration to new schema with email fields
- Reset functionality for troubleshooting
- Preserves data across browser sessions

#### 3. **ID Generation**
- Timestamp-based: `user-${Date.now()}`
- Simple and collision-free for single-device usage
- Would need UUIDs for production multi-user scenarios

### UI/UX Design Principles

#### Animation System
Custom CSS animations in `index.css`:
- **slide-in-right**: Toast notifications entrance
- **fade-in**: Modal backdrop appearance
- **scale-in**: Modal content pop-in effect
- **bounce-subtle**: Attention-grabbing hints

#### Color System
- **Primary**: Indigo-600 → Purple-600 gradients
- **Success**: Green-500 (completed states)
- **Warning**: Orange-500 (upcoming deadlines)
- **Error**: Red-500 (past due, validation errors)
- **Neutral**: Slate scale for text and backgrounds

#### Responsive Design
- **Mobile-first**: Base styles for small screens
- **Breakpoints**: `md:` (768px), `lg:` (1024px)
- **Touch-friendly**: Large tap targets, swipe-friendly layouts
- **Custom scrollbar**: Styled for modern aesthetic

## Deployment (Vercel)

This project builds to a static `dist` folder using Vite. Deploy to Vercel:

1. Push your repository to GitHub, GitLab, or Bitbucket
2. Create a [Vercel account](https://vercel.com) and click "New Project"
3. Import your repository and configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy - Vercel will build and publish automatically

**Live Demo**: https://assignment-tracker-sage.vercel.app/

**Tips:**
- Environment variables: Add in Vercel project settings
- Custom domain: Configure in Vercel dashboard
- Auto-deploy: Every push to main branch triggers new deployment

## User Flows

### Professor Workflow

1. **Login** → Enter credentials → Redirected to dashboard
2. **View Courses** → See all courses with enrollment/assignment stats
3. **Select Course** → Click course card → Opens assignment management
4. **Create Assignment**:
   - Click "Create Assignment" button
   - Fill form: Title, Description, Due Date/Time, OneDrive Link, Type
   - Choose Individual or Group submission
   - Submit → Assignment appears in list
5. **Monitor Progress**:
   - View submission progress bars
   - Filter by status (active/past) or type (individual/group)
   - Search assignments by title/description
6. **Track Students**: See which students/groups have acknowledged

### Student Workflow

1. **Login** → Enter credentials → Redirected to dashboard
2. **View Courses** → See enrolled courses with completion progress
3. **Select Course** → Click course card → View all assignments
4. **Individual Assignment**:
   - Read assignment details and deadline
   - Click OneDrive link to access/submit work
   - Click "Yes, I have submitted" → Acknowledged ✓
5. **Group Assignment**:
   - Check group membership status
   - If not in group → Create or join a group
   - If group member → Wait for leader to acknowledge
   - If group leader → Acknowledge for entire team
6. **Track Progress**: View completed vs. upcoming assignments

## Usage Notes

- **Data Persistence**: All data is stored in browser localStorage - persists across sessions but is device-specific
- **Data Migration**: App automatically detects and updates old data structures
- **Reset Data**: Use the "reset app data" link on login page if you encounter issues
- **Browser Requirements**: Modern browsers with localStorage and ES6+ support
- **Demo Purpose**: Intended as a prototype - production use requires backend, real auth, and database

## Future Enhancements

### Planned Features
- [ ] **Group Management Modal**: Full UI for creating/joining groups with member invitations
- [ ] **Assignment Editing**: In-place edit functionality for professors
- [ ] **File Upload**: Direct file submission instead of just OneDrive links
- [ ] **Real-time Notifications**: Email/push notifications for deadlines
- [ ] **Analytics Dashboard**: Professor insights (submission trends, average times)
- [ ] **Comments System**: Discussion threads on assignments
- [ ] **Grade Management**: Professor can assign grades to submissions
- [ ] **Calendar Integration**: Export deadlines to Google Calendar/iCal
- [ ] **Dark Mode**: Theme toggle for better accessibility
- [ ] **Export Reports**: Download submission data as CSV/PDF

### Technical Improvements
- [ ] **Backend Integration**: REST API with Node.js/Express
- [ ] **Real Authentication**: JWT with refresh tokens, OAuth providers
- [ ] **Database**: MongoDB/PostgreSQL for multi-user persistence
- [ ] **Real-time Updates**: WebSocket for live collaboration
- [ ] **Testing**: Unit tests (Jest), E2E tests (Playwright)
- [ ] **TypeScript**: Type safety across the entire codebase
- [ ] **Performance**: Code splitting, lazy loading, memoization
- [ ] **Accessibility**: WCAG 2.1 compliance, screen reader support

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

**Development Guidelines:**
- Follow existing code style and patterns
- Add comments for complex logic
- Test thoroughly before submitting PR
- Update README if adding new features

## License

This project is available for educational and demonstration purposes. 

## Contact & Support

- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Repository**: [raushan-2004/assignment-tracker](https://github.com/raushan-2004/assignment-tracker)
- **Live Demo**: https://assignment-tracker-sage.vercel.app/

---

**Built with ❤️ using React, Vite, and Tailwind CSS**


