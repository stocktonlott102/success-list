import React from 'react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import './TaskList.css';

interface TaskItemProps {
  task: Task;
  onComplete: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onDelete }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && !task.completed;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete();
    }
  };

  return (
    <div className={`task-item ${task.category.toLowerCase()} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-content">
        <div className={`task-text ${task.category === 'Primary' ? 'primary' : ''} ${isOverdue ? 'overdue-text' : ''}`}>
          {task.text}
        </div>
        
        {task.dueDate && (
          <div className={`due-date-text ${isOverdue ? 'overdue-date' : ''}`}>
            Due: {formatDate(task.dueDate)}
          </div>
        )}
      </div>
      
      <div className="task-actions">
        <button
          className={`complete-button ${task.category === 'Primary' ? 'primary' : ''}`}
          onClick={onComplete}
          title="Complete task"
        >
          ✓
        </button>
        
        <button className="delete-button" onClick={handleDelete} title="Delete task">
          ✕
        </button>
      </div>
    </div>
  );
};

const TaskList: React.FC = () => {
  const { state, completeTask, deleteTask } = useApp();
  const currentUser = state.users[state.currentUser];
  
  const primaryTasks = currentUser.tasks.filter(task => task.category === 'Primary');
  const secondaryTasks = currentUser.tasks.filter(task => task.category === 'Secondary');

  const renderTaskSection = (title: string, tasks: Task[], sectionClass: string) => (
    <div className="task-section">
      <h2 className={`section-title ${sectionClass}`}>{title}</h2>
      {tasks.length === 0 ? (
        <div className="empty-section">
          <p className="empty-text">
            {title === 'Primary' 
              ? 'No primary tasks yet. Add your most important goals!' 
              : 'No secondary tasks yet. Add your supporting activities!'
            }
          </p>
        </div>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={() => completeTask(task.id)}
            onDelete={() => deleteTask(task.id)}
          />
        ))
      )}
    </div>
  );

  return (
    <div className="task-list-container">
      {renderTaskSection('Primary', primaryTasks, 'primary-section')}
      {renderTaskSection('Secondary', secondaryTasks, 'secondary-section')}
    </div>
  );
};

export default TaskList;