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
import bg from "../assets/bg4.jpg";

import { notifications } from "@mantine/notifications";

import banner from "../assets/lactive1.png";

const ActivationDetails = () => {
  const navigate = useNavigate();

  const [activationCode, setActivationCode] = useState("");

  const validateForm = () => {
    const errors = [];

    if (!activationCode.trim()) {
      errors.push("Activation Code is required");
    } else if (activationCode.length < 6) {
      errors.push("Activation Code must be at least 6 characters");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (errors.length > 0) {
      notifications.show({
        title: "Validation Error",

        message: errors.join("\n"),

        color: "red",

        autoClose: 5000,
      });

      return;
    }

    try {
      // Get system info

      const systemInfo = await window.electronAPI.getSystemInfo();

      // Prepare activation data

      const activationData = {
        activation_key: activationCode,

        serial_number: systemInfo.os,

        version: "1.0",
      };

      // Call activation API through IPC

      const result = await window.electronAPI.activateProduct(activationData);

      if (result.success) {
        notifications.show({
          title: "Success",

          message: "Activation successful!",

          color: "green",

          autoClose: 3000,
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        notifications.show({
          title: "Error",

          message: result.error,

          color: "red",

          autoClose: 5000,
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",

        message: error.message,

        color: "red",

        autoClose: 5000,
      });
    }
  };

  return (
    <div style={{ marginTop: "10%" }}>
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
                width={120}
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
    </div>
  );
};

export default ActivationDetails;
