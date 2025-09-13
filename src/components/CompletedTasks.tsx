import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import './CompletedTasks.css';

const CompletedTaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const formatCompletionDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffInDays} days ago`;
    }
  };

  return (
    <div className={`completed-task-item ${task.category === 'Primary' ? 'primary' : ''}`}>
      <div className="completed-task-content">
        <div className={`completed-task-text ${task.category === 'Primary' ? 'primary' : ''}`}>
          {task.text}
        </div>
        <div className="completion-date-text">
          Completed {task.completedAt ? formatCompletionDate(task.completedAt) : ''}
        </div>
      </div>
      <div className="check-mark">✓</div>
    </div>
  );
};

const CompletedTasks: React.FC = () => {
  const { state } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentUser = state.users[state.currentUser];
  const completedTasks = currentUser.completedTasks.sort((a, b) => 
    (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0)
  );

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (completedTasks.length === 0) {
    return null;
  }

  return (
    <div className="completed-tasks-container">
      <div className="completed-header" onClick={toggleExpanded}>
        <h3 className="completed-header-title">
          Completed Tasks ({completedTasks.length})
        </h3>
        <span className={`chevron ${isExpanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </div>

      <div className={`completed-content ${isExpanded ? 'expanded' : ''}`}>
        {isExpanded && (
          <div className="completed-list">
            {completedTasks.length > 0 && (
              <div className="motivational-text">
                Great job! You've accomplished {completedTasks.length} task{completedTasks.length !== 1 ? 's' : ''}! 🎉
              </div>
            )}
            
            {completedTasks.map((task) => (
              <CompletedTaskItem key={task.id} task={task} />
            ))}
            
            {completedTasks.length > 0 && (
              <div className="cleanup-note">
                * Completed tasks are automatically removed after 7 days
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedTasks;