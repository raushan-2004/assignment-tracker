import React, { useState } from 'react';
import { Role } from './types';
import { USERS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import Welcome from './components/Welcome';

// App: top-level application. Manages users (persisted to localStorage)
// and the currently selected user. Passes user lists and handlers down
// to Header and to the Admin/Student dashboards.
const App = () => {
  const [users, setUsers] = useLocalStorage('users', USERS);
  const [currentUser, setCurrentUser] = useState(null);

  const handleUserChange = (userId) => {
    if (!userId) {
      setCurrentUser(null);
      return;
    }
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleCreateUser = (name, role, password) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      role,
      password,
    };
    // Persist the new user and set them as the active user immediately
    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser);
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-slate-800">
      <Header
        users={users}
        currentUser={currentUser}
        onUserChange={handleUserChange}
        onCreateUser={handleCreateUser}
        onLogout={handleLogout}
      />
      <main className="p-4 md:p-8">
        {currentUser ? (
          currentUser.role === 'admin' ? (
            <AdminDashboard admin={currentUser} users={users} />
          ) : (
            <StudentDashboard student={currentUser} />
          )
        ) : (
          <Welcome />
        )}
      </main>
    </div>
  );
};

export default App;