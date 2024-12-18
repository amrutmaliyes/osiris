import React, { useState, useEffect } from "react";
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
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

const Account = () => {
  // Updated form state
  const [formData, setFormData] = useState({
    organization_name: "",
    email: "",
    mobile_no: "",
    head_of_institution: "",
  });

  // Updated product key details state
  const [productDetails, setProductDetails] = useState({
    activationDate: "",
    startDate: "",
    endDate: "",
    totalDays: "",
    daysConsumed: "",
    daysLeft: "",
  });

  // Load organization details
  useEffect(() => {
    loadOrganizationDetails();
  }, []);

  const loadOrganizationDetails = async () => {
    try {
      const response = await window.electronAPI.getOrganizationDetails();
      if (response.success) {
        const { data } = response;
        setFormData({
          organization_name: data.organization_name,
          email: data.email,
          mobile_no: data.mobile_no,
          head_of_institution: data.head_of_institution,
        });
        // console.log(data,"data from acc")
       
        setProductDetails({
          activationDate: data.activation_date,
          startDate: data.start_date,
          endDate: data.end_date,
          totalDays: data.totalDays,
          daysConsumed: data.daysConsumed,
          daysLeft: data.daysLeft,
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to load organization details",
        color: "red",
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await window.electronAPI.updateOrganizationDetails({
        organization_name: formData.organization_name,
        mobile_no: formData.mobile_no,
        head_of_institution: formData.head_of_institution,
      });

      if (response.success) {
        notifications.show({
          title: "Success",
          message: "Organization details updated successfully",
          color: "green",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update organization details",
        color: "red",
      });
    }
  };

  const handleRefresh = () => {
    console.log("Refreshing product details");
  };

  // Breadcrumb items
  const breadcrumbItems = [{ title: "Account", href: "/" }].map(
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
              value={formData.organization_name}
              onChange={(e) => handleInputChange("organization_name", e.target.value)}
              styles={{
                input: { fontSize: "20px", height: "50px" },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />
            
            <Tooltip
              label="Please contact support to change your email address"
              position="top"
              withArrow
            >
              <TextInput
                label="Email"
                value={formData.email}
                readOnly
                styles={{
                  input: { 
                    fontSize: "20px", 
                    height: "50px",
                    backgroundColor: "#f1f3f5",
                    cursor: "not-allowed"
                  },
                  label: { fontSize: "20px", marginBottom: "8px" },
                }}
              />
            </Tooltip>

            <TextInput
              label="Mobile"
              value={formData.mobile_no}
              onChange={(e) => handleInputChange("mobile_no", e.target.value)}
              styles={{
                input: { fontSize: "20px", height: "50px" },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />

            <TextInput
              label="Head of Institution"
              value={formData.head_of_institution}
              onChange={(e) => handleInputChange("head_of_institution", e.target.value)}
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
              label="Activation Date"
              value={productDetails.activationDate}
              readOnly
              styles={{
                input: { fontSize: "20px", height: "50px", backgroundColor: "#f1f3f5" },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />
            <TextInput
              label="End Date"
              value={productDetails.endDate}
              readOnly
              styles={{
                input: { fontSize: "20px", height: "50px", backgroundColor: "#f1f3f5" },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />
            <TextInput
              label="Days Consumed"
              value={productDetails.daysConsumed}
              readOnly
              styles={{
                input: { fontSize: "20px", height: "50px", backgroundColor: "#f1f3f5" },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />
            <TextInput
              label="Days Left"
              value={productDetails.daysLeft}
              readOnly
              styles={{
                input: { fontSize: "20px", height: "50px", backgroundColor: "#f1f3f5" },
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
