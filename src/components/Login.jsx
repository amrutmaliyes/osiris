import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import banner from "../assets/lactive1.png";
import bg from "../assets/bg4.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userCredentials, setUserCredentials] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCredentials = async () => {
      try {
        const credentials = await window.electronAPI.getUserCredentials();
        if (credentials) {
          setUserCredentials(credentials);
        }
      } catch (error) {
        console.error("Error fetching credentials:", error);
      }
    };

    getCredentials();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (userCredentials && email === userCredentials.username && password === userCredentials.password) {
      // Admin login successful
      localStorage.setItem("userType", "admin");
      localStorage.setItem("userEmail", email);
      
      notifications.show({
        title: "Success",
        message: "Login successful!",
        color: "green",
        autoClose: 2000,
      });

      navigate("/home");
    } else {
      setError("Invalid email or password");
      notifications.show({
        title: "Error",
        message: "Invalid email or password",
        color: "red",
        autoClose: 3000,
      });
    }
  };

  return (
    <div style={{ marginTop: "10%" }}>
      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={bg}
          alt="Background"
          style={{
            position: "absolute",
            top: 0,
            left: "-10px",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        />

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
            <Box style={{ marginLeft: "160px" }}>
              <Image
                src={banner}
                alt="FutureClass Logo"
                h={50}
                w="auto"
                fit="contain"
              />
            </Box>

            <Title
              order={4}
              align="center"
              mb={50}
              c="#"
              sx={{
                fontSize: "25px",
                fontWeight: 600,
              }}
            >
              Login
            </Title>

            <form onSubmit={handleLogin}>
              <TextInput
                placeholder="Email"
                size="md"
                mb={20}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                styles={{
                  input: {
                    backgroundColor: "white",
                    border: "1px solid #eee",
                    borderRadius: "8px",
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                styles={{
                  input: {
                    backgroundColor: "white",
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    height: "50px",
                    fontSize: "1rem",
                  },
                }}
              />

              {error && (
                <Text align="center" color="red" mb={15}>
                  {error}
                </Text>
              )}

              <Button
                fullWidth
                size="lg"
                color="#E78728"
                type="submit"
                sx={{
                  height: "50px",
                  fontSize: "1.1rem",
                }}
              >
                Login
              </Button>

              <Text
                align="center"
                mt={15}
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
    </div>
  );
};

export default Login;
