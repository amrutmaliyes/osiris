// Home.jsx
import React, { useState, useEffect } from "react";
import { Breadcrumbs, Anchor, Title, Paper } from "@mantine/core";
import Sidebar from "./Sidebar.jsx";
import SubjectContent from "./SubjectContent.jsx";
import { useNavigate } from "react-router-dom";
import image from "../assets/notes.jpeg";
import banner from '../assets/banner.png';

const Home = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    loadActiveContent();
  }, []);

  const loadActiveContent = async () => {
    const contentPaths = await window.electronAPI.getContentPaths();
    const activePath = contentPaths.find(path => path.is_active);

    if (activePath) {
      setActiveContent(activePath);
      loadClasses(activePath.path);
    }
  };

  const loadClasses = async (basePath) => {
    try {
      const classes = await window.electronAPI.readDirectory(basePath);
      const classNumbers = classes
        .filter(dir => dir.toLowerCase().startsWith('class'))
        .sort((a, b) => {
          const numA = parseInt(a.replace('class', ''));
          const numB = parseInt(b.replace('class', ''));
          return numA - numB;
        });

      setAvailableClasses(classNumbers);
    } catch (error) {
      console.error('Error reading directory:', error);
    }
  };

  useEffect(() => {
    if (selectedClass && activeContent) {
      loadSubjectsForClass(selectedClass);
    }
  }, [selectedClass, activeContent]);

  const loadSubjectsForClass = async (classNum) => {
    const classPath = `${activeContent.path}/class${classNum}`;
    try {
      const subjects = await window.electronAPI.readDirectory(classPath);
      setAvailableSubjects(subjects);
    } catch (error) {
      console.error('Error reading subjects:', error);
    }
  };

  const renderNoContent = () => (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <p style={{ fontSize: '20px', marginBottom: '20px' }}>No content available.</p>
      <button
        onClick={() => navigate("/settings")}
        style={{
          padding: "8px 16px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          backgroundColor: "#E78528",
          color: "white",
        }}
      >
        Add Content
      </button>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", paddingTop: "50px" }}>
      {userType === "admin" ? (
        <Sidebar />
      ) : (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <img
            src={banner}
            alt="Logo"
            style={{
              position: "absolute",
              top: "60%",
              left: "-580px",
              transform: "translate(-50%, -50%)",
              width: "160px",
              height: "auto",
            }}
          />
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              backgroundColor: "#E78528",
              color: "white",
            }}
          >
            Logout
          </button>
        </div>
      )}
      <div style={{ padding: "20px", flex: 1 }}>
        <Breadcrumbs mb="lg">
          <Anchor onClick={() => setSelectedClass(null)} style={{ cursor: "pointer" }}>
            Home
          </Anchor>
          {selectedClass && (
            <Anchor onClick={() => setSelectedSubject(null)} style={{ cursor: "pointer" }}>
              Class {selectedClass}
            </Anchor>
          )}
          {selectedSubject && <span>{selectedSubject}</span>}
        </Breadcrumbs>

        {!activeContent ? (
          renderNoContent()
        ) : !selectedClass ? (
          <div>
            <Title order={2} mb="lg" style={{ color: "white" }}>
              Select Class
            </Title>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "70px",
              padding: "20px",
              height: "600px",
            }}>
              {availableClasses.map((classDir, i) => (
                <Paper
                  key={i}
                  onClick={() => setSelectedClass(parseInt(classDir.replace('class', '')))}
                  shadow="sm"
                  p="xl"
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    position: "relative",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    width: "280px",
                    height: "200px",
                    borderRadius: "25px",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <img
                    src={image}
                    alt={`Class ${classDir} background`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      zIndex: 1,
                    }}
                  />
                  <div
                    style={{
                      position: "relative",
                      zIndex: 2,
                      color: "white",
                      textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                      paddingBottom: "15px",
                    }}
                  >
                    <h2 style={{ color: "black", top: "80px" }}>{classDir}</h2>
                  </div>
                </Paper>
              ))}
            </div>
          </div>
        ) : !selectedSubject ? (
          <div>
            <Title order={2} mb="lg">
              Class {selectedClass} - Select Subject
            </Title>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "20px",
              padding: "20px",
            }}>
              {availableSubjects.map((subject, index) => (
                <Paper
                  key={index}
                  onClick={() => setSelectedSubject(subject)}
                  shadow="sm"
                  p="xl"
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    backgroundColor: "#FFE0E0",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    padding: "20px",
                    borderRadius: "10px",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div style={{ 
                    fontSize: "2em", 
                    marginBottom: "10px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    📚
                  </div>
                  <h3 style={{ 
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#333"
                  }}>
                    {subject}
                  </h3>
                </Paper>
              ))}
            </div>
          </div>
        ) : (
          <SubjectContent
            subject={selectedSubject}
            classNumber={selectedClass}
            contentPath={activeContent.path}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
