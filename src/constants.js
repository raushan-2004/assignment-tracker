import { Role } from './types';

export const USERS = [
  { id: 'user-1', name: 'Professor Anya', role: Role.Admin },
  { id: 'user-2', name: 'Ben Carter', role: Role.Student },
  { id: 'user-3', name: 'Chloe Davis', role: Role.Student },
  { id: 'user-4', name: 'David Evans', role: Role.Student },
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: 'assign-1',
    title: 'Calculus I: Problem Set 1',
    description: 'Complete problems 1-10 from chapter 1. Show all your work.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    driveLink: 'https://docs.google.com/document/d/example1/edit',
    createdBy: 'user-1',
  },
  {
    id: 'assign-2',
    title: 'History Essay: The Roman Empire',
    description: 'Write a 1500-word essay on the fall of the Western Roman Empire.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
    driveLink: 'https://docs.google.com/document/d/example2/edit',
    createdBy: 'user-1',
  },
  {
    id: 'assign-3',
    title: 'Physics Lab Report: Kinematics',
    description: 'Submit your lab report based on last week\'s experiment.',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    createdBy: 'user-1',
  },
];