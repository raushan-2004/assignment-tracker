import React, { useState } from 'react';
import { BookOpen, Calendar, CheckCircle2, Clock, ArrowRight, GraduationCap, Plus, X, Search, Users } from 'lucide-react';
import GroupManagementModal from './GroupManagementModal';

// Student Dashboard showing enrolled courses
const StudentDashboardNew = ({ 
  student, 
  courses, 
  assignments, 
  acknowledgments, 
  onCourseClick, 
  onEnrollCourse,
  allStudents,
  groups,
  groupInvitations,
  onCreateGroup,
  onSendInvitation,
  onAcceptInvitation,
  onRejectInvitation,
  onLeaveGroup,
}) => {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedCourseForGroup, setSelectedCourseForGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Get courses student is enrolled in
  const enrolledCourses = courses.filter((course) =>
    student.enrolledCourses?.includes(course.id)
  );

  // Get available courses (not enrolled yet)
  const availableCourses = courses.filter(
    (course) => !student.enrolledCourses?.includes(course.id)
  );

  // Filter available courses by search term
  const filteredAvailableCourses = availableCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle enrollment
  const handleEnroll = (courseId) => {
    onEnrollCourse(courseId);
    setIsEnrollModalOpen(false);
    setSearchTerm('');
  };

  // Open group management modal
  const handleOpenGroupModal = (course) => {
    setSelectedCourseForGroup(course);
    setIsGroupModalOpen(true);
  };

  // Get pending invitation count for a course
  const getPendingInvitationsCount = (courseId) => {
    return groupInvitations.filter(
      (inv) => inv.courseId === courseId && inv.inviteeId === student.id && inv.status === 'pending'
    ).length;
  };

  // Calculate course statistics
  const getCourseStats = (courseId) => {
    const courseAssignments = assignments.filter((a) => a.courseId === courseId);
    const totalAssignments = courseAssignments.length;
    const acknowledgedCount = courseAssignments.filter((assignment) =>
      acknowledgments.some(
        (ack) =>
          ack.assignmentId === assignment.id &&
          ack.studentId === student.id &&
          ack.acknowledged
      )
    ).length;
    const upcomingCount = courseAssignments.filter(
      (a) => new Date(a.dueDate) > new Date()
    ).length;

    return { totalAssignments, acknowledgedCount, upcomingCount };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                Welcome, {student.name}
              </h1>
              <p className="text-slate-600 mt-1">
                {student.semester} • {enrolledCourses.length} courses enrolled
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">My Courses</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {enrolledCourses.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Completed</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {
                    acknowledgments.filter(
                      (ack) => ack.studentId === student.id && ack.acknowledged
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Assignments</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {
                    assignments.filter((a) =>
                      enrolledCourses.some((c) => c.id === a.courseId)
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">My Courses</h2>
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Enroll in Course
            </button>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No courses enrolled
              </h3>
              <p className="text-slate-500">
                Contact your advisor to enroll in courses for this semester.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => {
                const stats = getCourseStats(course.id);
                const completionRate =
                  stats.totalAssignments > 0
                    ? (stats.acknowledgedCount / stats.totalAssignments) * 100
                    : 0;
                const pendingInvitations = getPendingInvitationsCount(course.id);

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Color Header */}
                    <div className={`h-3 ${course.color}`}></div>

                    <div className="p-6">
                      {/* Course Info */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-slate-800">
                            {course.name}
                          </h3>
                        </div>
                        <p className="text-sm font-semibold text-slate-500">
                          {course.code}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{course.semester}</p>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-semibold text-slate-800">
                            {completionRate.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-2 pt-4 border-t border-slate-100 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            Completed
                          </span>
                          <span className="font-semibold text-slate-800">
                            {stats.acknowledgedCount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-slate-500" />
                            Total
                          </span>
                          <span className="font-semibold text-slate-800">
                            {stats.totalAssignments}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => onCourseClick(course.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all text-sm font-semibold"
                        >
                          <BookOpen className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenGroupModal(course);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white rounded-lg hover:from-purple-600 hover:to-fuchsia-600 transition-all text-sm font-semibold relative"
                        >
                          <Users className="w-4 h-4" />
                          Groups
                          {pendingInvitations > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              {pendingInvitations}
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Enroll in Course Modal */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Enroll in Course</h2>
                    <p className="text-blue-100 text-sm mt-1">
                      {availableCourses.length} courses available
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsEnrollModalOpen(false);
                    setSearchTerm('');
                  }}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200" />
                <input
                  type="text"
                  placeholder="Search courses by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {availableCourses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">
                    All Caught Up!
                  </h3>
                  <p className="text-slate-500">
                    You're already enrolled in all available courses.
                  </p>
                </div>
              ) : filteredAvailableCourses.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">
                    No courses found
                  </h3>
                  <p className="text-slate-500">
                    Try adjusting your search terms.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAvailableCourses.map((course) => {
                    const courseAssignments = assignments.filter(
                      (a) => a.courseId === course.id
                    );
                    return (
                      <div
                        key={course.id}
                        className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`h-2 w-2 rounded-full ${course.color}`}></div>
                              <h3 className="text-lg font-bold text-slate-800">
                                {course.name}
                              </h3>
                            </div>
                            <p className="text-sm font-semibold text-slate-500 mb-1">
                              {course.code}
                            </p>
                            <p className="text-xs text-slate-400 mb-3">
                              {course.semester}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-slate-600">
                                <BookOpen className="w-4 h-4" />
                                <span>{courseAssignments.length} assignments</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-600">
                                <GraduationCap className="w-4 h-4" />
                                <span>{course.enrolledStudents.length} students</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleEnroll(course.id)}
                            className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg font-semibold whitespace-nowrap"
                          >
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => {
                  setIsEnrollModalOpen(false);
                  setSearchTerm('');
                }}
                className="px-6 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Management Modal */}
      {isGroupModalOpen && selectedCourseForGroup && (
        <GroupManagementModal
          course={selectedCourseForGroup}
          student={student}
          allStudents={allStudents}
          groups={groups}
          groupInvitations={groupInvitations}
          onClose={() => {
            setIsGroupModalOpen(false);
            setSelectedCourseForGroup(null);
          }}
          onCreateGroup={(groupName, memberIds) => {
            onCreateGroup(selectedCourseForGroup.id, groupName, memberIds);
          }}
          onSendInvitation={onSendInvitation}
          onAcceptInvitation={onAcceptInvitation}
          onRejectInvitation={onRejectInvitation}
          onLeaveGroup={onLeaveGroup}
        />
      )}
    </div>
  );
};

export default StudentDashboardNew;
