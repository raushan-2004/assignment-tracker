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

// Full Create Assignment Modal Implementation
const CreateAssignmentModal = ({ course, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    oneDriveLink: '',
    submissionType: SubmissionType.Individual,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (!formData.dueTime) {
      newErrors.dueTime = 'Due time is required';
    }

    if (formData.oneDriveLink && !formData.oneDriveLink.startsWith('http')) {
      newErrors.oneDriveLink = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Combine date and time into ISO string
    const dueDateTimeString = `${formData.dueDate}T${formData.dueTime}:00`;
    const dueDateTime = new Date(dueDateTimeString);

    const assignmentData = {
      courseId: course.id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: dueDateTime.toISOString(),
      oneDriveLink: formData.oneDriveLink.trim() || undefined,
      submissionType: formData.submissionType,
    };

    // Simulate async operation
    setTimeout(() => {
      onCreate(assignmentData);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-xl">
          <h3 className="text-2xl font-bold text-slate-800">Create New Assignment</h3>
          <p className="text-sm text-slate-600 mt-1">
            {course.name} ({course.code})
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
              Assignment Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Problem Set 1: Differential Equations"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.title ? 'border-red-500 bg-red-50' : 'border-slate-300'
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Provide detailed instructions for the assignment..."
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.description ? 'border-red-500 bg-red-50' : 'border-slate-300'
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Due Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-semibold text-slate-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.dueDate ? 'border-red-500 bg-red-50' : 'border-slate-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="dueTime" className="block text-sm font-semibold text-slate-700 mb-2">
                Due Time *
              </label>
              <input
                type="time"
                id="dueTime"
                name="dueTime"
                value={formData.dueTime}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.dueTime ? 'border-red-500 bg-red-50' : 'border-slate-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              />
              {errors.dueTime && (
                <p className="mt-1 text-sm text-red-500">{errors.dueTime}</p>
              )}
            </div>
          </div>

          {/* OneDrive Link */}
          <div>
            <label htmlFor="oneDriveLink" className="block text-sm font-semibold text-slate-700 mb-2">
              OneDrive Submission Link (Optional)
            </label>
            <input
              type="url"
              id="oneDriveLink"
              name="oneDriveLink"
              value={formData.oneDriveLink}
              onChange={handleChange}
              placeholder="https://onedrive.live.com/..."
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.oneDriveLink ? 'border-red-500 bg-red-50' : 'border-slate-300'
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
            />
            {errors.oneDriveLink && (
              <p className="mt-1 text-sm text-red-500">{errors.oneDriveLink}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              Students will use this link to submit their work
            </p>
          </div>

          {/* Submission Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Submission Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label
                className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.submissionType === SubmissionType.Individual
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="submissionType"
                  value={SubmissionType.Individual}
                  checked={formData.submissionType === SubmissionType.Individual}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600"
                />
                <div className="ml-3">
                  <p className="font-semibold text-slate-800">Individual</p>
                  <p className="text-xs text-slate-600">Each student submits separately</p>
                </div>
              </label>

              <label
                className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.submissionType === SubmissionType.Group
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="submissionType"
                  value={SubmissionType.Group}
                  checked={formData.submissionType === SubmissionType.Group}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600"
                />
                <div className="ml-3">
                  <p className="font-semibold text-slate-800">Group</p>
                  <p className="text-xs text-slate-600">Group leader submits for team</p>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Assignment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseAssignmentsPage;
