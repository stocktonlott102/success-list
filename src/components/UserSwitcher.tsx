import React from 'react';
import { useApp } from '../context/AppContext';
import { UserName } from '../types';
import './UserSwitcher.css';

const UserSwitcher: React.FC = () => {
  const { state, switchUser } = useApp();

  return (
    <div className="user-switcher-container">
      <div className="switcher-container">
        {(['Stockton', 'Brittlyn'] as UserName[]).map((userName) => (
          <button
            key={userName}
            className={`user-button ${state.currentUser === userName ? 'active' : ''}`}
            onClick={() => switchUser(userName)}
          >
            {userName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserSwitcher;