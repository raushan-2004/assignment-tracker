import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  User,
  ExternalLink,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import { SubmissionType } from '../types';
import { useToast } from '../context/ToastContext';

// Student Assignment Viewing Page
const StudentCourseAssignmentsPage = ({
  course,
  student,
  assignments,
  acknowledgments,
  groups,
  allStudents,
  onBack,
  onAcknowledge,
  onJoinGroup,
  onCreateGroup,
}) => {
  const { showToast } = useToast();
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Filter assignments for this course
  const courseAssignments = assignments.filter((a) => a.courseId === course.id);

  // Check if student has acknowledged an assignment
  const isAcknowledged = (assignmentId) => {
    return acknowledgments.some(
      (ack) =>
        ack.assignmentId === assignmentId &&
        ack.studentId === student.id &&
        ack.acknowledged
    );
  };

  // Get group for an assignment
  const getStudentGroup = (assignmentId) => {
    return groups.find(
      (g) => g.assignmentId === assignmentId && g.members.includes(student.id)
    );
  };

  // Check if student is group leader
  const isGroupLeader = (group) => {
    return group && group.leaderId === student.id;
  };

  // Handle acknowledgment
  const handleAcknowledge = (assignment) => {
    const group = getStudentGroup(assignment.id);

    if (assignment.submissionType === SubmissionType.Group) {
      if (!group) {
        showToast('You must be part of a group to acknowledge this assignment', 'error');
        return;
      }
      if (!isGroupLeader(group)) {
        showToast('Only the group leader can acknowledge this assignment', 'warning');
        return;
      }
    }

    onAcknowledge(assignment.id, student.id, group?.id);
    showToast('Assignment acknowledged successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className={`h-2 ${course.color} rounded-full mb-4`}></div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {course.name}
              </h1>
              <p className="text-slate-600">
                {course.code} • {course.semester}
              </p>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {courseAssignments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No assignments yet
              </h3>
              <p className="text-slate-500">
                Your professor hasn't posted any assignments for this course.
              </p>
            </div>
          ) : (
            courseAssignments.map((assignment) => {
              const dueDate = new Date(assignment.dueDate);
              const isPastDue = dueDate < new Date();
              const acknowledged = isAcknowledged(assignment.id);
              const group = getStudentGroup(assignment.id);
              const isLeader = isGroupLeader(group);
              const isGroupAssignment =
                assignment.submissionType === SubmissionType.Group;

              // Check if any group member acknowledged (for group assignments)
              let groupAcknowledged = false;
              if (isGroupAssignment && group) {
                groupAcknowledged = acknowledgments.some(
                  (ack) =>
                    ack.assignmentId === assignment.id && ack.acknowledged
                );
              }

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden animate-scale-in"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-2xl font-bold text-slate-800">
                            {assignment.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                              isGroupAssignment
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {isGroupAssignment ? (
                              <Users className="w-3 h-3" />
                            ) : (
                              <User className="w-3 h-3" />
                            )}
                            {isGroupAssignment ? 'Group' : 'Individual'}
                          </span>
                          {(acknowledged || groupAcknowledged) && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Acknowledged
                            </span>
                          )}
                          {isPastDue && !acknowledged && !groupAcknowledged && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Past Due
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 mb-4">{assignment.description}</p>

                        {/* Due Date and Link */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center gap-2 text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">Due:</span>
                            <span className={isPastDue ? 'text-red-600 font-semibold' : ''}>
                              {dueDate.toLocaleDateString()} at{' '}
                              {dueDate.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </span>
                          {assignment.oneDriveLink && (
                            <a
                              href={assignment.oneDriveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Open Submission Link
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Group Info for Group Assignments */}
                    {isGroupAssignment && (
                      <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        {group ? (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-5 h-5 text-purple-600" />
                              <h4 className="font-semibold text-purple-900">
                                {group.name}
                                {isLeader && (
                                  <span className="ml-2 px-2 py-0.5 bg-purple-200 text-purple-800 text-xs rounded-full">
                                    You are the leader
                                  </span>
                                )}
                              </h4>
                            </div>
                            <div className="text-sm text-purple-700">
                              <p className="font-medium mb-1">Group Members:</p>
                              <ul className="space-y-1">
                                {group.members.map((memberId) => {
                                  const member = allStudents.find((s) => s.id === memberId);
                                  return (
                                    <li key={memberId} className="flex items-center gap-2">
                                      <User className="w-3 h-3" />
                                      {member?.name || 'Unknown'}
                                      {memberId === group.leaderId && (
                                        <span className="text-xs text-purple-600">(Leader)</span>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-3">
                            <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                            <p className="text-slate-700 font-medium mb-2">
                              You are not part of any group
                            </p>
                            <p className="text-sm text-slate-600 mb-3">
                              Form or join a group to submit this assignment
                            </p>
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => onCreateGroup(assignment.id)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-medium flex items-center gap-2"
                              >
                                <UserPlus className="w-4 h-4" />
                                Create Group
                              </button>
                              <button
                                onClick={() => onJoinGroup(assignment.id)}
                                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all text-sm font-medium"
                              >
                                Join Existing Group
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Acknowledgment Section */}
                    <div className="pt-4 border-t border-slate-200">
                      {acknowledged || groupAcknowledged ? (
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-green-900">
                              Submission Acknowledged
                            </p>
                            <p className="text-sm text-green-700">
                              {isGroupAssignment && !isLeader
                                ? 'Your group leader has acknowledged this assignment'
                                : 'You have confirmed submission of this assignment'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {isGroupAssignment && !group ? (
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-center">
                              <AlertCircle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                              <p className="text-sm text-orange-800">
                                You must join or create a group before acknowledging this assignment
                              </p>
                            </div>
                          ) : isGroupAssignment && !isLeader ? (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm text-blue-800 text-center">
                                Only your group leader can acknowledge this assignment. Please coordinate with your team.
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm text-slate-600 mb-3">
                                {isGroupAssignment
                                  ? 'As the group leader, acknowledge that your group has submitted this assignment:'
                                  : 'Acknowledge that you have submitted this assignment:'}
                              </p>
                              <button
                                onClick={() => handleAcknowledge(assignment)}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                                Yes, I have submitted
                              </button>
                              <p className="text-xs text-slate-500 text-center mt-2">
                                This action confirms you have completed and submitted your work via the OneDrive link
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCourseAssignmentsPage;
