import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskCategory } from '../types';
import './TaskCreator.css';

const TaskCreator: React.FC = () => {
  const { addTask } = useApp();
  const [taskText, setTaskText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('Primary');
  const [dueDate, setDueDate] = useState<string>('');
  const [hasDueDate, setHasDueDate] = useState(false);

  const handleAddTask = () => {
    if (taskText.trim().length === 0) {
      alert('Please enter a task description');
      return;
    }

    const dueDateObj = hasDueDate && dueDate ? new Date(dueDate) : undefined;
    addTask(taskText.trim(), selectedCategory, dueDateObj);
    
    // Reset form
    setTaskText('');
    setSelectedCategory('Primary');
    setDueDate('');
    setHasDueDate(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="task-creator-container">
      <div className="input-section">
        <input
          type="text"
          className="text-input"
          placeholder="What would you like to accomplish?"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>

      <div className="category-section">
        <label className="section-label">Priority:</label>
        <div className="category-buttons">
          {(['Primary', 'Secondary'] as TaskCategory[]).map((category) => (
            <button
              key={category}
              className={`category-button ${category.toLowerCase()} ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="due-date-section">
        <div className="due-date-header">
          <label className="section-label">Due Date (Optional):</label>
          <button
            className={`toggle-button ${hasDueDate ? 'active' : ''}`}
            onClick={() => {
              setHasDueDate(!hasDueDate);
              if (!hasDueDate) {
                setDueDate(new Date().toISOString().split('T')[0]);
              } else {
                setDueDate('');
              }
            }}
          >
            {hasDueDate ? 'Remove' : 'Add Date'}
          </button>
        </div>

        {hasDueDate && (
          <input
            type="date"
            className="date-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        )}
      </div>

      <button className="add-button" onClick={handleAddTask}>
        Add Task
      </button>
    </div>
  );
};

export default TaskCreator;