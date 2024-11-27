import React, { useState } from "react";
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
import banner from "../assets/lactive1.png"; // Import the image
import bg from "../assets/bg4.jpg"; // Import the image

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "1234") {
      localStorage.setItem("userType", "admin");
      navigate("/Home");
    } else if (email === "teacher@gmail.com" && password === "1234") {
      localStorage.setItem("userType", "teacher");
      navigate("/Home");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{ marginTop: "10%" }}>
      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden", // Ensures content doesn't overflow the box
        }}
      >
        {/* Background Image */}
        <img
          src={bg}
          alt="Background"
          style={{
            position: "absolute",
            top: 0,
            left: "-10px", // Shift the image 10px to the left

            // width: "auto",
            width: "100%",
            height: "100%",
            // height: "auto",
            objectFit: "cover", // Ensures the image covers the container
            zIndex: -1, // Places the image behind other content
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
            {/* Logo */}
            <Box style={{ marginLeft: "160px" }}>
              {" "}
              {/* Changed from marginLeft: "180px" */}
              <Image
                src={banner}
                alt="FutureClass Logo"
                h={50}
                w="auto"
                fit="contain"
              />
            </Box>

            {/* Title */}
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

            {/* Form */}
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
