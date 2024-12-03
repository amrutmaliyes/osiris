import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  Button,
  Paper,
  Title,
  Container,
  Image,
  Grid,
  Box,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import banner from "../assets/lactive1.png";
const ActivationForm = ({ onActivationSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    institutionName: "",
    headOfInstitution: "",
    email: "",
    mobileNo: "",
    password: "",
    rePassword: "",
    productKey: "",
  });

  const validateForm = () => {
    const errors = [];

    if (!formData.institutionName.trim()) {
      errors.push("Institution Name is required");
    }
    if (!formData.headOfInstitution.trim()) {
      errors.push("Head of Institution is required");
    }
    if (!formData.email.trim()) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("Email is invalid");
    }
    if (!formData.mobileNo.trim()) {
      errors.push("Mobile Number is required");
    }
    if (!formData.password.trim()) {
      errors.push("Password is required");
    }
    if (!formData.rePassword.trim()) {
      errors.push("Please confirm your password");
    }
    if (formData.password !== formData.rePassword) {
      errors.push("Passwords do not match");
    }
    if (!formData.productKey.trim()) {
      errors.push("Product Key is required");
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
      const systemInfo = await window.electronAPI.getSystemInfo();
      const activationData = {
        activation_key: formData.productKey,
        serial_number: systemInfo.os,
        version: "1.0",
        email: formData.email,
        password: formData.password,
        institutionName: formData.institutionName,
      };

      const result = await window.electronAPI.activateProduct(activationData);

      if (result.success && result.data.activationStatus === "Active") {
        const users = await window.electronAPI.debugUsers();
        console.log("Users after activation:", users);

        notifications.show({
          title: "Success",
          message: "Product activated successfully!",
          color: "green",
          autoClose: 3000,
        });
        
        onActivationSuccess();
        
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        notifications.show({
          title: "Error",
          message: result.error || "Activation failed. Please try again.",
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

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div style={{ padding: "20px 10px" }}>
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
        <Container size={800} sx={{ margin: 0 }}>
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
                width={120} // Adjust the width to your desired value
                height={50}
                fit="contain"
              />
            </Box>

            <Title
              order={1}
              align="center"
              mb={50}
              c="#"
              sx={{
                fontSize: "2.5rem",
                fontWeight: 600,
              }}
            >
              Activation
            </Title>

            <form onSubmit={handleSubmit}>
              <Grid gutter={30}>
                <Grid.Col span={6}>
                  <TextInput
                    placeholder="Institution Name"
                    value={formData.institutionName}
                    onChange={handleChange("institutionName")}
                    required
                    size="md"
                    styles={{
                      input: {
                        height: "50px",
                        backgroundColor: "white",
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput
                    placeholder="Head of Institution"
                    value={formData.headOfInstitution}
                    onChange={handleChange("headOfInstitution")}
                    required
                    size="md"
                    styles={{
                      input: {
                        height: "50px",
                        backgroundColor: "white",
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    required
                    type="email"
                    size="md"
                    styles={{
                      input: {
                        height: "50px",
                        backgroundColor: "white",
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput
                    placeholder="Mobile No"
                    value={formData.mobileNo}
                    onChange={handleChange("mobileNo")}
                    required
                    size="md"
                    styles={{
                      input: {
                        height: "50px",
                        backgroundColor: "white",
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput
                    placeholder="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    required
                    size="md"
                    styles={{
                      input: {
                        height: "50px",
                        backgroundColor: "white",
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <TextInput
                    placeholder="Re enter Password"
                    type="password"
                    value={formData.rePassword}
                    onChange={handleChange("rePassword")}
                    required
                    size="md"
                    styles={{
                      input: {
                        height: "50px",
                        backgroundColor: "white",
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <TextInput
                    placeholder="Product Key"
                    value={formData.productKey}
                    onChange={handleChange("productKey")}
                    required
                    size="md"
                    styles={{
                      input: {
                        height: "50px",
                        backgroundColor: "white",
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        fontSize: "1rem",
                      },
                    }}
                  />
                </Grid.Col>
              </Grid>

              <Button
                fullWidth
                size="lg"
                color="#E78728"
                mt={30}
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

export default ActivationForm;
