// Home.jsx
import React, { useState } from "react";
import { Breadcrumbs, Anchor, Title, Paper } from "@mantine/core";
import Sidebar from "./Sidebar.jsx";
import SubjectContent from "./SubjectContent.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const navigate = useNavigate();

  const subjects = [
    { name: "Math", icon: "🧮", color: "#FFE0E0" },
    { name: "Physics", icon: "⚡", color: "#E0E0FF" },
    { name: "Chemistry", icon: "🧪", color: "#E0FFE0" },
    { name: "Biology", icon: "🧬", color: "#FFE0FF" },
    { name: "History", icon: "📚", color: "#FFFFE0" },
    { name: "Economics", icon: "📊", color: "#E0FFFF" },
    { name: "Geography", icon: "🌍", color: "#FFE0E0" },
    { name: "Social Science", icon: "👥", color: "#E0FFE0" },
  ];

  const getBreadcrumbItems = () => {
    const items = [
      {
        title: "Home",
        onClick: () => {
          setSelectedClass(null);
          setSelectedSubject(null);
        },
      },
    ];

    if (selectedClass) {
      items.push({
        title: `Class ${selectedClass}`,
        onClick: () => {
          setSelectedSubject(null);
        },
      });
    }

    if (selectedSubject) {
      items.push({
        title: selectedSubject,
        onClick: () => {}, // No action needed for last item
      });
    }

    return items.map((item, index) => (
      <Anchor
        key={index}
        onClick={item.onClick}
        style={{
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        {item.title}
      </Anchor>
    ));
  };

  const handleClassClick = (classNum) => {
    setSelectedClass(classNum);
    setSelectedSubject(null);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  const handleBackClick = () => {
    if (selectedSubject) {
      setSelectedSubject(null);
    } else if (selectedClass) {
      setSelectedClass(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Sidebar />

      {selectedSubject && (
        <div
          style={{
            width: "280px",
            borderRight: "1px solid #eee",
            padding: "20px",
            backgroundColor: "white",
          }}
        >
          <Title order={4} mb="md">
            Class {selectedClass} Subjects
          </Title>
          {subjects.map((subject, index) => (
            <Paper
              key={index}
              onClick={() => handleSubjectClick(subject.name)}
              shadow="xs"
              p="md"
              mb="sm"
              style={{
                cursor: "pointer",
                backgroundColor:
                  selectedSubject === subject.name ? "#f0f0f0" : "white",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                if (selectedSubject !== subject.name) {
                  e.currentTarget.style.backgroundColor = "#f8f8f8";
                }
              }}
              onMouseOut={(e) => {
                if (selectedSubject !== subject.name) {
                  e.currentTarget.style.backgroundColor = "white";
                }
              }}
            >
              <span style={{ fontSize: "1.5em" }}>{subject.icon}</span>
              <span>{subject.name}</span>
            </Paper>
          ))}
        </div>
      )}

      <div style={{ padding: "20px", flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          {(selectedClass || selectedSubject) && (
            <button
              onClick={handleBackClick}
              style={{
                marginRight: "15px",
                padding: "5px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                backgroundColor: "#e9ecef",
              }}
            >
              ← Back
            </button>
          )}
          <Breadcrumbs>{getBreadcrumbItems()}</Breadcrumbs>
        </div>

        {!selectedClass ? (
          // Display class cards
          <div>
            <Title order={2} mb="lg">
              Select Class
            </Title>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
                padding: "20px",
              }}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <Paper
                  key={i}
                  onClick={() => handleClassClick(i + 1)}
                  shadow="sm"
                  p="xl"
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <h2 style={{ margin: 0 }}>Class {i + 1}</h2>
                </Paper>
              ))}
            </div>
          </div>
        ) : !selectedSubject ? (
          // Display subject cards
          <div>
            <Title order={2} mb="lg">
              Class {selectedClass} - Select Subject
            </Title>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
                padding: "20px",
              }}
            >
              {subjects.map((subject, index) => (
                <Paper
                  key={index}
                  onClick={() => handleSubjectClick(subject.name)}
                  shadow="sm"
                  p="xl"
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    backgroundColor: subject.color,
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div style={{ fontSize: "2em", marginBottom: "10px" }}>
                    {subject.icon}
                  </div>
                  <h3 style={{ margin: 0 }}>{subject.name}</h3>
                </Paper>
              ))}
            </div>
          </div>
        ) : (
          // Display subject content
          <SubjectContent
            subject={selectedSubject}
            classNumber={selectedClass}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
