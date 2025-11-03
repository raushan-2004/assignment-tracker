import React from 'react';
import { BookOpen, Users, ClipboardList, ArrowRight, GraduationCap } from 'lucide-react';

// Professor Dashboard showing all courses they teach
const ProfessorDashboard = ({ professor, courses, assignments, onCourseClick }) => {
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
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Courses</h2>
          
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
    </div>
  );
};

export default ProfessorDashboard;
