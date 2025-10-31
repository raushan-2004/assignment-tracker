import React, { useState } from 'react';
import { Role } from '../types';
import ConfirmationModal from './ConfirmationModal';
import ProgressBar from './ProgressBar';
import { DriveIcon } from './icons/DriveIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

const AssignmentItem = ({ assignment, user, submissions, allStudents = [], onSubmission }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFinalConfirmModal, setShowFinalConfirmModal] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  const dueDate = new Date(assignment.dueDate);
  const isPastDue = dueDate < new Date();

  // Student View Logic
  const studentSubmission = submissions.find(s => s.studentId === user.id && s.assignmentId === assignment.id);
  const isSubmitted = !!studentSubmission;

  const handleInitialSubmit = () => {
    setShowConfirmModal(true);
  };
  
  const handleFirstConfirm = () => {
    setShowConfirmModal(false);
    setShowFinalConfirmModal(true);
  };
  
  const handleFinalConfirm = () => {
    if (onSubmission) {
      onSubmission(assignment.id);
    }
    setShowFinalConfirmModal(false);
  };

  // Admin View Logic
  const submissionsForAssignment = submissions.filter(s => s.assignmentId === assignment.id);
  const progress = allStudents.length > 0 ? (submissionsForAssignment.length / allStudents.length) * 100 : 0;

  const renderStudentView = () => (
    <>
      <div className="mt-4 pt-4 border-t border-slate-200">
        {isSubmitted ? (
          <div className="flex items-center space-x-2 text-green-600 font-semibold p-2 bg-green-50 rounded-lg">
            <CheckCircleIcon />
            <span>Submitted on {new Date(studentSubmission.submittedAt).toLocaleDateString()}</span>
          </div>
        ) : (
          <button
            onClick={handleInitialSubmit}
            disabled={isSubmitted}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Submit Assignment
          </button>
        )}
      </div>
      {showConfirmModal && (
        <ConfirmationModal
          title="Confirm Submission"
          message="Are you sure you have submitted this assignment via the provided link? This action will mark it as complete."
          onConfirm={handleFirstConfirm}
          onCancel={() => setShowConfirmModal(false)}
          confirmText="Yes, I Have Submitted"
        />
      )}
      {showFinalConfirmModal && (
        <ConfirmationModal
          title="Final Confirmation"
          message="This action is final and cannot be undone. Please confirm your submission."
          onConfirm={handleFinalConfirm}
          onCancel={() => setShowFinalConfirmModal(false)}
          confirmText="Confirm Final Submission"
          isDestructive={true}
        />
      )}
    </>
  );
  
  const renderAdminView = () => (
    <div className="mt-4 pt-4 border-t border-slate-200">
      <h4 className="font-semibold text-sm text-slate-600 mb-2">Submission Progress</h4>
      <ProgressBar progress={progress} />
      <p className="text-xs text-slate-500 mt-1">{submissionsForAssignment.length} of {allStudents.length} students submitted.</p>
      <button onClick={() => setIsDetailsExpanded(!isDetailsExpanded)} className="text-indigo-600 text-sm font-semibold mt-3 hover:underline">
        {isDetailsExpanded ? 'Hide Details' : 'Show Details'}
      </button>
      {isDetailsExpanded && (
        <ul className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-2">
          {allStudents.map(student => {
            const hasSubmitted = submissions.some(s => s.studentId === student.id && s.assignmentId === assignment.id);
            return (
              <li key={student.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{student.name}</span>
                {hasSubmitted ? 
                  <span className="flex items-center text-green-600"><CheckCircleIcon className="mr-1" /> Submitted</span> :
                  <span className="flex items-center text-red-500"><XCircleIcon className="mr-1" /> Not Submitted</span>
                }
              </li>
            )
          })}
        </ul>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      <div>
        <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-slate-800 pr-2">{assignment.title}</h3>
            {assignment.driveLink && (
              <a href={assignment.driveLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-slate-500 hover:text-blue-600 transition-colors" title="Open submission link">
                <DriveIcon />
              </a>
            )}
        </div>
        <p className={`text-sm font-semibold mt-1 ${isPastDue ? 'text-red-500' : 'text-slate-500'}`}>
          Due: {dueDate.toLocaleDateString()}
        </p>
        <p className="text-slate-600 mt-3 text-sm">{assignment.description}</p>
      </div>
      {user.role === Role.Student ? renderStudentView() : renderAdminView()}
    </div>
  );
};

export default AssignmentItem;