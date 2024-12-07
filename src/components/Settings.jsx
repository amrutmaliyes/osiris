import React, { useState, useEffect } from "react";
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
import { notifications } from '@mantine/notifications';

const Settings = () => {
  // State for content list
  const [contentList, setContentList] = useState([]);

  // State for folder path and menu
  const [folderPath, setFolderPath] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("");

  // Load content paths on component mount
  useEffect(() => {
    loadContentPaths();
  }, []);

  const loadContentPaths = async () => {
    const paths = await window.electronAPI.getContentPaths();
    setContentList(paths.map(path => ({
      id: path.id,
      contentPath: path.path,
      startDate: new Date(path.created_at).toISOString().split('T')[0],
      displayName: path.path,
      status: path.is_active ? 'active' : 'inactive'
    })));
  };

  const handleUpload = async () => {
    if (!folderPath) {
      notifications.show({
        title: "Error",
        message: "Please select a folder path first",
        color: "red",
        autoClose: 3000,
      });
      return;
    }
    
    try {
      // First add the content path
      const pathResult = await window.electronAPI.addContentPath(folderPath);
      if (!pathResult.success) {
        notifications.show({
          title: "Error",
          message: "Failed to add content path",
          color: "red",
          autoClose: 3000,
        });
        return;
      }

      // Scan and add all content items
      await scanAndAddContent(folderPath, pathResult.id);
      
      notifications.show({
        title: "Success",
        message: "Content folder uploaded successfully!",
        color: "green",
        autoClose: 3000,
      });
      
      setFolderPath("");
      loadContentPaths();
    } catch (error) {
      console.error('Error uploading content:', error);
      notifications.show({
        title: "Error",
        message: error.message || "Failed to upload content",
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const scanAndAddContent = async (basePath, folderId) => {
    try {
      // Read all class directories
      const classes = await window.electronAPI.readDirectory(basePath);
      
      for (const classDir of classes) {
        if (!classDir.toLowerCase().startsWith('class')) continue;
        
        const classPath = `${basePath}/${classDir}`;
        const subjects = await window.electronAPI.readDirectory(classPath);
        
        for (const subject of subjects) {
          const subjectPath = `${classPath}/${subject}`;
          const chapters = await window.electronAPI.readDirectory(subjectPath);
          
          for (const chapter of chapters) {
            const chapterPath = `${subjectPath}/${chapter}`;
            const files = await window.electronAPI.readDirectory(chapterPath);
            
            // Add each file as a content item
            for (const file of files) {
              await window.electronAPI.addContentItem({
                folderId,
                title: file,
                description: `${classDir} - ${subject} - ${chapter}`
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error scanning content:', error);
    }
  };

  const handleActivate = async () => {
    const selectedContent = contentList.find(item => item.contentPath === selectedMenu);
    if (!selectedContent) {
      notifications.show({
        title: "Error",
        message: "Please select a content path first",
        color: "red",
        autoClose: 3000,
      });
      return;
    }

    try {
      const result = await window.electronAPI.setActiveContent(selectedContent.id);
      if (result.success) {
        notifications.show({
          title: "Success",
          message: "Content activated successfully!",
          color: "green",
          autoClose: 3000,
        });
        loadContentPaths();
      } else {
        throw new Error("Failed to activate content");
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to activate content",
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    const selectedContent = contentList.find(item => item.contentPath === selectedMenu);
    if (!selectedContent) {
      notifications.show({
        title: "Error",
        message: "Please select a content path first",
        color: "red",
        autoClose: 3000,
      });
      return;
    }

    // Add confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this content? This will remove all related progress data and cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      const result = await window.electronAPI.deleteContentPath(selectedContent.id);
      
      if (result.success) {
        notifications.show({
          title: "Success",
          message: "Content and related data deleted successfully!",
          color: "green",
          autoClose: 3000,
        });
        setSelectedMenu("");
        loadContentPaths();
      } else {
        throw new Error(result.error || "Failed to delete content");
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to delete content",
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleBrowse = async () => {
    try {
      const selectedPath = await window.electronAPI.selectFolder();
      if (selectedPath) {
        setFolderPath(selectedPath);
        notifications.show({
          title: "Success",
          message: "Folder selected successfully!",
          color: "green",
          autoClose: 2000,
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to select folder",
        color: "red",
        autoClose: 3000,
      });
    }
  };

  // Update the Select component data
  const menuOptions = contentList.map(item => ({
    value: item.contentPath,
    label: item.contentPath
  }));

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

          <Text size="lg" mb="md">
            Location:
          </Text>
          <Group align="flex-end" spacing="md" mb={50}>
            <TextInput
              placeholder="Choose the Folder path"
              value={folderPath}
              readOnly
              style={{ flex: 1 }}
              styles={{
                input: {
                  fontSize: "18px",
                  height: "45px",
                  cursor: "default",
                },
              }}
            />
            <Button
              color="gray"
              size="lg"
              onClick={handleBrowse}
              styles={{
                root: {
                  fontSize: "18px",
                  padding: "0 30px",
                },
              }}
            >
              Browse
            </Button>
            <Button
              color="orange"
              size="lg"
              onClick={handleUpload}
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
          <Text
            size="lg"
            weight={400}
            mb="xl"
            align="center"
            styles={{ root: { fontSize: "35px" } }}
          >
            Select Menu
          </Text>
          <Group align="flex-end" spacing="md">
            <Select
              data={menuOptions}
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
              onClick={handleActivate}
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
              onClick={handleDelete}
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
