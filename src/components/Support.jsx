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
  // notifications,
} from "@mantine/core";
import { Notifications, notifications } from '@mantine/notifications';


const Support = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    institute: "",
    name: "",
    phone: "",
    email: "",
    complaint: "",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      console.log('Starting form submission...', formData);
      setLoading(true);
      
      if (!formData.institute || !formData.name || !formData.phone || !formData.email || !formData.complaint) {
        console.log('Validation failed - missing fields');
        notifications.show({
          title: 'Error',
          message: 'Please fill in all fields',
          color: 'red',
        });
        return;
      }

      console.log('Calling submitSupport API with data:', formData);
      
      const result = await window.electronAPI.submitSupport(formData);
      console.log('API response:', result);

      if (result.success) {
        console.log('Submission successful');
        notifications.show({
          title: 'Success',
          message: 'Support request submitted successfully',
          color: 'green',
        });
        
        setFormData({
          institute: "",
          name: "",
          phone: "",
          email: "",
          complaint: "",
        });
      } else {
        console.log('Submission failed:', result.error);
        throw new Error(result.error || 'Failed to submit support request');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    } finally {
      setLoading(false);
      console.log('Form submission process completed');
    }
  };

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
                color="#E78728"
                size="xl"
                onClick={handleSubmit}
                loading={loading}
                styles={{
                  root: {
                    fontSize: "24px",
                    height: "60px",
                    padding: "8px 10px",
                    minWidth: "300px",
                  },
                }}
              >
                {loading ? 'Submitting...' : 'Submit'}
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
