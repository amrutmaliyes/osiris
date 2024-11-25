import React from 'react';
import { IconSettings,IconUser, IconFileReport,IconHeadphones, IconActivity,IconHome ,IconLogout} from '@tabler/icons-react';
import { Box, NavLink, Text } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Replace with actual username from your auth system
  const username = "John"; 

  const data = [
    { icon: IconHome, label: 'HOME', path: '/Home' },
    { icon: IconActivity, label: 'ACCOUNT', path: '/Account' },
    { icon: IconUser, label: 'USERS', path: '/Users' },
    { icon: IconFileReport, label: 'REPORT', path: '/Report' },
    { icon: IconSettings, label: 'SETTING', path: '/settings' },
    { icon: IconHeadphones, label: 'SUPPORT', path: '/Support' },
    { icon: IconLogout, label: 'LOGOUT', path: '/login' },
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