import React, { useState } from 'react';
import { USERS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import Welcome from './components/Welcome';


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

  const handleCreateUser = (name, role, password) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      role,
      password,
    };
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