import { AppState, User, UserName } from '../types';

const STORAGE_KEY = 'SuccessListData';
const LAST_USER_KEY = 'SuccessListLastUser';

const createInitialUser = (name: UserName): User => ({
  name,
  tasks: [],
  completedTasks: [],
});

const createInitialState = (): AppState => ({
  currentUser: 'Stockton',
  users: {
    Stockton: createInitialUser('Stockton'),
    Brittlyn: createInitialUser('Brittlyn'),
  },
});

export const StorageService = {
  async getAppState(): Promise<AppState> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const lastUser = localStorage.getItem(LAST_USER_KEY);
      
      if (data) {
        const parsed = JSON.parse(data) as AppState;
        // Convert date strings back to Date objects
        Object.values(parsed.users).forEach(user => {
          user.tasks.forEach(task => {
            task.createdAt = new Date(task.createdAt);
            if (task.completedAt) task.completedAt = new Date(task.completedAt);
            if (task.dueDate) task.dueDate = new Date(task.dueDate);
          });
          user.completedTasks.forEach(task => {
            task.createdAt = new Date(task.createdAt);
            if (task.completedAt) task.completedAt = new Date(task.completedAt);
            if (task.dueDate) task.dueDate = new Date(task.dueDate);
          });
        });
        
        // Use last remembered user if available
        if (lastUser && (lastUser === 'Stockton' || lastUser === 'Brittlyn')) {
          parsed.currentUser = lastUser as UserName;
        }
        
        return parsed;
      }
      
      return createInitialState();
    } catch (error) {
      console.error('Error loading app state:', error);
      return createInitialState();
    }
  },

  async saveAppState(state: AppState): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      localStorage.setItem(LAST_USER_KEY, state.currentUser);
    } catch (error) {
      console.error('Error saving app state:', error);
    }
  },

  async clearAllData(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LAST_USER_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },

  // Clean up completed tasks older than 7 days
  cleanupCompletedTasks(state: AppState): AppState {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const cleanedState = { ...state };
    
    Object.keys(cleanedState.users).forEach(userName => {
      const user = cleanedState.users[userName as UserName];
      user.completedTasks = user.completedTasks.filter(task => 
        !task.completedAt || task.completedAt > sevenDaysAgo
      );
    });

    return cleanedState;
  },
};