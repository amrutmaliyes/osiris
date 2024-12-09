import React, { useState, useEffect } from "react";
import { Text, Paper, Accordion, Group, Button, Progress, Modal } from "@mantine/core";
import { IconBook, IconVideo, IconFileText, IconHeadphones, IconFile } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';


const SubjectContent = ({ subject, classNumber, contentPath, onSubjectChange }) => {
  const [allSubjects, setAllSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(subject);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState([]);
  const [userId, setUserId] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [contentProgress, setContentProgress] = useState({});
  const [chapterProgress, setChapterProgress] = useState({});
  const [mediaFile, setMediaFile] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

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
    if (userId && activeContent) {
      loadProgressFromDB();
    }
  }, [userId, activeContent]);

  useEffect(() => {
    if (selectedChapter && chapterContent.length > 0) {
      const totalFiles = chapterContent.length;
      const completedFiles = chapterContent.filter(
        file => contentProgress[file]?.percentage === 100
      ).length;
      const progress = Math.round((completedFiles / totalFiles) * 100);
      
      setChapterProgress(prev => ({
        ...prev,
        [selectedChapter]: progress
      }));
    }
  }, [contentProgress, selectedChapter, chapterContent]);

  useEffect(() => {
    if (chapters.length > 0) {
      calculateAllChaptersProgress(chapters);
    }
  }, [contentProgress, chapters]);

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

      await calculateAllChaptersProgress(chapterFiles);
    } catch (error) {
      console.error('Error loading chapters:', error);
    }
  };

  const loadChapterContent = async () => {
    try {
      const chapterPath = `${contentPath}/class${classNumber}/${selectedSubject}/${selectedChapter}`;
      const files = await window.electronAPI.readDirectory(chapterPath);
      setChapterContent(files);
      
      // Load progress after setting chapter content
      await loadProgressFromDB();
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
        });
        setContentProgress(progressMap);
        
        // Calculate chapter progress after loading progress data
        if (selectedChapter && chapterContent.length > 0) {
          const totalFiles = chapterContent.length;
          const completedFiles = chapterContent.filter(
            file => progressMap[file]?.percentage === 100
          ).length;
          const progress = Math.round((completedFiles / totalFiles) * 100);
          
          setChapterProgress(prev => ({
            ...prev,
            [selectedChapter]: progress
          }));
        }
      }
    } catch (error) {
      console.error('Error loading progress from DB:', error);
    }
  };

  const calculateChapterProgress = async (chapter) => {
    try {
      const chapterPath = `${contentPath}/class${classNumber}/${selectedSubject}/${chapter}`;
      const files = await window.electronAPI.readDirectory(chapterPath);
      
      if (files.length === 0) return 0;

      const completedFiles = files.filter(
        file => contentProgress[file]?.percentage === 100
      ).length;
      
      return Math.round((completedFiles / files.length) * 100);
    } catch (error) {
      console.error(`Error calculating progress for ${chapter}:`, error);
      return 0;
    }
  };

  const calculateAllChaptersProgress = async (chapterList) => {
    const progress = {};
    for (const chapter of chapterList) {
      progress[chapter] = await calculateChapterProgress(chapter);
    }
    setChapterProgress(progress);
  };

  const handleFileOpen = async (fileName) => {
    try {
      if (!userId) {
        console.error('No user ID available');
        notifications.show({
          title: 'Error',
          message: 'User ID not available',
          color: 'red'
        });
        return;
      }

      const filePath = `${contentPath}/class${classNumber}/${selectedSubject}/${selectedChapter}/${fileName}`;
      const extension = fileName.split('.').pop().toLowerCase();
      
      if (['mp3', 'mp4', 'webm', 'ogg'].includes(extension)) {
        console.log('Opening media file:', filePath);
        console.log('File extension:', extension);
        
        const result = await window.electronAPI.getDecryptedFilePath({
          filePath,
          userId: parseInt(userId)
        });
        
        console.log('Decrypted file result:', result);
        
        if (result.success) {
          // Add file verification
          try {
            const videoElement = document.createElement('video');
            videoElement.src = result.filePath;
            await new Promise((resolve, reject) => {
              videoElement.onloadedmetadata = () => {
                console.log('Video metadata loaded:', {
                  duration: videoElement.duration,
                  width: videoElement.videoWidth,
                  height: videoElement.videoHeight
                });
                resolve();
              };
              videoElement.onerror = () => reject(new Error('Failed to load video metadata'));
              setTimeout(() => reject(new Error('Video load timeout')), 5000);
            });
          } catch (error) {
            console.error('Video verification failed:', error);
            notifications.show({
              title: 'Error',
              message: 'Video file appears to be corrupted',
              color: 'red'
            });
            return;
          }

          setMediaFile({
            path: result.filePath,
            type: extension,
            name: fileName
          });
          setIsMediaModalOpen(true);
          updateProgress(fileName);
        } else {
          notifications.show({
            title: 'Error',
            message: result.error || 'Failed to open media file',
            color: 'red'
          });
        }
      } else {
        const result = await window.electronAPI.openFile({
          filePath,
          userId: parseInt(userId)
        });
        
        if (result.success) {
          updateProgress(fileName);
        }
      }
    } catch (error) {
      console.error('Error in handleFileOpen:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to open media file. Please try again.',
        color: 'red'
      });
    }
  };

  const updateProgress = async (fileName) => {
    const contentPaths = await window.electronAPI.getContentPaths();
    const activePath = contentPaths.find(path => path.is_active);
    const contentItem = await window.electronAPI.getContentItem(activePath.id, fileName);

    if (contentItem?.success) {
      const newContentProgress = {
        ...contentProgress,
        [fileName]: { 
          percentage: 100, 
          status: 'completed' 
        }
      };
      setContentProgress(newContentProgress);

      await window.electronAPI.updateContentProgress({
        userId: parseInt(userId),
        folderId: activePath.id,
        contentItemId: contentItem.id,
        completionPercentage: 100,
        status: 'completed'
      });

      // Update chapter progress
      const totalFiles = chapterContent.length;
      const completedFiles = chapterContent.filter(
        file => newContentProgress[file]?.percentage === 100
      ).length;
      const newProgress = Math.round((completedFiles / totalFiles) * 100);

      setChapterProgress(prev => ({
        ...prev,
        [selectedChapter]: newProgress
      }));
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
          value={contentProgress[file]?.percentage || 0}
          size="sm"
          radius="xl"
          color={contentProgress[file]?.percentage === 100 ? "green" : "orange"}
          striped
          animate
        />
        <Text size="xs" color="dimmed" align="center" mt={5}>
          {contentProgress[file]?.percentage || 0}% Completed
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

  const MediaPlayer = () => {
    if (!mediaFile) return null;

    const isVideo = ['mp4', 'webm'].includes(mediaFile.type);
    const MediaTag = isVideo ? 'video' : 'audio';

    const containerStyle = {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
      position: 'relative',
    };

    const mediaStyle = {
      width: '100%',
      height: '100%',
      maxHeight: '80vh',
      objectFit: 'contain',
      backgroundColor: '#000',
    };

    // Add state for video loading
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    return (
      <Modal
        opened={isMediaModalOpen}
        onClose={() => {
          setIsMediaModalOpen(false);
          setMediaFile(null);
        }}
        size="90%"
        title={mediaFile.name}
        styles={{
          modal: {
            backgroundColor: '#1a1b1e',
          },
          header: {
            marginBottom: '10px',
            color: '#fff'
          },
          body: {
            padding: '0',
            height: '80vh',
          }
        }}
      >
        <div style={containerStyle}>
          {isLoading && (
            <div style={{ position: 'absolute', color: 'white', zIndex: 1000 }}>
              {isConverting ? 'Converting video format...' : 'Loading video...'}
            </div>
          )}
          {error && (
            <div style={{ position: 'absolute', color: 'red', zIndex: 1000 }}>
              Error: {error}
            </div>
          )}
          <MediaTag
            key={mediaFile.path}
            controls
            autoPlay
            playsInline
            style={mediaStyle}
            onEnded={() => {
              setIsMediaModalOpen(false);
              setMediaFile(null);
            }}
            controlsList="nodownload"
            preload="auto"
            onLoadStart={() => {
              console.log('Loading started');
              setIsLoading(true);
              setError(null);
              // Check if video is being converted
              if (mediaFile.info?.converted) {
                setIsConverting(true);
              }
            }}
            onLoadedData={() => {
              console.log('Video loaded');
              setIsLoading(false);
              setIsConverting(false);
            }}
            onLoadedMetadata={(e) => {
              const video = e.target;
              console.log('Metadata loaded:', {
                duration: video.duration,
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight,
                readyState: video.readyState,
                networkState: video.networkState,
                paused: video.paused,
                currentSrc: video.currentSrc,
                error: video.error
              });
            }}
            onError={(e) => {
              const video = e.target;
              setIsLoading(false);
              setError(video.error ? video.error.message : 'Unknown error');
              console.error('Video error:', {
                error: video.error,
                networkState: video.networkState,
                readyState: video.readyState,
                currentSrc: video.currentSrc
              });
            }}
          >
            <source 
              src={mediaFile.path} 
              type="video/mp4; codecs=avc1.42E01E,mp4a.40.2"
            />
            Your browser does not support the video tag.
          </MediaTag>
        </div>
      </Modal>
    );
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
                        {/* {chapterContent.length > 0 && ` (${chapterContent.filter(
                          file => contentProgress[file]?.percentage === 100
                        ).length}/${chapterContent.length} files)`} */}
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
                        value={contentProgress[file]?.percentage || 0}
                        size="sm"
                        radius="xl"
                        color={contentProgress[file]?.percentage === 100 ? "green" : "orange"}
                        striped
                        animate
                      />
                      <Text size="xs" color="dimmed" align="center" mt={5}>
                        {contentProgress[file]?.percentage || 0}% Completed
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
      
      <MediaPlayer />
    </div>
  );
};

export default SubjectContent;
