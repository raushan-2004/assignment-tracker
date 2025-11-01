import React, { useState } from 'react';
import { Role } from '../types';
import ConfirmationModal from './ConfirmationModal';
import ProgressBar from './ProgressBar';
import { DriveIcon } from './icons/DriveIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { LinkIcon } from './icons/Linkicon';

const AssignmentItem = ({ assignment, user, submissions, allStudents = [], onSubmission }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFinalConfirmModal, setShowFinalConfirmModal] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [submissionLink, setSubmissionLink] = useState('');
  const [linkError, setLinkError] = useState('');

  const dueDate = new Date(assignment.dueDate);
  const isPastDue = dueDate < new Date();

  const studentSubmission = submissions.find(s => s.studentId === user.id && s.assignmentId === assignment.id);
  const isSubmitted = !!studentSubmission;

  const isValidUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  };

  const handleLinkChange = (e) => {
    const value = e.target.value;
    setSubmissionLink(value);
    if (value.trim() !== '' && !isValidUrl(value)) {
        setLinkError('Please enter a valid URL.');
    } else {
        setLinkError('');
    }
  };

  const handleInitialSubmit = () => {
    if (!linkError) {
      setShowConfirmModal(true);
    }
  };
  
  const handleFirstConfirm = () => {
    setShowConfirmModal(false);
    setShowFinalConfirmModal(true);
  };
  
  const handleFinalConfirm = () => {
    if (onSubmission) {
      const trimmedLink = submissionLink.trim();
      if (trimmedLink && isValidUrl(trimmedLink)) {
        onSubmission(assignment.id, trimmedLink);
      } else {
        onSubmission(assignment.id); 
      }
    }
    setShowFinalConfirmModal(false);
  };

  // Admin View Logic
  const submissionsForAssignment = submissions.filter(s => s.assignmentId === assignment.id);
  const progress = allStudents.length > 0 ? (submissionsForAssignment.length / allStudents.length) * 100 : 0;

  const renderStudentView = () => {
    const isSubmittingWithLink = submissionLink.trim() !== '' && !linkError;

    return (
      <>
        <div className="mt-4 pt-4 border-t border-slate-200">
          {isSubmitted ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-green-600 font-semibold p-2 bg-green-50 rounded-lg text-sm">
                    <CheckCircleIcon />
                    <span>Submitted on {new Date(studentSubmission.submittedAt).toLocaleDateString()}</span>
                </div>
                {studentSubmission.driveLink && (
                    <div className="text-sm pl-1">
                        <p className="font-semibold text-slate-600">Your Submission:</p>
                        <a href={studentSubmission.driveLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all text-xs flex items-center gap-1.5" title={studentSubmission.driveLink}>
                            <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{studentSubmission.driveLink}</span>
                        </a>
                    </div>
                )}
            </div>
          ) : (
            <div className="space-y-2">
              <div>
                <label htmlFor={`submission-link-${assignment.id}`} className="block text-sm font-medium text-slate-700">Submission Link (Optional)</label>
                <input
                  type="url"
                  id={`submission-link-${assignment.id}`}
                  value={submissionLink}
                  onChange={handleLinkChange}
                  placeholder="Paste link to submit online"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                {linkError && <p className="text-red-500 text-xs mt-1">{linkError}</p>}
              </div>
              <button
                onClick={handleInitialSubmit}
                disabled={!!linkError}
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                Submit Assignment
              </button>
              <p className="text-xs text-slate-500 text-center pt-1">
                If submitted offline, click on submit assignment.
              </p>
            </div>
          )}
        </div>
        {showConfirmModal && (
          <ConfirmationModal
            title="Confirm Submission"
            message={isSubmittingWithLink
              ? "Are you sure you want to submit this link? This action will mark the assignment as complete."
              : "Mark this assignment as submitted without a link? This is for work submitted offline."
            }
            onConfirm={handleFirstConfirm}
            onCancel={() => setShowConfirmModal(false)}
            confirmText={isSubmittingWithLink ? "Yes, Submit Link" : "Yes, Submit Offline"}
          />
        )}
        {showFinalConfirmModal && (
          <ConfirmationModal
            title="Final Confirmation"
            message="This action is final. Please confirm your submission."
            onConfirm={handleFinalConfirm}
            onCancel={() => setShowFinalConfirmModal(false)}
            confirmText="Confirm Final Submission"
            isDestructive={true}
          />
        )}
      </>
    );
  }
  
  const renderAdminView = () => (
    <div className="mt-4 pt-4 border-t border-slate-200">
      <h4 className="font-semibold text-sm text-slate-600 mb-2">Submission Progress</h4>
      <ProgressBar progress={progress} />
      <p className="text-xs text-slate-500 mt-1">{submissionsForAssignment.length} of {allStudents.length} students submitted.</p>
      <button onClick={() => setIsDetailsExpanded(!isDetailsExpanded)} className="text-indigo-600 text-sm font-semibold mt-3 hover:underline">
        {isDetailsExpanded ? 'Hide Details' : 'Show Details'}
      </button>
      {isDetailsExpanded && (
        <ul className="mt-3 space-y-3 max-h-48 overflow-y-auto pr-2">
          {allStudents.map(student => {
              const submission = submissions.find(s => s.studentId === student.id && s.assignmentId === assignment.id);
              const hasSubmitted = !!submission;
            return (
              <li key={student.id} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">{student.name}</span>
                  {hasSubmitted ? 
                    <span className="flex items-center text-green-600"><CheckCircleIcon className="mr-1" /> Submitted</span> :
                    <span className="flex items-center text-red-500"><XCircleIcon className="mr-1" /> Not Submitted</span>
                  }
                </div>
                {hasSubmitted && submission.driveLink && (
                  <div className="mt-1 pl-1">
                    <a href={submission.driveLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all text-xs flex items-center gap-1.5" title={submission.driveLink}>
                      <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{submission.driveLink}</span>
                    </a>
                  </div>
                )}
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
              <a href={assignment.driveLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 text-slate-500 hover:text-blue-600 transition-colors" title="Open assignment link">
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