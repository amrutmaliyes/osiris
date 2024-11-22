import React from "react";
import Sidebar from "./Sidebar.jsx";
import { Card, Image, Text, Badge, Button, Group, Breadcrumbs, Anchor, Container } from "@mantine/core";

const Support = () => {
  // Breadcrumb items
  const breadcrumbItems = [
    { title: "Support", href: "/" },
    { title: "Dashboard", href: "/dashboard" },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Welcome Content */}
      <div style={{ marginLeft: "240px", padding: "20px", flex: 1 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

      

        {/* Cards Section */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image src="https://via.placeholder.com/150" height={160} alt="Card 1" />
            </Card.Section>
            <Group position="apart" mt="md" mb="xs">
              <Text weight={500}>Feature 1</Text>
              <Badge color="pink" variant="light">
                New
              </Badge>
            </Group>
            <Text size="sm" color="dimmed">
              Learn more about Feature 1 and explore its capabilities.
            </Text>
            <Button variant="light" color="pink" fullWidth mt="md" radius="md">
              Explore Feature 1
            </Button>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image src="https://via.placeholder.com/150" height={160} alt="Card 2" />
            </Card.Section>
            <Group position="apart" mt="md" mb="xs">
              <Text weight={500}>Feature 2</Text>
              <Badge color="green" variant="light">
                Updated
              </Badge>
            </Group>
            <Text size="sm" color="dimmed">
              Discover the updated features and how they can help you.
            </Text>
            <Button variant="light" color="green" fullWidth mt="md" radius="md">
              Explore Feature 2
            </Button>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image src="https://via.placeholder.com/150" height={160} alt="Card 3" />
            </Card.Section>
            <Group position="apart" mt="md" mb="xs">
              <Text weight={500}>Feature 3</Text>
              <Badge color="blue" variant="light">
                Coming Soon
              </Badge>
            </Group>
            <Text size="sm" color="dimmed">
              A sneak peek at upcoming features for your dashboard.
            </Text>
            <Button variant="light" color="blue" fullWidth mt="md" radius="md">
              Explore Feature 3
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
