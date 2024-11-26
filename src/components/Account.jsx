import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import {
  Container,
  Text,
  TextInput,
  Button,
  Group,
  FileInput,
  Divider,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";

const Account = () => {
  // Form state
  const [formData, setFormData] = useState({
    schoolName: "Test",
    email: "admin@gmail.com",
    mobile: "1234567890",
    image: null,
  });

  // Product key details
  const [productDetails] = useState({
    startDate: "16/11/2024",
    endDate: "16/02/2025",
    daysConsumed: "0",
    daysLeft: "93",
  });

  // Breadcrumb items
  const breadcrumbItems = [{ title: "Account", href: "/" }].map(
    (item, index) => (
      <Anchor href={item.href} key={index}>
        {item.title}
      </Anchor>
    )
  );

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };

  const handleRefresh = () => {
    console.log("Refreshing product details");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ padding: "20px", flex: 1 }}>
        <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

        <Container size="lg">
          {/* Header Section */}
          <Text
            size="xl"
            fw={800}
            mb="m"
            // color="white"
            styles={{ root: { fontSize: "50px" } }}
          >
            Accounts
          </Text>
          <Text size="lg" mb="xl" styles={{ root: { fontSize: "35px" } }}>
            Organisation Details
          </Text>

          {/* School Details Section */}
          <Divider my="sm" />
          <Text
            size="lg"
            weight={500}
            mb="xl"
            align="center"
            styles={{ root: { fontSize: "35px" } }}
          >
            SCHOOL DETAILS
          </Text>
          {/* <Text size={28} weight={500} mb="xl" align="center" color="blue">
            SCHOOL DETAILS
          </Text> */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
              marginBottom: "40px",
            }}
          >
            <TextInput
              label="School Name"
              value={formData.schoolName}
              onChange={(e) => handleInputChange("schoolName", e.target.value)}
              styles={{
                input: { fontSize: "20px", height: "50px" },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />
            <TextInput
              label="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              styles={{
                input: { fontSize: "20px", height: "50px" },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />
            <TextInput
              label="Mobile"
              value={formData.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              styles={{
                input: { fontSize: "20px", height: "50px" },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />
            <FileInput
              label="Image"
              placeholder="Choose Image"
              onChange={(file) => handleInputChange("image", file)}
              styles={{
                input: { fontSize: "20px", height: "50px" },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />
          </div>

          <Group position="center" mb={50}>
            <Button
              color="yellow"
              size="xl"
              onClick={handleSubmit}
              styles={{
                root: {
                  fontSize: "18px",
                  padding: "12px 50px",
                },
              }}
            >
              Submit
            </Button>
          </Group>

          {/* <Divider my="xl" /> */}
          <Divider my="sm" />

          {/* Product Key Details Section */}
          <Text
            size="lg"
            weight={500}
            mb="xl"
            align="center"
            styles={{ root: { fontSize: "35px" } }}
          >
            PRODUCT KEY DETAILS
          </Text>
          {/* <Text size={28} weight={500} mb="xl" align="center" color="blue">
            PRODUCT KEY DETAILS
          </Text> */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
              marginBottom: "40px",
            }}
          >
            <TextInput
              label="Start Date"
              value={productDetails.startDate}
              readOnly
              styles={{
                input: {
                  fontSize: "20px",
                  height: "50px",
                  backgroundColor: "#f1f3f5",
                },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />
            <TextInput
              label="End Date"
              value={productDetails.endDate}
              readOnly
              styles={{
                input: {
                  fontSize: "20px",
                  height: "50px",
                  backgroundColor: "#f1f3f5",
                },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />
            <TextInput
              label="Days Consumed"
              value={productDetails.daysConsumed}
              readOnly
              styles={{
                input: {
                  fontSize: "20px",
                  height: "50px",
                  backgroundColor: "#f1f3f5",
                },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />
            <TextInput
              label="Days Left"
              value={productDetails.daysLeft}
              readOnly
              styles={{
                input: {
                  fontSize: "20px",
                  height: "50px",
                  backgroundColor: "#f1f3f5",
                },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />
          </div>

          <Group position="center">
            <Button
              color="yellow"
              size="xl"
              onClick={handleRefresh}
              styles={{
                root: {
                  fontSize: "18px",
                  padding: "12px 50px",
                },
              }}
            >
              Refresh
            </Button>
          </Group>
        </Container>
      </div>
    </div>
  );
};

export default Account;
