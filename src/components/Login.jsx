import React from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Container } from '@mantine/core';

const Login = ({ onSwitch }) => {
  return (
    <Container size={420} my={40}>
      <Title align="center">Login</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Email" placeholder="you@example.com" required />
        <PasswordInput label="Password" placeholder="Your password" required mt="md" />
        <Button fullWidth mt="xl">Login</Button>
        <Button variant="subtle" fullWidth mt="md" onClick={onSwitch}>
          Don’t have an account? Sign up
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
