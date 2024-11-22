
import React from 'react';
import Sidebar from './Sidebar.jsx';

const Settings = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Welcome Content */}
      <div style={{ marginLeft: '240px', padding: '20px' }}>
        <h1>Welcome to the settings !</h1>
        <p>Here you can explore various features.</p>
      </div>
    </div>
  );
};

export default Settings;
