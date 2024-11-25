// Home.jsx
import React from "react";
import Sidebar from "./Sidebar.jsx";
import { Breadcrumbs, Anchor, Container } from "@mantine/core";
import FeatureCard from "./FeatureCard.jsx"; 
import banner from '../assets/banner.png';
import notebook from "../assets/notebook.jpg"
const Home = () => {
  // Breadcrumb items
  const breadcrumbItems = [
    { title: "Home", href: "/" },
   
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
      <div style={{  padding: "20px", flex: 1 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

        {/* Cards Section */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "25px",
            left:"250px"
          }}
        >
          {/* Use the FeatureCard component with different props */}
          <FeatureCard title="class 1"  altText="Card 1" />
          <FeatureCard title="class 2"  altText="Card 2" />
          <FeatureCard title="class 3"  altText="Card 3" />
          <FeatureCard title="class 4"  altText="Card 3" />
          <FeatureCard title="class 5"  altText="Card 3" />
          <FeatureCard title="class 6"  altText="Card 3" />
          <FeatureCard title="class 7"  altText="Card 3" />

        </div>
      </div>
    </div>
  );
};

export default Home;
