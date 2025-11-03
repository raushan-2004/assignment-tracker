import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { SubmissionType } from '../types';

// Course Assignment Management Page for Professors
const CourseAssignmentsPage = ({
  course,
  assignments,
  acknowledgments,
  groups,
  students,
  onBack,
  onCreateAssignment,
  onEditAssignment,
  onDeleteAssignment,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, past
  const [filterType, setFilterType] = useState('all'); // all, individual, group
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter assignments for this course
  const courseAssignments = assignments.filter((a) => a.courseId === course.id);

  // Calculate submission statistics
  const getAssignmentStats = (assignment) => {
    if (assignment.submissionType === SubmissionType.Individual) {
      const totalStudents = students.length;
      const submitted = acknowledgments.filter(
        (ack) => ack.assignmentId === assignment.id && ack.acknowledged
      ).length;
      return { submitted, total: totalStudents };
    } else {
      // Group assignment
      const assignmentGroups = groups.filter((g) => g.assignmentId === assignment.id);
      const totalGroups = assignmentGroups.length;
      const submitted = acknowledgments.filter(
        (ack) => ack.assignmentId === assignment.id && ack.acknowledged
      ).length;
      return { submitted, total: totalGroups };
    }
  };

  // Apply filters
  const filteredAssignments = courseAssignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase());

    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && dueDate > now) ||
      (filterStatus === 'past' && dueDate <= now);

    const matchesType =
      filterType === 'all' || assignment.submissionType === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

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

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className={`h-2 ${course.color} rounded-full mb-4`}></div>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  {course.name}
                </h1>
                <p className="text-slate-600">
                  {course.code} • {course.semester}
                </p>
                <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {students.length} students enrolled
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create Assignment
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="past">Past Due</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="all">All Types</option>
              <option value={SubmissionType.Individual}>Individual</option>
              <option value={SubmissionType.Group}>Group</option>
            </select>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No assignments found
              </h3>
              <p className="text-slate-500">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first assignment to get started'}
              </p>
            </div>
          ) : (
            filteredAssignments.map((assignment) => {
              const stats = getAssignmentStats(assignment);
              const dueDate = new Date(assignment.dueDate);
              const isPastDue = dueDate < new Date();
              const progress = stats.total > 0 ? (stats.submitted / stats.total) * 100 : 0;

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-800">
                            {assignment.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              assignment.submissionType === SubmissionType.Group
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {assignment.submissionType === SubmissionType.Group
                              ? 'Group'
                              : 'Individual'}
                          </span>
                          {isPastDue && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                              Past Due
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mb-3">
                          {assignment.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Due: {dueDate.toLocaleDateString()} at{' '}
                            {dueDate.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {assignment.oneDriveLink && (
                            <a
                              href={assignment.oneDriveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              OneDrive Link
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditAssignment(assignment)}
                          className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDeleteAssignment(assignment.id)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-600 font-medium">
                          Submission Progress
                        </span>
                        <span className="text-slate-800 font-semibold">
                          {stats.submitted} / {stats.total}{' '}
                          {assignment.submissionType === SubmissionType.Group
                            ? 'groups'
                            : 'students'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {progress.toFixed(0)}% acknowledged
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create/Edit Assignment Modal would go here */}
      {isCreateModalOpen && (
        <CreateAssignmentModal
          course={course}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={onCreateAssignment}
        />
      )}
    </div>
  );
};

// Placeholder for modal - would need full implementation
const CreateAssignmentModal = ({ course, onClose, onCreate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
        <h3 className="text-2xl font-bold mb-4">Create Assignment</h3>
        <p className="text-slate-600">Modal implementation coming next...</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CourseAssignmentsPage;
