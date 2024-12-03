import React, { useState, useEffect } from "react";
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
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

const Users = () => {
  // Breadcrumb items
  const breadcrumbItems = [{ title: "Users", href: "/" }].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  // Form state
  const [formData, setFormData] = useState({
    id: null,
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

  // Editing state
  const [isEditing, setIsEditing] = useState(false);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      !formData.role ||
      !formData.department
    ) {
      notifications.show({
        title: 'Error',
        message: 'Please fill in all required fields',
        color: 'red',
      });
      return;
    }

    if (!isEditing && formData.password !== formData.rePassword) {
      notifications.show({
        title: 'Error',
        message: 'Passwords do not match',
        color: 'red',
      });
      return;
    }

    try {
      if (isEditing) {
        // Only include password in update if it has been changed
        const updateData = {
          id: formData.id,
          username: formData.email,
          name: formData.name,
          mobile: formData.mobile,
          role: formData.role,
          department: formData.department,
        };

        // Only include password if it has been changed
        if (formData.password && formData.password !== '') {
          updateData.password = formData.password;
        }

        const result = await window.electronAPI.updateUser(updateData);
        
        if (result.success) {
          // Update users list
          setUsers(users.map(user => 
            user.id === formData.id 
              ? { ...user, 
                  username: formData.email,
                  name: formData.name,
                  mobile: formData.mobile,
                  role: formData.role,
                  department: formData.department,
                } 
              : user
          ));

          notifications.show({
            title: 'Success',
            message: 'User updated successfully',
            color: 'green',
          });
        }
      } else {
        // Add new user
        const result = await window.electronAPI.addUser({
          username: formData.email,
          password: formData.password,
          name: formData.name,
          mobile: formData.mobile,
          role: formData.role,
          department: formData.department,
        });

        if (result.success) {
          setUsers([
            ...users,
            {
              id: result.id,
              username: formData.email,
              name: formData.name,
              mobile: formData.mobile,
              role: formData.role,
              department: formData.department,
            },
          ]);
        }
      }

      // Clear form
      handleCancel();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    }
  };

  // Handle form cancel
  const handleCancel = () => {
    setFormData({
      id: null,
      name: "",
      email: "",
      password: "",
      rePassword: "",
      mobile: "",
      role: "",
      department: "",
    });
    setIsEditing(false);
  };

  // Load existing users when component mounts
  useEffect(() => {
    const loadUsers = async () => {
      const dbUsers = await window.electronAPI.getUsers();
      setUsers(dbUsers);
    };
    loadUsers();
  }, []);

  const handleEdit = async (user) => {
    try {
      console.log("Editing user:", user); // For debugging
      
      // Get the user's full details including password
      const userDetails = await window.electronAPI.getUserDetails(user.id);
      console.log("User details:", userDetails); // For debugging
      
      setFormData({
        id: user.id,
        name: user.name,
        email: user.username,
        password: userDetails.password, // Include the password
        rePassword: userDetails.password, // Set rePassword to match
        mobile: user.mobile,
        role: user.role,
        department: user.department,
      });
      setIsEditing(true);
    } catch (error) {
      console.error("Edit error:", error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load user details',
        color: 'red',
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (userId) => {
    try {
      const result = await window.electronAPI.deleteUser(userId);
      console.log("Delete result:", result); // For debugging
      
      if (result.success) {
        // Remove user from the local state
        setUsers(users.filter(user => user.id !== userId));
        
        notifications.show({
          title: 'Success',
          message: 'User deleted successfully',
          color: 'green',
          autoClose: 2000,
        });
      } else {
        throw new Error(result.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error("Delete error:", error);
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
        autoClose: 3000,
      });
    }
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
              required={!isEditing}
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
              label="Confirm Password"
              placeholder="Re-enter password"
              required={!isEditing}
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
                          <ActionIcon 
                            color="blue" 
                            variant="filled"
                            onClick={() => handleEdit(user)}
                          >
                            <IconEdit size={18} />
                          </ActionIcon>
                          <ActionIcon 
                            color="red" 
                            variant="filled"
                            onClick={() => handleDelete(user.id)}
                          >
                            <IconTrash size={18} />
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
