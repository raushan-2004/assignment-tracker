import React, { useState } from 'react';
import { Role } from '../types';

const CreateAccountModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState(Role.Student);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    onCreate(name.trim(), role, password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Create New Account</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
              <input 
                type="text" 
                id="name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                required 
                placeholder="e.g., Jane Doe"
              />
            </div>
              <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                required 
                placeholder="6+ characters"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <input 
                type="password" 
                id="confirm-password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                required 
                placeholder="Re-enter your password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Role</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="role-student"
                    name="role"
                    type="radio"
                    value={Role.Student}
                    checked={role === Role.Student}
                    onChange={() => setRole(Role.Student)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300"
                  />
                  <label htmlFor="role-student" className="ml-3 block text-sm font-medium text-slate-700">
                    Student
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="role-admin"
                    name="role"
                    type="radio"
                    value={Role.Admin}
                    checked={role === Role.Admin}
                    onChange={() => setRole(Role.Admin)}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-slate-300"
                  />
                  <label htmlFor="role-admin" className="ml-3 block text-sm font-medium text-slate-700">
                    Admin / Professor
                  </label>
                </div>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Create Account</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountModal;