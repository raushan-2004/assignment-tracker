import React from 'react';
import { BookOpen, Calendar, CheckCircle2, Clock, ArrowRight, GraduationCap } from 'lucide-react';

// Student Dashboard showing enrolled courses
const StudentDashboardNew = ({ student, courses, assignments, acknowledgments, onCourseClick }) => {
  // Get courses student is enrolled in
  const enrolledCourses = courses.filter((course) =>
    student.enrolledCourses?.includes(course.id)
  );

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

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Upcoming</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {
                    assignments.filter(
                      (a) =>
                        enrolledCourses.some((c) => c.id === a.courseId) &&
                        new Date(a.dueDate) > new Date() &&
                        !acknowledgments.some(
                          (ack) =>
                            ack.assignmentId === a.id &&
                            ack.studentId === student.id &&
                            ack.acknowledged
                        )
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">My Courses</h2>

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
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {course.name}
                          </h3>
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
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
                      <div className="space-y-2 pt-4 border-t border-slate-100">
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
                            <Clock className="w-4 h-4 text-orange-500" />
                            Upcoming
                          </span>
                          <span className="font-semibold text-slate-800">
                            {stats.upcomingCount}
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
    </div>
  );
};

export default StudentDashboardNew;
