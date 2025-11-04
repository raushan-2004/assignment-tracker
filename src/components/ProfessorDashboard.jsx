import React, { useState } from 'react';
import { BookOpen, Users, ClipboardList, ArrowRight, GraduationCap, Plus, X } from 'lucide-react';

// Professor Dashboard showing all courses they teach
const ProfessorDashboard = ({ professor, courses, assignments, onCourseClick, onCreateCourse }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    semester: 'Fall 2025',
    color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
  });
  const [errors, setErrors] = useState({});

  // Get courses taught by this professor
  const professorCourses = courses.filter(
    (course) => course.professorId === professor.id
  );

  // Calculate statistics for each course
  const getCourseStats = (courseId) => {
    const courseAssignments = assignments.filter((a) => a.courseId === courseId);
    return {
      totalAssignments: courseAssignments.length,
      activeAssignments: courseAssignments.filter(
        (a) => new Date(a.dueDate) > new Date()
      ).length,
    };
  };

  // Color options for courses
  const colorOptions = [
    { value: 'bg-gradient-to-r from-indigo-500 to-purple-600', label: 'Indigo-Purple' },
    { value: 'bg-gradient-to-r from-blue-500 to-cyan-500', label: 'Blue-Cyan' },
    { value: 'bg-gradient-to-r from-green-500 to-emerald-500', label: 'Green-Emerald' },
    { value: 'bg-gradient-to-r from-orange-500 to-red-500', label: 'Orange-Red' },
    { value: 'bg-gradient-to-r from-pink-500 to-rose-500', label: 'Pink-Rose' },
    { value: 'bg-gradient-to-r from-purple-500 to-fuchsia-500', label: 'Purple-Fuchsia' },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Course name is required';
    if (!formData.code.trim()) newErrors.code = 'Course code is required';
    if (!formData.semester.trim()) newErrors.semester = 'Semester is required';
    return newErrors;
  };

  // Handle course creation
  const handleCreateCourse = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onCreateCourse({
      ...formData,
      professorId: professor.id,
      enrolledStudents: [],
    });

    // Reset form and close modal
    setFormData({
      name: '',
      code: '',
      semester: 'Fall 2025',
      color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    });
    setErrors({});
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                Welcome back, {professor.name}
              </h1>
              <p className="text-slate-600 mt-1">Here's an overview of your courses</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {professorCourses.length}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Students</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {professorCourses.reduce(
                    (acc, course) => acc + course.enrolledStudents.length,
                    0
                  )}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Active Assignments</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {assignments.filter((a) => new Date(a.dueDate) > new Date()).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ClipboardList className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Your Courses</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Create Course
            </button>
          </div>
          
          {professorCourses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No courses yet
              </h3>
              <p className="text-slate-500">
                You don't have any courses assigned at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professorCourses.map((course) => {
                const stats = getCourseStats(course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => onCourseClick(course.id)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
                  >
                    {/* Color Header */}
                    <div className={`h-3 ${course.color}`}></div>
                    
                    <div className="p-6">
                      {/* Course Info */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {course.name}
                          </h3>
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-sm font-semibold text-slate-500">
                          {course.code}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{course.semester}</p>
                      </div>

                      {/* Stats */}
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Students
                          </span>
                          <span className="font-semibold text-slate-800">
                            {course.enrolledStudents.length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 flex items-center gap-2">
                            <ClipboardList className="w-4 h-4" />
                            Assignments
                          </span>
                          <span className="font-semibold text-slate-800">
                            {stats.activeAssignments} / {stats.totalAssignments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <BookOpen className="w-6 h-6 text-black" />
                  </div>
                  <h2 className="text-2xl font-bold">Create New Course</h2>
                </div>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setFormData({
                      name: '',
                      code: '',
                      semester: 'Fall 2025',
                      color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
                    });
                    setErrors({});
                  }}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Course Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Course Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Introduction to Computer Science"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-indigo-500'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Course Code */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Course Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., CS101"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.code
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-indigo-500'
                  }`}
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">{errors.code}</p>
                )}
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Semester *
                </label>
                <input
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  placeholder="e.g., Fall 2025"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.semester
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:ring-indigo-500'
                  }`}
                />
                {errors.semester && (
                  <p className="text-red-500 text-sm mt-1">{errors.semester}</p>
                )}
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Course Color Theme
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, color: option.value }))}
                      className={`relative p-4 rounded-lg border-2 transition-all ${
                        formData.color === option.value
                          ? 'border-indigo-600 shadow-md'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`h-8 ${option.value} rounded mb-2`}></div>
                      <p className="text-xs text-slate-600 text-center">{option.label}</p>
                      {formData.color === option.value && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 px-6 py-4 rounded-b-2xl border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setFormData({
                    name: '',
                    code: '',
                    semester: 'Fall 2025',
                    color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
                  });
                  setErrors({});
                }}
                className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCourse}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Create Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorDashboard;
