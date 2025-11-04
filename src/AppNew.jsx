import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { Role } from './types';
import { USERS, COURSES, INITIAL_ASSIGNMENTS, INITIAL_GROUPS, INITIAL_ACKNOWLEDGMENTS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import { ToastProvider, useToast } from './context/ToastContext';
import AuthPage from './components/AuthPage';
import ProfessorDashboard from './components/ProfessorDashboard';
import StudentDashboardNew from './components/StudentDashboardNew';
import CourseAssignmentsPage from './components/CourseAssignmentsPage';
import StudentCourseAssignmentsPage from './components/StudentCourseAssignmentsPage';

// Main App with JWT simulation and role-based routing
function AppContent() {
  const { showToast } = useToast();
  
  // Initialize/migrate users data - ensure we have the new structure with emails
  const initializeUsers = () => {
    try {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers);
        // Check if users have email field (new structure)
        if (parsed.length > 0 && !parsed[0].email) {
          // Old structure detected - reset to new structure
          console.log('Migrating to new user structure...');
          return USERS;
        }
        return parsed;
      }
      return USERS;
    } catch (error) {
      console.error('Error initializing users:', error);
      return USERS;
    }
  };
  
  // State management
  const [users, setUsers] = useLocalStorage('users', initializeUsers());
  const [courses, setCourses] = useLocalStorage('courses', COURSES);
  const [assignments, setAssignments] = useLocalStorage('assignments', INITIAL_ASSIGNMENTS);
  const [groups, setGroups] = useLocalStorage('groups', INITIAL_GROUPS);
  const [groupInvitations, setGroupInvitations] = useLocalStorage('groupInvitations', []);
  const [acknowledgments, setAcknowledgments] = useLocalStorage(
    'acknowledgments',
    INITIAL_ACKNOWLEDGMENTS
  );
  
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null); // Simulated JWT
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, courseAssignments
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Verify users have email field on mount
  useEffect(() => {
    if (users.length > 0 && !users[0].email) {
      console.log('Detected old user structure, resetting to new structure...');
      setUsers(USERS);
      showToast('App data updated to new structure. Please login again.', 'info', 4000);
    }
  }, []);

  // Authentication handlers
  const handleLogin = (email, password) => {
    console.log('Login attempt:', { email, password });
    console.log('Available users:', users.map(u => ({ email: u.email, hasPassword: !!u.password })));
    
    const user = users.find((u) => u.email === email && u.password === password);
    
    if (user) {
      // Simulate JWT token generation
      const token = `jwt_${user.id}_${Date.now()}`;
      setAuthToken(token);
      setCurrentUser(user);
      setCurrentView('dashboard');
      showToast(`Welcome back, ${user.name}!`, 'success');
    } else {
      showToast('Invalid credentials. Please try again.', 'error');
      console.error('Login failed - no matching user found');
    }
  };

  const handleRegister = (name, email, password, role) => {
    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      showToast('Email already registered. Please login instead.', 'error');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      password,
      ...(role === Role.Student && {
        enrolledCourses: [],
        semester: 'Fall 2025',
      }),
      ...(role === Role.Admin && {
        courses: [],
      }),
    };

    setUsers((prev) => [...prev, newUser]);
    
    // Auto-login after registration
    const token = `jwt_${newUser.id}_${Date.now()}`;
    setAuthToken(token);
    setCurrentUser(newUser);
    setCurrentView('dashboard');
    showToast(`Account created successfully! Welcome, ${name}!`, 'success');
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setCurrentView('dashboard');
    setSelectedCourseId(null);
    showToast('Logged out successfully', 'info');
  };

  // Navigation handlers
  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId);
    setCurrentView('courseAssignments');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCourseId(null);
  };

  // Assignment handlers (Professor)
  const handleCreateAssignment = (assignmentData) => {
    const newAssignment = {
      ...assignmentData,
      id: `assign-${Date.now()}`,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setAssignments((prev) => [...prev, newAssignment]);
    showToast('Assignment created successfully!', 'success');
  };

  const handleEditAssignment = (assignment) => {
    // TODO: Implement edit modal
    showToast('Edit functionality coming soon', 'info');
  };

  const handleDeleteAssignment = (assignmentId) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    showToast('Assignment deleted', 'success');
  };

  // Course creation handler (Professor)
  const handleCreateCourse = (courseData) => {
    const newCourse = {
      id: `course-${Date.now()}`,
      ...courseData,
    };
    setCourses((prev) => [...prev, newCourse]);
    showToast('Course created successfully!', 'success');
  };

  // Course enrollment handler (Student)
  const handleEnrollCourse = (courseId) => {
    // Update current user's enrolled courses
    const updatedUser = {
      ...currentUser,
      enrolledCourses: [...(currentUser.enrolledCourses || []), courseId],
    };
    setCurrentUser(updatedUser);

    // Update users array in localStorage
    setUsers((prev) =>
      prev.map((user) =>
        user.id === currentUser.id
          ? updatedUser
          : user
      )
    );

    // Update course's enrolled students
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? {
              ...course,
              enrolledStudents: [...course.enrolledStudents, currentUser.id],
            }
          : course
      )
    );

    const courseName = courses.find((c) => c.id === courseId)?.name;
    showToast(`Successfully enrolled in ${courseName}!`, 'success');
  };

  // Acknowledgment handler (Student)
  const handleAcknowledge = (assignmentId, studentId, groupId) => {
    const existingAck = acknowledgments.find(
      (ack) => ack.assignmentId === assignmentId && ack.studentId === studentId
    );

    if (!existingAck) {
      const newAck = {
        id: `ack-${Date.now()}`,
        assignmentId,
        studentId,
        groupId,
        acknowledged: true,
        acknowledgedAt: new Date().toISOString(),
      };
      setAcknowledgments((prev) => [...prev, newAck]);
    }
  };

  // Group handlers (Student)
  const handleCreateGroup = (courseId, groupName, memberIds) => {
    const newGroup = {
      id: `group-${Date.now()}`,
      courseId,
      name: groupName,
      leaderId: currentUser.id,
      members: [currentUser.id], // Start with just the creator
      createdAt: new Date().toISOString(),
    };
    
    setGroups((prev) => [...prev, newGroup]);

    // Create invitations for selected members
    const invitations = memberIds.map((memberId) => ({
      id: `invitation-${Date.now()}-${memberId}`,
      groupId: newGroup.id,
      courseId,
      inviterId: currentUser.id,
      inviteeId: memberId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }));

    setGroupInvitations((prev) => [...prev, ...invitations]);
    showToast(`Group "${groupName}" created! Invitations sent to ${memberIds.length} student${memberIds.length > 1 ? 's' : ''}.`, 'success');
  };

  const handleAcceptInvitation = (invitationId) => {
    const invitation = groupInvitations.find((inv) => inv.id === invitationId);
    if (!invitation) return;

    // Update invitation status
    setGroupInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: 'accepted' } : inv
      )
    );

    // Add user to group
    setGroups((prev) =>
      prev.map((group) =>
        group.id === invitation.groupId
          ? { ...group, members: [...group.members, currentUser.id] }
          : group
      )
    );

    const group = groups.find((g) => g.id === invitation.groupId);
    showToast(`You've joined "${group?.name}"!`, 'success');
  };

  const handleRejectInvitation = (invitationId) => {
    setGroupInvitations((prev) =>
      prev.map((inv) =>
        inv.id === invitationId ? { ...inv, status: 'rejected' } : inv
      )
    );
    showToast('Invitation declined', 'info');
  };

  const handleLeaveGroup = (groupId) => {
    const group = groups.find((g) => g.id === groupId);
    
    // Remove user from group
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, members: g.members.filter((id) => id !== currentUser.id) }
          : g
      )
    );

    // Delete group if no members left
    setGroups((prev) => prev.filter((g) => g.id !== groupId || g.members.length > 1));

    showToast(`You've left "${group?.name}"`, 'info');
  };

  const handleSendInvitation = (groupId, studentId) => {
    // This function is for future use if we want to add members after group creation
    const group = groups.find((g) => g.id === groupId);
    const newInvitation = {
      id: `invitation-${Date.now()}`,
      groupId,
      courseId: group.courseId,
      inviterId: currentUser.id,
      inviteeId: studentId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setGroupInvitations((prev) => [...prev, newInvitation]);
    showToast('Invitation sent!', 'success');
  };

  const handleJoinGroup = (assignmentId) => {
    // TODO: Implement join group modal
    showToast('Join group functionality coming soon', 'info');
  };

  // Get selected course
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const courseStudents = selectedCourse
    ? users.filter((u) => selectedCourse.enrolledStudents.includes(u.id))
    : [];

  // Render based on authentication and role
  if (!authToken || !currentUser) {
    return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">
                Assignment Tracker
              </h1>
              {currentView !== 'dashboard' && (
                <span className="text-white text-opacity-50">•</span>
              )}
              {selectedCourse && (
                <span className="text-white font-medium">
                  {selectedCourse.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-white">{currentUser.name}</p>
                <p className="text-sm text-white text-opacity-75 capitalize">{currentUser.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all backdrop-blur-sm border border-white border-opacity-20"
              >
                <LogOut className="w-4 h-4 text-black" />
                <span className="hidden sm:inline text-black">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {currentUser.role === Role.Admin ? (
          // Professor Views
          currentView === 'dashboard' ? (
            <ProfessorDashboard
              professor={currentUser}
              courses={courses}
              assignments={assignments}
              onCourseClick={handleCourseClick}
              onCreateCourse={handleCreateCourse}
            />
          ) : (
            <CourseAssignmentsPage
              course={selectedCourse}
              assignments={assignments}
              acknowledgments={acknowledgments}
              groups={groups}
              students={courseStudents}
              onBack={handleBackToDashboard}
              onCreateAssignment={handleCreateAssignment}
              onEditAssignment={handleEditAssignment}
              onDeleteAssignment={handleDeleteAssignment}
            />
          )
        ) : (
          // Student Views
          currentView === 'dashboard' ? (
            <StudentDashboardNew
              student={currentUser}
              courses={courses}
              assignments={assignments}
              acknowledgments={acknowledgments}
              allStudents={users.filter((u) => u.role === Role.Student)}
              groups={groups}
              groupInvitations={groupInvitations}
              onCourseClick={handleCourseClick}
              onEnrollCourse={handleEnrollCourse}
              onCreateGroup={handleCreateGroup}
              onSendInvitation={handleSendInvitation}
              onAcceptInvitation={handleAcceptInvitation}
              onRejectInvitation={handleRejectInvitation}
              onLeaveGroup={handleLeaveGroup}
            />
          ) : (
            <StudentCourseAssignmentsPage
              course={selectedCourse}
              student={currentUser}
              assignments={assignments}
              acknowledgments={acknowledgments}
              groups={groups}
              allStudents={users.filter((u) => u.role === Role.Student)}
              onBack={handleBackToDashboard}
              onAcknowledge={handleAcknowledge}
              onJoinGroup={handleJoinGroup}
              onCreateGroup={handleCreateGroup}
            />
          )
        )}
      </main>
    </div>
  );
}

// Wrapped App with ToastProvider
function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
