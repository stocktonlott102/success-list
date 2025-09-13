import React from 'react';
import { AppProvider } from './context/AppContext';
import UserSwitcher from './components/UserSwitcher';
import InspirationalQuote from './components/InspirationalQuote';
import TaskCreator from './components/TaskCreator';
import TaskList from './components/TaskList';
import CompletedTasks from './components/CompletedTasks';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <div className="app-container">
          <UserSwitcher />
          <InspirationalQuote />
          <TaskCreator />
          <TaskList />
          <CompletedTasks />
          <div className="bottom-spacing" />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
