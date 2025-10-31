import React from 'react';

const Header = ({ users, currentUser, onUserChange }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold text-slate-800">
          Assignment Tracker
        </h1>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="font-semibold">{currentUser.name}</p>
            <p className="text-sm text-slate-500 capitalize">{currentUser.role}</p>
          </div>
          <div className="relative">
            <select
              value={currentUser.id}
              onChange={(e) => onUserChange(e.target.value)}
              className="appearance-none w-full bg-slate-100 border border-slate-300 text-slate-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
            >
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
        </div>
      </div>
    </header>
  );
};

export default Header;