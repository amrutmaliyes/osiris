// Home.jsx
import React, { useState } from "react";
import { Breadcrumbs, Anchor, Title, Paper } from "@mantine/core";
import Sidebar from "./Sidebar.jsx";
import SubjectContent from "./SubjectContent.jsx";
import { useNavigate } from "react-router-dom";
import  image from "../assets/notes.jpeg"
import banner from '../assets/banner.png'
const Home = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");


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
        paddingTop:"50px"
      }}
    >
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
  src={banner} // Make sure to import banner at the top
  alt="Logo"
  style={{
    position: "absolute", // Make the image positionable
    top: "60%",           // Position 50% from the top
    left: "-580px",          // Position 50% from the left
    transform: "translate(-50%, -50%)", // Offset by 50% of its width and height
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
            <Title order={2} mb="lg" style={{color:"white"}}>
              Select Class
            </Title>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "70px",
                padding: "20px",
                height:"600px",
               
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
                 alt={`Class ${i + 1} background`}
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
                 <h2 style={{ color:"black",top:"80px" }}>Class {i + 1}</h2>
               </div>
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
