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
  Image,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";

const Report = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    name: "",
    startDate: null,
    endDate: null,
  });

  // State for total hours
  const [totalHours, setTotalHours] = useState("");

  // State for table data
  const [tableData, setTableData] = useState([]);

  // Breadcrumb items
  const breadcrumbItems = [{ title: "Report", href: "/" }].map(
    (item, index) => (
      <Anchor href={item.href} key={index}>
        {item.title}
      </Anchor>
    )
  );

  const handleGetReport = () => {
    // Add your report generation logic here
    console.log("Generating report with:", formData);
  };

  const handleExport = () => {
    console.log("Exporting data");
  };

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
            Reports
          </Text>

          {/* Report Form */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <Select
              label="Name"
              placeholder="Select name"
              data={[
                { value: "teacher", label: "Teacher" },
                { value: "student", label: "Student" },
              ]}
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              styles={{
                input: { fontSize: "20px", height: "50px" },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />
            <DateInput
              label="Start Date"
              placeholder="dd-mm-yyyy"
              value={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              styles={{
                input: { fontSize: "20px", height: "50px" },
                label: { fontSize: "20px", marginBottom: "8px" },
              }}
            />
            <DateInput
              label="End Date"
              placeholder="dd-mm-yyyy"
              value={formData.endDate}
              onChange={(date) => setFormData({ ...formData, endDate: date })}
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
              onClick={handleGetReport}
              styles={{
                root: {
                  fontSize: "18px",
                  padding: "12px 50px",
                },
              }}
            >
              Get Report
            </Button>
          </Group>

          {/* Total Hours Section */}
          <Text size="md" mb="md" styles={{ root: { fontSize: "25px" } }}>
            Total Number of Hours
          </Text>
          <TextInput
            value={totalHours}
            onChange={(e) => setTotalHours(e.target.value)}
            readOnly
            styles={{
              input: {
                fontSize: "20px",
                height: "50px",
                // backgroundColor: "#f1f3f5",
              },
            }}
          />

          <Divider my="xl" />

          {/* Data Table Section */}
          <Text
            size="lg"
            weight={500}
            mb="xl"
            align="center"
            styles={{ root: { fontSize: "35px" } }}
          >
            DATA TABLE
          </Text>
          <Divider my="xl" />
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
              <tr
                style={{
                  borderBottom: "2px solid #ccc",
                }}
              >
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
                  Content
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    fontSize: "18px",
                  }}
                >
                  Start Time
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    fontSize: "18px",
                  }}
                >
                  End Time
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    fontSize: "18px",
                  }}
                >
                  Duration (in min)
                </th>
              </tr>
            </thead>
            {/* <Divider my="xl" /> */}
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td style={{ padding: "10px", fontSize: "18px" }}>
                    {row.id}
                  </td>
                  <td style={{ padding: "10px", fontSize: "18px" }}>
                    {row.content}
                  </td>
                  <td style={{ padding: "10px", fontSize: "18px" }}>
                    {row.startTime}
                  </td>
                  <td style={{ padding: "10px", fontSize: "18px" }}>
                    {row.endTime}
                  </td>
                  <td style={{ padding: "10px", fontSize: "18px" }}>
                    {row.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Export Button */}
          <Group position="center" mt={30} mb={50}>
            <Button
              color="yellow"
              size="xl"
              onClick={handleExport}
              styles={{
                root: {
                  fontSize: "18px",
                  padding: "12px 50px",
                },
              }}
            >
              Export
            </Button>
          </Group>

          {/* Powered By Section */}
          {/* <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Text size="sm" color="dimmed" mb={10}>
              Powered By Inon
            </Text>
            <Image
              src="/path/to/inon-logo.png" // Replace with your actual logo path
              alt="Inon Logo"
              width={100}
              mx="auto"
            />
          </div> */}
        </Container>
      </div>
    </div>
  );
};

export default Report;
