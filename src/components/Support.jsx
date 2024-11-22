import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import {
  Text,
  Breadcrumbs,
  Anchor,
  Container,
  TextInput,
  Textarea,
  Button,
  Group,
  Box,
  Title,
} from "@mantine/core";

const Support = () => {
  // Form state
  const [formData, setFormData] = useState({
    institute: "",
    name: "",
    phone: "",
    email: "",
    complaint: "",
  });

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle form submission
  const handleSubmit = () => {
    // Add your form submission logic here
    console.log(formData);
  };

  // Breadcrumb items
  const breadcrumbItems = [{ title: "Support", href: "/" }].map(
    (item, index) => (
      <Anchor href={item.href} key={index}>
        {item.title}
      </Anchor>
    )
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ padding: "20px", flex: 1 }}>
        <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

        <Container size="lg">
          {/* Contact Form Section */}
          <Box mb={50}>
            <Title order={1} color="gray.7" mb={50}>
              CONTACT DETAILS
            </Title>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div style={{ marginBottom: "50px" }}>
                <TextInput
                  label="Institute"
                  placeholder="Enter institute name"
                  value={formData.institute}
                  onChange={(e) =>
                    handleInputChange("institute", e.target.value)
                  }
                  styles={{
                    input: { fontSize: "20px", height: "50px" },
                    label: {
                      fontSize: "25px",
                      fontWeight: 400,
                      marginBottom: "8px",
                    },
                  }}
                />
              </div>
              <div style={{ marginBottom: "50px" }}>
                <TextInput
                  label="Name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  styles={{
                    input: { fontSize: "20px", height: "50px" },
                    label: {
                      fontSize: "25px",
                      fontWeight: 400,
                      marginBottom: "8px",
                    },
                  }}
                />
              </div>

              <div style={{ marginBottom: "50px" }}>
                <TextInput
                  label="Phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  styles={{
                    input: { fontSize: "20px", height: "50px" },
                    label: {
                      fontSize: "25px",
                      fontWeight: 400,
                      marginBottom: "8px",
                    },
                  }}
                />
              </div>

              <div style={{ marginBottom: "50px" }}>
                <TextInput
                  label="Email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  styles={{
                    input: { fontSize: "20px", height: "50px" },
                    label: {
                      fontSize: "25px",
                      fontWeight: 400,
                      marginBottom: "8px",
                    },
                  }}
                />
              </div>
            </div>

            <TextInput
              label="Complaint"
              placeholder="Enter your complaint"
              mt="md"
              value={formData.complaint}
              onChange={(e) => handleInputChange("complaint", e.target.value)}
              styles={{
                input: { fontSize: "20px", height: "50px" },
                label: {
                  fontSize: "25px",
                  fontWeight: 400,
                  marginBottom: "8px",
                },
              }}
            />

            <Group position="center" mt={50}>
              <Button
                color="blue"
                size="xl" // Use a larger predefined size
                onClick={handleSubmit}
                // sx={{ minWidth: 800 }}
                styles={{
                  root: {
                    fontSize: "24px", // Text size
                    height: "60px", // Button height
                    padding: "8px 10px", // Inner padding
                    minWidth: "300px", // Custom minimum width
                  },
                }}
              >
                Submit
              </Button>
            </Group>
          </Box>

          {/* Contact Information Section */}
          {/* <Box mt={50}>
            <Title order={4} mb={20}>
              Contact US
            </Title>
            <Text size="sm" color="gray.7">
              Inon Technologies Private Limited, Office : No.750, 1st Floor,
              33rd
              <br />
              A Cross, 9th Main Rd, 4th Block, Jayanagar, Bengaluru, Karnataka
              <br />
              560011.
            </Text>
          </Box> */}
        </Container>
      </div>
    </div>
  );
};

export default Support;
