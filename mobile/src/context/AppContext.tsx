import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { AppState, Task, UserName, TaskCategory } from '../types';
import { StorageService } from '../services/storage';

interface AppContextType {
  state: AppState;
  switchUser: (userName: UserName) => void;
  addTask: (text: string, category: TaskCategory, dueDate?: Date) => void;
  completeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
}

type AppAction = 
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'SWITCH_USER'; payload: UserName }
  | { type: 'ADD_TASK'; payload: { text: string; category: TaskCategory; dueDate?: Date } }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: string };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
      
    case 'SWITCH_USER':
      return { ...state, currentUser: action.payload };
      
    case 'ADD_TASK': {
      const newTask: Task = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text: action.payload.text,
        category: action.payload.category,
        completed: false,
        dueDate: action.payload.dueDate,
        createdAt: new Date(),
      };
      
      return {
        ...state,
        users: {
          ...state.users,
          [state.currentUser]: {
            ...state.users[state.currentUser],
            tasks: [...state.users[state.currentUser].tasks, newTask],
          },
        },
      };
    }
    
    case 'COMPLETE_TASK': {
      const currentUser = state.users[state.currentUser];
      const taskToComplete = currentUser.tasks.find(task => task.id === action.payload);
      
      if (!taskToComplete) return state;
      
      const completedTask = { ...taskToComplete, completed: true, completedAt: new Date() };
      
      return {
        ...state,
        users: {
          ...state.users,
          [state.currentUser]: {
            ...currentUser,
            tasks: currentUser.tasks.filter(task => task.id !== action.payload),
            completedTasks: [...currentUser.completedTasks, completedTask],
          },
        },
      };
    }
    
    case 'DELETE_TASK': {
      const currentUser = state.users[state.currentUser];
      
      return {
        ...state,
        users: {
          ...state.users,
          [state.currentUser]: {
            ...currentUser,
            tasks: currentUser.tasks.filter(task => task.id !== action.payload),
          },
        },
      };
    }
    
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | null>(null);

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    currentUser: 'Stockton',
    users: {
      Stockton: { name: 'Stockton', tasks: [], completedTasks: [] },
      Brittlyn: { name: 'Brittlyn', tasks: [], completedTasks: [] },
    },
  });

  // Load initial state from storage
  useEffect(() => {
    const loadState = async () => {
      const savedState = await StorageService.getAppState();
      const cleanedState = StorageService.cleanupCompletedTasks(savedState);
      dispatch({ type: 'SET_STATE', payload: cleanedState });
    };
    loadState();
  }, []);

  // Save state changes to storage
  useEffect(() => {
    const saveState = async () => {
      await StorageService.saveAppState(state);
    };
    saveState();
  }, [state]);

  const switchUser = (userName: UserName) => {
    dispatch({ type: 'SWITCH_USER', payload: userName });
  };

  const addTask = (text: string, category: TaskCategory, dueDate?: Date) => {
    dispatch({ type: 'ADD_TASK', payload: { text, category, dueDate } });
  };

  const completeTask = (taskId: string) => {
    dispatch({ type: 'COMPLETE_TASK', payload: taskId });
  };

  const deleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  };

  const contextValue: AppContextType = {
    state,
    switchUser,
    addTask,
    completeTask,
    deleteTask,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};