import React, { useState, useEffect, useRef } from "react";
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
  const [activePath, setActivePath] = useState(null);

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
      calculateChapterProgress(selectedChapter);
    }
  }, [contentProgress, selectedChapter, chapterContent]);

  useEffect(() => {
    const getActivePath = async () => {
      const contentPaths = await window.electronAPI.getContentPaths();
      const active = contentPaths.find(path => path.is_active);
      setActivePath(active);
    };
    getActivePath();
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!userId || !activePath) return;

      try {
        const result = await window.electronAPI.getContentProgress(userId);
        if (result.success) {
          const progressMap = {};
          result.progress.forEach(item => {
            progressMap[item.title] = {
              percentage: item.completion_percentage || 0,
              status: item.status || 'not-started'
            };
          });
          setContentProgress(progressMap);

          // Calculate chapter progress
          const chapterMap = {};
          chapters.forEach(chapter => {
            const chapterFiles = chapterContent.filter(file => file.chapter === chapter);
            const totalFiles = chapterFiles.length;
            const completedFiles = chapterFiles.filter(
              file => progressMap[file]?.percentage === 100
            ).length;
            chapterMap[chapter] = Math.round((completedFiles / totalFiles) * 100);
          });
          setChapterProgress(chapterMap);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    loadInitialData();
  }, [userId, activePath, chapters, chapterContent]);

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
      if (!chapterContent.length) return 0;

      // Sum up all file percentages and divide by total files
      const totalProgress = chapterContent.reduce((sum, file) => {
        return sum + (contentProgress[file]?.percentage || 0);
      }, 0);
      
      const averageProgress = Math.round(totalProgress / chapterContent.length);
      
      setChapterProgress(prev => ({
        ...prev,
        [chapter]: averageProgress
      }));

      return averageProgress;
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
          // Update initial progress if not already started
          if (!contentProgress[fileName]?.percentage) {
            updateProgress(fileName, 0);
          }
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
          // For PDFs and other files, mark as 100% complete when opened
          updateProgress(fileName, 100);
        } else {
          notifications.show({
            title: 'Error',
            message: result.error || 'Failed to open file',
            color: 'red'
          });
        }
      }
    } catch (error) {
      console.error('Error in handleFileOpen:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to open file. Please try again.',
        color: 'red'
      });
    }
  };

  const updateProgress = async (fileName, percentage = 100) => {
    try {
      if (!activePath) {
        console.error('No active content path');
        return;
      }

      const contentItem = await window.electronAPI.getContentItem(activePath.id, fileName);
      if (!contentItem?.success) {
        console.error('Content item not found:', fileName);
        return;
      }

      // Update local state
      const newContentProgress = {
        ...contentProgress,
        [fileName]: { 
          percentage, 
          status: percentage === 100 ? 'completed' : 'in-progress' 
        }
      };
      setContentProgress(newContentProgress);

      // Update database
      await window.electronAPI.updateContentProgress({
        userId: parseInt(userId),
        folderId: activePath.id,
        contentItemId: contentItem.id,
        completionPercentage: percentage,
        status: percentage === 100 ? 'completed' : 'in-progress'
      });

      // Calculate and update chapter progress immediately
      if (selectedChapter) {
        const totalProgress = chapterContent.reduce((sum, file) => {
          // Use the new progress value for the updated file
          if (file === fileName) {
            return sum + percentage;
          }
          return sum + (newContentProgress[file]?.percentage || 0);
        }, 0);
        
        const averageProgress = Math.round(totalProgress / chapterContent.length);
        
        setChapterProgress(prev => ({
          ...prev,
          [selectedChapter]: averageProgress
        }));
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update progress',
        color: 'red'
      });
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
    if (!mediaFile || !activePath) return null;

    const isVideo = ['mp4', 'webm'].includes(mediaFile.type);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const videoRef = useRef(null);
    const progressUpdateTimeout = useRef(null);

    // Load saved progress when video loads
    useEffect(() => {
      const loadSavedProgress = async () => {
        if (!videoRef.current) return;
        
        try {
          const contentItem = await window.electronAPI.getContentItem(activePath.id, mediaFile.name);
          if (contentItem?.success) {
            const progress = contentProgress[mediaFile.name]?.percentage || 0;
            if (progress > 0 && progress < 100) {
              const timeToSeek = (progress / 100) * videoRef.current.duration;
              videoRef.current.currentTime = timeToSeek;
            }
          }
        } catch (error) {
          console.error('Error loading saved progress:', error);
        }
      };

      if (videoRef.current && videoRef.current.readyState >= 2) {
        loadSavedProgress();
      }
    }, [mediaFile, videoRef.current?.readyState]);

    const handleTimeUpdate = () => {
      if (!videoRef.current) return;
      
      // Clear any existing timeout
      if (progressUpdateTimeout.current) {
        clearTimeout(progressUpdateTimeout.current);
      }

      const video = videoRef.current;
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(Math.round(currentProgress));

      // Debounce progress updates to database
      progressUpdateTimeout.current = setTimeout(() => {
        // Only update if progress has changed significantly (more than 1%)
        if (Math.abs(currentProgress - (contentProgress[mediaFile.name]?.percentage || 0)) > 1) {
          updateProgress(mediaFile.name, Math.round(currentProgress));
        }
      }, 1000); // Update database every second at most
    };

    const handleVideoEnd = () => {
      updateProgress(mediaFile.name, 100);
      setProgress(100);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (progressUpdateTimeout.current) {
          clearTimeout(progressUpdateTimeout.current);
        }
      };
    }, []);

    return (
      <Modal
        opened={isMediaModalOpen}
        onClose={() => {
          // Save final progress before closing
          if (videoRef.current) {
            const finalProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            updateProgress(mediaFile.name, Math.round(finalProgress));
          }
          setIsMediaModalOpen(false);
          setMediaFile(null);
        }}
        size="90%"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{mediaFile.name}</span>
            <Progress
              value={progress}
              size="sm"
              style={{ width: '200px' }}
              color={progress === 100 ? "green" : "orange"}
            />
            <span>{progress}%</span>
          </div>
        }
        styles={{
          modal: { backgroundColor: '#1a1b1e' },
          header: { marginBottom: '10px', color: '#fff' },
          body: { padding: '0', height: '80vh' }
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
          position: 'relative',
        }}>
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
          {isVideo ? (
            <video
              ref={videoRef}
              src={mediaFile.path}
              controls
              autoPlay
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnd}
              onLoadStart={() => {
                setIsLoading(true);
                setError(null);
              }}
              onLoadedData={() => {
                setIsLoading(false);
                setIsConverting(false);
              }}
              onError={(e) => {
                setIsLoading(false);
                setError(e.target.error?.message || 'Failed to load video');
              }}
            />
          ) : (
            <audio
              ref={videoRef}
              src={mediaFile.path}
              controls
              autoPlay
              style={{ width: '100%' }}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnd}
              onLoadStart={() => setIsLoading(true)}
              onLoadedData={() => setIsLoading(false)}
              onError={(e) => {
                setIsLoading(false);
                setError(e.target.error?.message || 'Failed to load audio');
              }}
            />
          )}
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
