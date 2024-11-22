import React from 'react';
import Sidebar from './Sidebar.jsx';

const Security = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', padding: '20px' }}>
        <h1>Welcome to Security!</h1>
        <p>Here you can explore various security settings.</p>
      </div>
    </div>
  );
};

export default Security;
