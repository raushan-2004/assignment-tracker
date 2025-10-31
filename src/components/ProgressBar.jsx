import React from 'react';

const ProgressBar = ({ progress }) => {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
      <div
        className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${safeProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;