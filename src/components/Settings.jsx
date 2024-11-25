import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import {
  Container,
  Text,
  Select,
  Button,
  Group,
  TextInput,
  Table,
  Breadcrumbs,
  Anchor,
  Divider,
} from "@mantine/core";

const Settings = () => {
  // State for content list
  const [contentList] = useState([
    {
      id: 1,
      contentPath: "C:\\Users\\amrut\\Desktop\\TestContent",
      startDate: "2024-11-20",
      displayName: "C:\\Users\\amrut\\Desktop\\TestContent",
      status: "active",
    },
  ]);

  // State for folder path and menu
  const [folderPath, setFolderPath] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(
    "C:\\Users\\amrut\\Desktop\\TestContent"
  );

  // Breadcrumb items
  const breadcrumbItems = [{ title: "Settings", href: "/" }].map(
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
          {/* Header */}
          <Text
            size="xl"
            fw={800}
            mb="m"
            styles={{ root: { fontSize: "50px" } }}
          >
            Settings
          </Text>

          {/* Content List Section */}
          <Text
            size="lg"
            weight={500}
            mb="xl"
            align="center"
            styles={{ root: { fontSize: "35px" } }}
          >
            CONTENT LIST
          </Text>
          <Table
            withBorder
            styles={{
              th: {
                fontSize: "20px",
                padding: "15px",
                backgroundColor: "#f8f9fa",
              },
              td: {
                fontSize: "18px",
                padding: "15px",
              },
            }}
          >
            <thead>
              <tr>
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
                  Content Path
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    fontSize: "18px",
                  }}
                >
                  Start Date
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    fontSize: "18px",
                  }}
                >
                  Content Display Name
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    fontSize: "18px",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {contentList.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: "10px", fontSize: "18px" }}>
                    {item.id}
                  </td>
                  <td style={{ padding: "10px", fontSize: "18px" }}>
                    {item.contentPath}
                  </td>
                  <td style={{ padding: "10px", fontSize: "18px" }}>
                    {item.startDate}
                  </td>
                  <td style={{ padding: "10px", fontSize: "18px" }}>
                    {item.displayName}
                  </td>
                  <td style={{ padding: "10px", fontSize: "18px" }}>
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Divider my="xl" />

          {/* Upload Content Folder Section */}
          <Text
            size="lg"
            weight={400}
            mb="xl"
            align="center"
            styles={{ root: { fontSize: "35px" } }}
          >
            UPLOAD CONTENT FOLDER
          </Text>
          {/* <Text size={24} weight={500} mb="xl" align="center">
            UPLOAD CONTENT FOLDER
          </Text> */}

          <Text size="lg" mb="md">
            Location:
          </Text>
          <Group align="flex-end" spacing="md" mb={50}>
            <TextInput
              placeholder="Choose the Folder path"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              style={{ flex: 1 }}
              styles={{
                input: {
                  fontSize: "18px",
                  height: "45px",
                },
              }}
            />
            <Button
              color="orange"
              size="lg"
              styles={{
                root: {
                  fontSize: "18px",
                  padding: "0 30px",
                },
              }}
            >
              Upload
            </Button>
          </Group>

          <Divider my="xl" />

          {/* Change Content Section */}
          {/* <Text size={20} weight={500} mb="xl" align="center">
            CHANGE CONTENT
          </Text> */}
          <Text
            size="lg"
            weight={400}
            mb="xl"
            align="center"
            styles={{ root: { fontSize: "35px" } }}
          >
            Select Menu
          </Text>
          {/* <Text size="lg" mb="md">
            Select Menu
          </Text> */}
          <Group align="flex-end" spacing="md">
            <Select
              data={[
                {
                  value: "C:\\Users\\amrut\\Desktop\\TestContent",
                  label: "C:\\Users\\amrut\\Desktop\\TestContent",
                },
              ]}
              value={selectedMenu}
              onChange={setSelectedMenu}
              style={{ flex: 1 }}
              styles={{
                input: {
                  fontSize: "18px",
                  height: "45px",
                },
              }}
            />
            <Button
              color="orange"
              size="lg"
              styles={{
                root: {
                  fontSize: "18px",
                  padding: "0 30px",
                },
              }}
            >
              Active
            </Button>
            <Button
              color="gray"
              size="lg"
              styles={{
                root: {
                  fontSize: "18px",
                  padding: "0 30px",
                },
              }}
            >
              Delete
            </Button>
          </Group>
        </Container>
      </div>
    </div>
  );
};

export default Settings;
