import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  Button,
  Title,
  Container,
  Image,
  Box,
  Paper,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import banner from "../assets/banner.png"
const ActivationDetails = () => {
  const navigate = useNavigate();
  const [activationCode, setActivationCode] = useState("");

  const validateForm = () => {
    const errors = [];

    if (!activationCode.trim()) {
      errors.push("Activation Code is required");
    } else if (activationCode.length < 6) {
      // You can adjust the minimum length as needed
      errors.push("Activation Code must be at least 6 characters");
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (errors.length > 0) {
      // Show error notification
      notifications.show({
        title: "Validation Error",
        message: errors.join("\n"),
        color: "red",
        autoClose: 5000,
      });
      return;
    }

    // If validation passes, show success notification and navigate
    notifications.show({
      title: "Success",
      message: "Activation successful!",
      color: "green",
      autoClose: 3000,
    });

    // Navigate to login after a short delay
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        backgroundImage: 'url("../assets/mountains.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <Image
              src={banner}
              alt="FutureClass Logo"
              width={120}   // Adjust the width to your desired value
              height={50}
              fit="contain"
            />
          </Box>

          <Title
            order={1}
            align="center"
            mb={50}
            c="black"
            sx={{
              fontSize: "2.5rem",
              fontWeight: 600,
            }}
          >
            Activation Details
          </Title>

          <form onSubmit={handleSubmit}>
            <TextInput
              placeholder="Activation Code"
              size="lg"
              mb={30}
              required
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              styles={{
                input: {
                  height: "55px",
                  backgroundColor: "white",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  fontSize: "1.1rem",
                },
              }}
            />

            <Button
              fullWidth
              size="lg"
              color="#E78728"
              mb={15}
              type="submit"
              sx={{
                height: "50px",
                fontSize: "1.1rem",
              }}
            >
              Activate
            </Button>

            <Button
              variant="subtle"
              fullWidth
              onClick={() => navigate("/")}
              color="gray"
            >
              Back
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ActivationDetails;
