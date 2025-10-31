import React, { useState } from 'react';
import { USERS } from './constants';
import Header from './components/Header';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';

const App = () => {
  const [currentUser, setCurrentUser] = useState(USERS[0]);

  const handleUserChange = (userId) => {
    const user = USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-slate-800">
      <Header
        users={USERS}
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />
      <main className="p-4 md:p-8">
        {currentUser.role === 'admin' ? (
          <AdminDashboard admin={currentUser} />
        ) : (
          <StudentDashboard student={currentUser} />
        )}
      </main>
    </div>
  );
};

export default App;