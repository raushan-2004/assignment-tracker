import React from 'react';
import { GraduationCapIcon } from './icons/GraduationCapIcon';

const Welcome = () => {
  return (
    <div className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-md mt-8">
      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-indigo-100">
          <GraduationCapIcon className="h-12 w-12 text-indigo-600" />
      </div>
      <h2 className="mt-6 text-2xl md:text-4xl font-bold text-slate-800">
        Welcome to the Assignment Tracker
      </h2>
      <p className="mt-3 text-base md:text-lg text-slate-500 max-w-2xl mx-auto">
        Your central hub for managing and tracking all your assignments.
      </p>
      <p className="mt-4 text-md md:text-xl font-semibold text-slate-600">
        Please select your profile from the top-right corner to get started.
      </p>
    </div>
  );
};

export default Welcome;