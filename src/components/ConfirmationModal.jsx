import React from 'react';

const ConfirmationModal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', isDestructive = false }) => {
  const confirmButtonClass = isDestructive 
    ? "bg-red-600 hover:bg-red-700" 
    : "bg-indigo-600 hover:bg-indigo-700";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onCancel}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        <p className="text-slate-600 mt-2 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white font-semibold rounded-lg transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;