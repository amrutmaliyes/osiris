import React, { useState, useEffect } from "react";
import { Text, Paper, Accordion, Group, Button, Progress } from "@mantine/core";
import { IconBook, IconVideo, IconFileText, IconHeadphones, IconFile } from '@tabler/icons-react';
import useProgressStore from '../stores/progressStore';

const SubjectContent = ({ subject, classNumber, contentPath, onSubjectChange }) => {
  const [allSubjects, setAllSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(subject);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState([]);
  const [userId, setUserId] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const { 
    chapterProgress, 
    contentProgress: storedContentProgress, 
    setChapterProgress, 
    setContentProgress 
  } = useProgressStore();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log('Stored userId:', storedUserId);
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []);

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

  useEffect(() => {
    const getActiveContent = async () => {
      const contentPaths = await window.electronAPI.getContentPaths();
      const active = contentPaths.find(path => path.is_active);
      setActiveContent(active);
      if (active) {
        loadProgressFromDB();
      }
    };
    getActiveContent();
  }, []);

  useEffect(() => {
    loadProgressFromDB();
  }, [userId]);

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
      
      // Calculate initial progress for this chapter
      const progress = calculateChapterProgress(files);
      setChapterProgress(prev => ({
        ...prev,
        [selectedChapter]: progress
      }));
    } catch (error) {
      console.error('Error loading chapter content:', error);
    }
  };

  const loadProgressFromDB = async () => {
    if (!userId || !activeContent) return;

    try {
      const result = await window.electronAPI.getContentProgress(parseInt(userId));
      if (result.success) {
        const progressMap = {};
        result.progress.forEach(item => {
          progressMap[item.title] = {
            percentage: item.completion_percentage || 0,
            status: item.status || 'not-started'
          };
          setContentProgress(item.title, {
            percentage: item.completion_percentage || 0,
            status: item.status || 'not-started'
          });
        });
        setContentProgress(progressMap);
        
        // Calculate chapter progress based on DB data
        chapters.forEach(chapter => {
          const chapterFiles = chapterContent;
          const progress = calculateChapterProgress(chapterFiles);
          setChapterProgress(chapter, progress);
        });
      }
    } catch (error) {
      console.error('Error loading progress from DB:', error);
    }
  };

  const calculateChapterProgress = (files) => {
    const totalFiles = files.length;
    if (totalFiles === 0) return 0;

    const completedFiles = files.filter(
      file => storedContentProgress[file]?.percentage === 100
    ).length;

    return Math.round((completedFiles / totalFiles) * 100);
  };

  const handleFileOpen = async (fileName) => {
    try {
      if (!userId) {
        console.error('No user ID available');
        return;
      }

      const filePath = `${contentPath}/class${classNumber}/${selectedSubject}/${selectedChapter}/${fileName}`;
      console.log('Opening file with:', { filePath, userId });

      // Get the active content path ID
      const contentPaths = await window.electronAPI.getContentPaths();
      const activePath = contentPaths.find(path => path.is_active);
      
      if (!activePath) {
        console.error('No active content path found');
        return;
      }

      // Get content item ID
      const contentItem = await window.electronAPI.getContentItem(activePath.id, fileName);
      
      if (!contentItem?.success) {
        console.error('Content item not found');
        return;
      }

      // Open the file
      const result = await window.electronAPI.openFile({
        filePath,
        userId: parseInt(userId)
      });
      
      if (result.success) {
        // Update progress in local state
        setContentProgress(fileName, { 
          percentage: 100, 
          status: 'completed' 
        });

        // Update progress in database
        await window.electronAPI.updateContentProgress({
          userId: parseInt(userId),
          folderId: activePath.id,
          contentItemId: contentItem.id,
          completionPercentage: 100,
          status: 'completed'
        });

        // Recalculate chapter progress
        const newProgress = calculateChapterProgress(chapterContent);
        setChapterProgress(selectedChapter, newProgress);
      }
    } catch (error) {
      console.error('Error handling file:', error);
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

  const renderFileItem = (file, fileIndex) => (
    <Group 
      key={fileIndex}
      style={{
        padding: "10px",
        borderBottom: "1px solid #eee",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: "8px",
        margin: "5px 0"
      }}
    >
      {getFileIcon(file)}
      <Text style={{ flex: 1 }}>{file}</Text>
      <div style={{ width: "200px", marginRight: "15px" }}>
        <Progress 
          value={storedContentProgress[file]?.percentage || 0}
          size="sm"
          radius="xl"
          color={storedContentProgress[file]?.percentage === 100 ? "green" : "orange"}
          striped
          animate
        />
        <Text size="xs" color="dimmed" align="center" mt={5}>
          {storedContentProgress[file]?.percentage || 0}% Completed
        </Text>
      </div>
      <Button
        variant="light"
        color="orange"
        onClick={() => handleFileOpen(file)}
        radius="md"
      >
        {getFileTypeLabel(file)}
      </Button>
    </Group>
  );

  const handleSubjectSelect = (subj) => {
    setSelectedSubject(subj);
    onSubjectChange(subj);
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
            onClick={() => handleSubjectSelect(subj)}
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
                <Group position="apart" style={{ width: '100%' }}>
                  <Group>
                    <IconBook size={20} />
                    <Text>{chapter}</Text>
                  </Group>
                  
                  <Group spacing="xs" style={{ width: '300px' }}>
                    <div style={{ flex: 1 }}>
                      <Progress 
                        value={chapterProgress[chapter] || 0}
                        size="md"
                        radius="xl"
                        color={chapterProgress[chapter] === 100 ? "green" : "orange"}
                        striped
                        animate
                      />
                      <Text size="xs" color="dimmed" align="center" mt={5}>
                        {chapterProgress[chapter] || 0}% Complete
                        {chapterContent.length > 0 && ` (${chapterContent.filter(
                          file => storedContentProgress[file]?.percentage === 100
                        ).length}/${chapterContent.length} files)`}
                      </Text>
                    </div>
                  </Group>
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
                    <div style={{ width: "200px", marginRight: "15px" }}>
                      <Progress 
                        value={storedContentProgress[file]?.percentage || 0}
                        size="sm"
                        radius="xl"
                        color={storedContentProgress[file]?.percentage === 100 ? "green" : "orange"}
                        striped
                        animate
                      />
                      <Text size="xs" color="dimmed" align="center" mt={5}>
                        {storedContentProgress[file]?.percentage || 0}% Completed
                      </Text>
                    </div>
                    <Button
                      variant="light"
                      color="orange"
                      onClick={() => handleFileOpen(file)}
                      radius="md"
                    >
                      Open
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
