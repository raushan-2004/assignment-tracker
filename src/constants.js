import { Role, SubmissionType } from './types';

// Demo users with enhanced structure
export const USERS = [
  { 
    id: 'user-1', 
    name: 'Professor Anya', 
    email: 'prof.anya@university.edu',
    role: Role.Admin, 
    password: 'password123',
    courses: ['course-1', 'course-2'] // Courses taught by professor
  },
  { 
    id: 'user-2', 
    name: 'Ben Carter', 
    email: 'ben.carter@student.edu',
    role: Role.Student, 
    password: 'password123',
    enrolledCourses: ['course-1', 'course-2'], // Courses enrolled in
    semester: 'Fall 2025'
  },
  { 
    id: 'user-3', 
    name: 'Chloe Davis', 
    email: 'chloe.davis@student.edu',
    role: Role.Student, 
    password: 'password123',
    enrolledCourses: ['course-1', 'course-2'],
    semester: 'Fall 2025'
  },
  { 
    id: 'user-4', 
    name: 'David Evans', 
    email: 'david.evans@student.edu',
    role: Role.Student, 
    password: 'password123',
    enrolledCourses: ['course-1', 'course-2'],
    semester: 'Fall 2025'
  },
  { 
    id: 'user-5', 
    name: 'Emma Foster', 
    email: 'emma.foster@student.edu',
    role: Role.Student, 
    password: 'password123',
    enrolledCourses: ['course-1'],
    semester: 'Fall 2025'
  },
];

// Courses structure
export const COURSES = [
  {
    id: 'course-1',
    name: 'Advanced Calculus',
    code: 'MATH 301',
    semester: 'Fall 2025',
    professorId: 'user-1',
    enrolledStudents: ['user-2', 'user-3', 'user-4', 'user-5'],
    color: 'bg-blue-500'
  },
  {
    id: 'course-2',
    name: 'Modern Physics',
    code: 'PHYS 201',
    semester: 'Fall 2025',
    professorId: 'user-1',
    enrolledStudents: ['user-2', 'user-3', 'user-4'],
    color: 'bg-purple-500'
  },
];

// Enhanced assignments with new fields
export const INITIAL_ASSIGNMENTS = [
  {
    id: 'assign-1',
    courseId: 'course-1',
    title: 'Problem Set 1: Limits and Continuity',
    description: 'Complete problems 1-10 from chapter 1. Show all your work and explain your reasoning for each problem.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    oneDriveLink: 'https://onedrive.live.com/edit.aspx?id=example1',
    submissionType: SubmissionType.Individual,
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'assign-2',
    courseId: 'course-1',
    title: 'Group Project: Real-World Calculus Applications',
    description: 'In groups of 3-4, research and present a real-world application of calculus. Submit a 10-page report with visualizations.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 21)).toISOString(),
    oneDriveLink: 'https://onedrive.live.com/edit.aspx?id=example2',
    submissionType: SubmissionType.Group,
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'assign-3',
    courseId: 'course-2',
    title: 'Lab Report: Kinematics Experiment',
    description: 'Submit your lab report based on last week\'s kinematics experiment. Include data tables, graphs, and error analysis.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    oneDriveLink: 'https://onedrive.live.com/edit.aspx?id=example3',
    submissionType: SubmissionType.Individual,
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
  },
];

// Groups for group assignments
export const INITIAL_GROUPS = [
  {
    id: 'group-1',
    assignmentId: 'assign-2',
    name: 'Team Alpha',
    leaderId: 'user-2',
    members: ['user-2', 'user-3', 'user-4'],
    createdAt: new Date().toISOString(),
  },
];

// Acknowledgments tracking
export const INITIAL_ACKNOWLEDGMENTS = [
  {
    id: 'ack-1',
    assignmentId: 'assign-1',
    studentId: 'user-2',
    acknowledged: true,
    acknowledgedAt: new Date().toISOString(),
  },
];