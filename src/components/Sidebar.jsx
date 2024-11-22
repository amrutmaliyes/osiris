import React from 'react';
import { IconGauge, IconFingerprint, IconActivity } from '@tabler/icons-react';
import { Box, NavLink, Text } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Replace with actual username from your auth system
  const username = "John"; 

  const data = [
    { icon: IconGauge, label: 'HOME', path: '/Home' },
    { icon: IconActivity, label: 'ACCOUNT', path: '/Account' },
    { icon: IconFingerprint, label: 'USERS', path: '/Users' },
    { icon: IconActivity, label: 'REPORT', path: '/Report' },
    { icon: IconActivity, label: 'SETTING', path: '/settings' },
    { icon: IconActivity, label: 'SUPPORT', path: '/Support' },
    { icon: IconActivity, label: 'LOGOUT', path: '/login' },
  ];

  const items = data.map((item) => (
    <NavLink
      key={item.label}
      active={location.pathname === item.path}
      label={item.label}
      description={item.description}
      leftSection={<item.icon size="1rem" stroke={1.5} />}
      onClick={() => {
        if (item.path === '/login') {
          // Add your logout logic here
        }
        navigate(item.path);
      }}
      color="pink"
      variant="filled"
    />
  ));

  return (
    <Box w={200}>
      <Box 
        sx={(theme) => ({
          padding: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.gray[3]}`,
          marginBottom: theme.spacing.md
        })}
      >
        <Text 
          size="sm" 
          fw={500}
          c="dimmed"
          className="text-center"
        >
          Welcome,
        </Text>
        <Text 
          size="md" 
          fw={700} 
          c="pink"
          className="text-center"
        >
          {username}
          <br/>
          <br/>
        </Text>
      </Box>
      {items}
    </Box>
  );
};

export default Sidebar;