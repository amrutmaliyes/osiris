import React, { useState, useEffect } from "react";
import { Text, Paper, Accordion, Group, Button } from "@mantine/core";
import { IconBook, IconVideo, IconFileText, IconHeadphones, IconFile } from '@tabler/icons-react';

const SubjectContent = ({ subject, classNumber, contentPath }) => {
  const [allSubjects, setAllSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(subject);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState([]);

  useEffect(() => {
    loadSubjects();
    setSelectedSubject(subject);
  }, [subject, classNumber, contentPath]);

  useEffect(() => {
    if (selectedSubject) {
      loadChapters(selectedSubject);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedChapter) {
      loadChapterContent();
    }
  }, [selectedChapter]);

  const loadSubjects = async () => {
    try {
      const classPath = `${contentPath}/class${classNumber}`;
      const subjects = await window.electronAPI.readDirectory(classPath);
      setAllSubjects(subjects);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const loadChapters = async (subjectName) => {
    try {
      const subjectPath = `${contentPath}/class${classNumber}/${subjectName}`;
      const chapterFiles = await window.electronAPI.readDirectory(subjectPath);
      setChapters(chapterFiles);
      setSelectedChapter(null);
      setChapterContent([]);
    } catch (error) {
      console.error('Error loading chapters:', error);
    }
  };

  const loadChapterContent = async () => {
    try {
      const chapterPath = `${contentPath}/class${classNumber}/${selectedSubject}/${selectedChapter}`;
      const files = await window.electronAPI.readDirectory(chapterPath);
      setChapterContent(files);
    } catch (error) {
      console.error('Error loading chapter content:', error);
    }
  };

  const handleFileOpen = async (fileName) => {
    try {
      const filePath = `${contentPath}/class${classNumber}/${selectedSubject}/${selectedChapter}/${fileName}`;
      const result = await window.electronAPI.openFile(filePath);
      
      if (!result.success) {
        console.error('Failed to open file:', result.error);
        alert(`Failed to open file: ${result.error}`);
      }
    } catch (error) {
      console.error('Error handling file:', error);
      alert('Error opening file');
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <IconFileText size={20} />;
      case 'mp4':
      case 'webm':
      case 'mkv':
        return <IconVideo size={20} />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <IconHeadphones size={20} />;
      default:
        return <IconFile size={20} />;
    }
  };

  const getFileTypeLabel = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'Read';
      case 'mp4':
      case 'webm':
      case 'mkv':
        return 'Watch';
      case 'mp3':
      case 'wav':
      case 'ogg':
        return 'Listen';
      default:
        return 'Open';
    }
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          backgroundColor: "#f5f5f5",
          padding: "20px",
          minHeight: "calc(100vh - 100px)",
          borderRight: "1px solid #ddd",
        }}
      >
        <Text
          size="xl"
          weight={700}
          style={{
            marginBottom: "20px",
            color: "#E78528",
            borderBottom: "2px solid #E78528",
            paddingBottom: "10px",
          }}
        >
          Subjects
        </Text>
        
        {allSubjects.map((subj, index) => (
          <Paper
            key={index}
            onClick={() => setSelectedSubject(subj)}
            style={{
              padding: "15px",
              marginBottom: "10px",
              cursor: "pointer",
              backgroundColor: selectedSubject === subj ? "#E78528" : "white",
              color: selectedSubject === subj ? "white" : "black",
              transition: "all 0.3s ease",
            }}
            shadow="sm"
            onMouseEnter={(e) => {
              if (selectedSubject !== subj) {
                e.currentTarget.style.backgroundColor = "#fff3e6";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedSubject !== subj) {
                e.currentTarget.style.backgroundColor = "white";
              }
            }}
          >
            <Text size="md" weight={500}>
              {subj}
            </Text>
          </Paper>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <Text size="xl" weight={700}>
            {selectedSubject} - Chapters
          </Text>
        </div>

        <Accordion>
          {chapters.map((chapter, index) => (
            <Accordion.Item 
              key={index} 
              value={chapter}
              onClick={() => setSelectedChapter(chapter)}
            >
              <Accordion.Control>
                <Group>
                  <IconBook size={20} />
                  <Text>{chapter}</Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                {selectedChapter === chapter && chapterContent.map((file, fileIndex) => (
                  <Group 
                    key={fileIndex}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                      alignItems: "center"
                    }}
                  >
                    {getFileIcon(file)}
                    <Text style={{ flex: 1 }}>{file}</Text>
                    <Button
                      variant="light"
                      color="orange"
                      onClick={() => handleFileOpen(file)}
                    >
                      Watch
                    </Button>
                  </Group>
                ))}
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default SubjectContent;
