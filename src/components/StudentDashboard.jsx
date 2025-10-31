import React from 'react';
// 'import type' is removed, as types don't exist in JS
import { INITIAL_ASSIGNMENTS } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';
import AssignmentItem from './AssignmentItem';

// The 'interface StudentDashboardProps' is removed.
// We destructure 'student' directly from props.
const StudentDashboard = ({ student }) => {
  // Generic types <Assignment[]> and <Submission[]> are removed
  const [assignments] = useLocalStorage('assignments', INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useLocalStorage('submissions', []);

  // Type annotations ': string' are removed from parameters
  const handleSubmission = (assignmentId, driveLink) => {
    const existingSubmission = submissions.find(s => s.assignmentId === assignmentId && s.studentId === student.id);
    if (!existingSubmission) {
      // The ': Submission' type annotation is removed
      const newSubmission = {
        assignmentId,
        studentId: student.id,
        submitted: true,
        submittedAt: new Date().toISOString(),
        driveLink,
      };
      setSubmissions(prev => [...prev, newSubmission]);
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-700 mb-6">Your Assignments</h2>
      {assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map(assignment => (
            <AssignmentItem
              key={assignment.id}
              assignment={assignment}
              user={student}
              submissions={submissions}
              onSubmission={handleSubmission}
            />
          ))}
        </div>
      ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold text-slate-600">No assignments available at the moment.</h3>
          <p className="text-slate-500 mt-2">Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;