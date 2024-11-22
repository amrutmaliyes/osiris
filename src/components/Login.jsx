import React from "react";
import {
  TextInput,
  Button,
  Paper,
  Title,
  Container,
  Image,
  Box,
  Text,
} from "@mantine/core";

const Login = ({ onSwitch }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",

        backgroundImage: "url('../assets/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container size={600} sx={{ margin: 0 }}>
        <Paper
          radius="md"
          p={50}
          withBorder
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Logo */}
          <Image
            src="../assets/banner.png"
            alt="FutureClass Logo"
            width={150}
            mx="auto"
            mb={40}
          />

          {/* Title */}
          <Title
            order={1}
            align="center"
            mb={50}
            c="pink"
            sx={{
              fontSize: "2.5rem",
              fontWeight: 600,
            }}
          >
            Login
          </Title>
          {/* Form */}
          <form>
            <TextInput
              placeholder="Email"
              size="md"
              mb={20}
              styles={{
                input: {
                  height: "50px",
                  fontSize: "1rem",
                },
              }}
            />

            <TextInput
              placeholder="Password"
              type="password"
              size="md"
              mb={30}
              styles={{
                input: {
                  height: "50px",
                  fontSize: "1rem",
                },
              }}
            />

            <Button
              fullWidth
              size="lg"
              color="pink"
              mb={15}
              sx={{
                height: "50px",
                fontSize: "1.1rem",
              }}
            >
              Login
            </Button>

            <Text
              align="center"
              color="gray"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot Password
            </Text>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
