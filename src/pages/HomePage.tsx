import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { invoke } from "@tauri-apps/api/core";
import { useAuth } from "../contexts/AuthContext";
import ContentBrowser from "../components/ContentBrowser";
import QuizPage from "./QuizPage";

interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
  description?: string;
}

interface QuizData {
  questions: Question[];
}

function HomePage() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [hasActiveContentPath, setHasActiveContentPath] = useState<boolean>(false);
  const [loadingContentPath, setLoadingContentPath] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [currentQuizData, setCurrentQuizData] = useState<QuizData | null>(null);

  const handleAddContentPathClick = () => {
    navigate("/content");
  };

  const handleNavigate = (newPath: string) => {
    setCurrentPath(newPath);
  };

  const handleBack = () => {
    if (currentPath && initialActivePath) {
      if (currentPath === initialActivePath) {
        return;
      }

      const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));

      if (initialActivePath.startsWith(parentPath) || parentPath.startsWith(initialActivePath)) {
           setCurrentPath(parentPath || initialActivePath);
      } else {
           setCurrentPath(initialActivePath);
      }
    }
  };

  const handleOpenFile = async (file: string) => {
    console.log("Attempting to open file:", file);
    setIsDecrypting(true);
    setSnackbarVisible(false);

    try {
        const filePath = file;
        const extension = filePath.split('.').pop()?.toLowerCase();

        if (extension === 'xml') {
            const decryptedFilePath = await invoke('decrypt_file', { filePath });
            console.log("Decrypted file path for XML:", decryptedFilePath);

            let quizDataFromRust: any = null;
            try {
                quizDataFromRust = await invoke<any>('parse_xml_quiz', { filePath: decryptedFilePath });
                console.log('DEBUG: quizDataFromRust after invoke (stringify):', JSON.stringify(quizDataFromRust));
                console.log('DEBUG: quizDataFromRust after invoke (direct):', quizDataFromRust);
            } catch (parseError) {
                console.error("Error parsing XML quiz in Rust:", parseError);
                setSnackbarMessage(`Failed to parse XML content: ${parseError}`);
                setSnackbarVisible(true);
                setIsDecrypting(false);
                return;
            }

            const questions = Array.isArray(quizDataFromRust?.questions)
                ? quizDataFromRust.questions
                : [];

            console.log('--------6 Formatted Questions from Rust:', questions);
            console.log('DEBUG: Navigating with state - quizData:', { questions: questions }, 'returnPath:', currentPath);
            
            setCurrentQuizData({ questions: questions });
            setShowQuiz(true);

        } else {
            const decryptedFilePath = await invoke('decrypt_file', { filePath });
            console.log("Decrypted file path:", decryptedFilePath);
            await invoke('open_file_in_system', { path: decryptedFilePath });
        }
    } catch (error) {
        console.error("Error processing file:", error);
        setSnackbarMessage(`Error: ${error}`);
        setSnackbarVisible(true);
    } finally {
      setIsDecrypting(false);
    }
  };

  const [initialActivePath, setInitialActivePath] = useState<string | null>(null);

  useEffect(() => {
    const checkContentPath = async () => {
      try {
        const hasPath = (await invoke("has_active_content_path")) as boolean;
        setHasActiveContentPath(hasPath);

        if (hasPath) {
          const activePath = await invoke("get_active_content_path") as string | null;
          setInitialActivePath(activePath);
          setCurrentPath(activePath);
        } else {
          setInitialActivePath(null);
          setCurrentPath(null);
        }

      } catch (error) {
        console.error("Error checking content path:", error);
      } finally {
        setLoadingContentPath(false);
      }
    };

    checkContentPath();

  }, []);

  if (userRole === "admin" && loadingContentPath) {
    return <div>Loading content path status...</div>;
  }

  const isAtContentRoot = currentPath === initialActivePath && hasActiveContentPath;

  const onCloseQuiz = () => {
    setShowQuiz(false);
    setCurrentQuizData(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {userRole === "admin" && <AdminSidebar />}

      {showQuiz ? (
        <QuizPage
          isOpen={showQuiz}
          onClose={onCloseQuiz}
          quizData={currentQuizData}
        />
      ) : (
        <div className={`flex-1 p-4 ${userRole === "admin" ? '' : 'ml-0'}`}>
          {hasActiveContentPath ? (
            <div className="flex-1 p-4">
              <h1 className="text-3xl font-bold mb-4">Content Area</h1>

              {!isAtContentRoot && currentPath !== null && (
                <button
                  className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                  onClick={handleBack}
                >
                  Back
                </button>
              )}

              {currentPath && initialActivePath && (
                <ContentBrowser
                  currentPath={currentPath}
                  onNavigate={handleNavigate}
                  onOpenFile={handleOpenFile}
                  initialActivePath={initialActivePath}
                />
              )}
            </div>
          ) : (userRole === "admin" ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <h1 className="text-2xl font-bold mb-4 text-center">
                No active content path set
              </h1>
              <p className="text-lg mb-6 text-center">
                Please set an active content path to access the content management features.
              </p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleAddContentPathClick}
              >
                Go to Content Path Settings
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page!</h1>
              <p className="text-lg mb-4">No content is available at the moment. Please contact your administrator.</p>
            </div>
          ))}

          {isDecrypting && (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-orange-500"></div>
              <div className="text-white mt-4 text-xl">Loading...</div>
            </div>
          )}

          {snackbarVisible && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg">
              {snackbarMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
