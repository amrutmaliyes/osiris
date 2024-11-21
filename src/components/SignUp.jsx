import React from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Container } from '@mantine/core';

const SignUp = ({ onSwitch }) => {
  return (
    <Container size={420} my={40}>
      <Title align="center">Sign Up</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Name" placeholder="Your name" required />
        <TextInput label="Email" placeholder="you@example.com" required mt="md" />
        <PasswordInput label="Password" placeholder="Your password" required mt="md" />
        <Button fullWidth mt="xl">Sign Up</Button>
        <Button variant="subtle" fullWidth mt="md" onClick={onSwitch}>
          Already have an account? Login
        </Button>
      </Paper>
    </Container>
  );
};

export default SignUp;
