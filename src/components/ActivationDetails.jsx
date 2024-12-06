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
  LoadingOverlay,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import banner from "../assets/lactive1.png";
import bg from "../assets/bg4.jpg";

const ActivationDetails = () => {
  const navigate = useNavigate();
  const [activationCode, setActivationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    try {
      const systemInfo = await window.electronAPI.getSystemInfo();
      
      const result = await window.electronAPI.reactivateProduct({
        activation_key: activationCode,
        serial_number: systemInfo.os,
        version: "1.0"
      });

      if (result.success) {
        notifications.show({
          title: "Success",
          message: "Reactivation successful!",
          color: "green",
          autoClose: 3000,
        });
        
        await window.electronAPI.checkActivation();
        
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      } else {
        throw new Error(result.error?.message || "Reactivation failed");
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
        autoClose: 5000,
      });
      setIsSubmitting(false);
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
              position: "relative",
            }}
          >
            <LoadingOverlay 
              visible={isSubmitting} 
              overlayProps={{ 
                backgroundOpacity: 0.5,  
                color: "#fff"  
              }}
              loaderProps={{ 
                size: 'xl', 
                color: '#E78728' 
              }}
              overlayBlur={2}
            />

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
              {isSubmitting ? "Processing..." : "Activation Details"}
            </Title>

            <form onSubmit={handleSubmit}>
              <TextInput
                placeholder="Activation Code"
                size="lg"
                mb={30}
                required
                disabled={isSubmitting}
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
                loading={isSubmitting}
                disabled={isSubmitting}
                sx={{
                  height: "50px",

                  fontSize: "1.1rem",
                }}
              >
                {isSubmitting ? "Activating..." : "Activate"}
              </Button>

              <Button
                variant="subtle"
                fullWidth
                onClick={() => navigate("/")}
                color="gray"
                disabled={isSubmitting}
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
