export interface Task {
  id: string;
  text: string;
  category: 'Primary' | 'Secondary';
  completed: boolean;
  completedAt?: Date;
  dueDate?: Date;
  createdAt: Date;
}

export interface User {
  name: 'Stockton' | 'Brittlyn';
  tasks: Task[];
  completedTasks: Task[];
}

export interface AppState {
  currentUser: 'Stockton' | 'Brittlyn';
  users: {
    Stockton: User;
    Brittlyn: User;
  };
}

export type TaskCategory = 'Primary' | 'Secondary';
export type UserName = 'Stockton' | 'Brittlyn';