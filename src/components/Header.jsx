import React, { useState, useEffect } from 'react';
import CreateAccountModal from './CreateAccountModal';
import LoginModal from './LoginModal';

const Header = ({ users, currentUser, onUserChange, onCreateUser, onLogout }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedUserIdForLogin, setSelectedUserIdForLogin] = useState(null);
  const [selectValue, setSelectValue] = useState(currentUser?.id || '');

  useEffect(() => {
    setSelectValue(currentUser?.id || '');
  }, [currentUser]);

  const handleCreateAndClose = (name, role, password) => {
    onCreateUser(name, role, password);
    setIsCreateModalOpen(false);
  };

  const handleProfileSelect = (userId) => {
    if (userId) {
      setSelectValue(userId);
      setSelectedUserIdForLogin(userId);
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginAttempt = (password) => {
    if (!selectedUserIdForLogin) return false;
    const userToLogin = users.find(u => u.id === selectedUserIdForLogin);

    if (userToLogin && userToLogin.password === password) {
      onUserChange(userToLogin.id);
      setIsLoginModalOpen(false);
      setSelectedUserIdForLogin(null);
      return true;
    }
    return false;
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
    setSelectedUserIdForLogin(null);
    setSelectValue(currentUser?.id || ''); 
  };


  return (
    <>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-3xl font-bold text-slate-800">
            Assignment Tracker
          </h1>
          <div className="flex items-center space-x-2 md:space-x-4">
            {currentUser && (
              <div className="text-right hidden sm:block">
                <p className="font-semibold">{currentUser.name}</p>
                <p className="text-sm text-slate-500 capitalize">{currentUser.role}</p>
              </div>
            )}
            <div className="relative">
              <select
                value={selectValue}
                onChange={(e) => handleProfileSelect(e.target.value)}
                className="appearance-none w-full bg-slate-100 border border-slate-300 text-slate-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
              >
                <option value="" disabled>Select your profile</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
              {currentUser && (
                <button
                onClick={onLogout}
                className="py-2 px-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors text-sm whitespace-nowrap"
              >
                Logout
              </button>
            )}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="py-2 px-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors text-sm whitespace-nowrap"
            >
              Create Account
            </button>
          </div>
        </div>
      </header>
      {isCreateModalOpen && (
        <CreateAccountModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateAndClose}
        />
      )}
        {isLoginModalOpen && selectedUserIdForLogin && (
        <LoginModal
          user={users.find(u => u.id === selectedUserIdForLogin)}
          onClose={handleLoginModalClose}
          onLogin={handleLoginAttempt}
        />
      )}
    </>
  );
};

export default Header;