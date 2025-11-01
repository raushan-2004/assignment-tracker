import React, { useState } from 'react';
import { LoginIcon } from './icons/LoginIcon';

const LoginModal = ({ user, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const isSuccess = onLogin(password);
    if (!isSuccess) {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                <LoginIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Login required</h3>
            <p className="text-slate-600 mt-2">
                Please enter the password for <span className="font-semibold">{user.name}</span>.
            </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 sr-only">Password</label>
              <input 
                type="password" 
                id="login-password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                required 
                autoFocus
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          <div className="flex items-center justify-between space-x-4 mt-6">
            <button type="button" onClick={onClose} className="w-full px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
            <button type="submit" className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;