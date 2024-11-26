import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Breadcrumbs,
  Anchor,
  Container,
  TextInput,
  PasswordInput,
  Select,
  Divider,
  Table,
  ActionIcon,
} from "@mantine/core";

const Users = () => {
  // Breadcrumb items
  const breadcrumbItems = [{ title: "Users", href: "/" }].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
    mobile: "",
    role: "",
    department: "",
  });

  // Users list state
  const [users, setUsers] = useState([]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle form submission
  const handleSubmit = () => {
    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.mobile ||
      !formData.role ||
      !formData.department
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.rePassword) {
      alert("Passwords do not match");
      return;
    }

    // Add new user to the list
    setUsers([
      ...users,
      {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        role: formData.role,
        department: formData.department,
      },
    ]);

    // Clear form
    setFormData({
      name: "",
      email: "",
      password: "",
      rePassword: "",
      mobile: "",
      role: "",
      department: "",
    });
  };

  // Handle form cancel
  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      rePassword: "",
      mobile: "",
      role: "",
      department: "",
    });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ padding: "20px", flex: 1 }}>
        <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

        <Container size="lg">
          {/* Form Section */}

          <Text
            size="xl"
            fw={800}
            mb="m"
            styles={{ root: { fontSize: "50px" } }}
          >
            User
          </Text>
          <Text size="lg" mb="xl" styles={{ root: { fontSize: "35px" } }}>
            Organisation Details
          </Text>
          <Divider my="sm" />
          <Text
            size="lg"
            weight={500}
            mb="xl"
            align="center"
            styles={{ root: { fontSize: "35px" } }}
          >
            USER DETAILS
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <TextInput
              label="Name"
              placeholder="Enter name"
              required
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
            <TextInput
              label="Email"
              placeholder="Enter email"
              required
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
            <PasswordInput
              label="Password"
              placeholder="Enter password"
              required
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              styles={{
                input: { fontSize: "20px", height: "50px" },
                label: {
                  fontSize: "25px",
                  fontWeight: 400,
                  marginBottom: "8px",
                },
              }}
            />
            <PasswordInput
              label="Re-Password"
              placeholder="Confirm password"
              required
              value={formData.rePassword}
              onChange={(e) => handleInputChange("rePassword", e.target.value)}
              styles={{
                input: { fontSize: "20px", height: "50px" },
                label: {
                  fontSize: "25px",
                  fontWeight: 400,
                  marginBottom: "8px",
                },
              }}
            />
            <TextInput
              label="Mobile"
              placeholder="Enter mobile number"
              required
              value={formData.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              styles={{
                input: { fontSize: "20px", height: "50px" },
                label: {
                  fontSize: "25px",
                  fontWeight: 400,
                  marginBottom: "8px",
                },
              }}
            />
            <Select
              label="Role"
              placeholder="Select role"
              data={[
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
                { value: "teacher", label: "Teacher" },
              ]}
              required
              value={formData.role}
              onChange={(value) => handleInputChange("role", value)}
              styles={{
                input: { fontSize: "20px", height: "50px" },
                label: {
                  fontSize: "25px",
                  fontWeight: 400,
                  marginBottom: "8px",
                },
              }}
            />
            <TextInput
              label="Department/Subject"
              placeholder="Enter department or subject"
              required
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
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

          <Group position="right" mt="xl" spacing="md">
            <Button variant="default" onClick={handleCancel}>
              Cancel
            </Button>
            <Button color="yellow" onClick={handleSubmit}>
              Submit
            </Button>
          </Group>

          {/* Users Table Section */}
          {users.length > 0 && (
            <>
              <Divider my="xl" />
              <div>
                <Text
                  size="lg"
                  weight={500}
                  mb="xl"
                  align="center"
                  styles={{ root: { fontSize: "35px" } }}
                >
                  Users
                </Text>
              </div>
              <Divider my="xl" />
              <Table withBorder>
                <thead>
                  <tr style={{ borderBottom: "2px solid #ccc" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        fontSize: "18px",
                      }}
                    >
                      #
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        fontSize: "18px",
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        fontSize: "18px",
                      }}
                    >
                      Email
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        fontSize: "18px",
                      }}
                    >
                      Mobile
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        fontSize: "18px",
                      }}
                    >
                      Role
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        fontSize: "18px",
                      }}
                    >
                      Department
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        fontSize: "18px",
                      }}
                    >
                      Action
                    </th>
                    {/* <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Action</th> */}
                  </tr>
                </thead>
                {/* <Divider my="xl" /> */}
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      {/* <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>{user.role}</td>
                      <td>{user.department}</td> */}
                      <td style={{ padding: "10px", fontSize: "18px" }}>
                        {user.id}
                      </td>
                      <td style={{ padding: "10px", fontSize: "18px" }}>
                        {user.name}
                      </td>
                      <td style={{ padding: "10px", fontSize: "18px" }}>
                        {user.email}
                      </td>
                      <td style={{ padding: "10px", fontSize: "18px" }}>
                        {user.mobile}
                      </td>
                      <td style={{ padding: "10px", fontSize: "18px" }}>
                        {user.role}
                      </td>
                      <td style={{ padding: "10px", fontSize: "18px" }}>
                        {user.department}
                      </td>

                      <td>
                        <Group spacing={4}>
                          <ActionIcon color="yellow" variant="filled">
                            E
                          </ActionIcon>
                          <ActionIcon color="red" variant="filled">
                            D
                          </ActionIcon>
                        </Group>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {/* Powered By Section */}
          <Text align="center" mt={40} color="dimmed" size="sm">
            Powered By Inon
          </Text>
        </Container>
      </div>
    </div>
  );
};

export default Users;
