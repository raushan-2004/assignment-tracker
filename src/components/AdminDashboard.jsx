import React, { useState } from 'react';
import { INITIAL_ASSIGNMENTS } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';
import AssignmentItem from './AssignmentItem';
import CreateAssignmentModal from './CreateAssignmentModal';
import { PlusIcon } from './icons/PlusIcon';

const AdminDashboard = ({ admin, users }) => {
  const [assignments, setAssignments] = useLocalStorage('assignments', INITIAL_ASSIGNMENTS);
  const [submissions] = useLocalStorage('submissions', []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const adminAssignments = assignments.filter(a => a.createdBy === admin.id);
 
  const students = (users || []).filter(u => u.role === 'student');

  const handleCreateAssignment = (newAssignmentData) => {
    const newAssignment = {
      ...newAssignmentData,
      id: `assign-${Date.now()}`,
      createdBy: admin.id,
    };
    setAssignments(prev => [...prev, newAssignment]);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-700">Professor's Dashboard</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center space-x-2"
        >
          <PlusIcon />
          <span>Create Assignment</span>
        </button>
      </div>
      
      {adminAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminAssignments.map(assignment => (
            <AssignmentItem
              key={assignment.id}
              assignment={assignment}
              user={admin}
              submissions={submissions}
              allStudents={students}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold text-slate-600">No assignments created yet.</h3>
          <p className="text-slate-500 mt-2">Click "Create Assignment" to get started.</p>
        </div>
      )}

      {isModalOpen && (
        <CreateAssignmentModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateAssignment}
        />
      )}
    </div>
  );
};

export default AdminDashboard;