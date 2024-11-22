
import React from 'react';
import Sidebar from './Sidebar.jsx';

const Users = () => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Welcome Content */}
      <div style={{  padding: '20px' }}>
        <h1>Welcome to the users !</h1>
        <p>Here you can explore various features.</p>
      </div>
    </div>
  );
};

export default Users;
