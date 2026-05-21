import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { invoke } from "@tauri-apps/api/core";
import { useAuth } from "../contexts/AuthContext";
import ContentBrowser from "../components/ContentBrowser";
import QuizPage from "./QuizPage";
import { useLanguage } from "../contexts/LanguageContext";
import AppShell, { PageContent } from "../components/ui/AppShell";
import WelcomeBanner from "../components/ui/WelcomeBanner";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import Button from "../components/ui/Button";

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
  const { user, userRole } = useAuth();
  const { t } = useLanguage();
  const [hasActiveContentPath, setHasActiveContentPath] = useState(false);
  const [loadingContentPath, setLoadingContentPath] = useState(true);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizData, setCurrentQuizData] = useState<QuizData | null>(null);
  const [initialActivePath, setInitialActivePath] = useState<string | null>(null);

  const handleAddContentPathClick = () => navigate("/content");

  const handleNavigate = (newPath: string) => setCurrentPath(newPath);

  const handleBack = () => {
    if (currentPath && initialActivePath) {
      if (currentPath === initialActivePath) return;
      const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
      if (
        initialActivePath.startsWith(parentPath) ||
        parentPath.startsWith(initialActivePath)
      ) {
        setCurrentPath(parentPath || initialActivePath);
      } else {
        setCurrentPath(initialActivePath);
      }
    }
  };

  const handleOpenFile = async (file: string) => {
    setIsDecrypting(true);
    setSnackbarVisible(false);

    try {
      const extension = file.split(".").pop()?.toLowerCase();

      if (extension === "xml") {
        const decryptedFilePath = await invoke("decrypt_file", { filePath: file });
        const quizDataFromRust = await invoke<{ questions: Question[] }>(
          "parse_xml_quiz",
          { filePath: decryptedFilePath }
        );
        const questions = Array.isArray(quizDataFromRust?.questions)
          ? quizDataFromRust.questions
          : [];
        setCurrentQuizData({ questions });
        setShowQuiz(true);
      } else {
        const decryptedFilePath = await invoke("decrypt_file", { filePath: file });
        await invoke("open_file_in_system", { path: decryptedFilePath });
      }
    } catch (error) {
      setSnackbarMessage(`Error: ${error}`);
      setSnackbarVisible(true);
    } finally {
      setIsDecrypting(false);
    }
  };

  useEffect(() => {
    const checkContentPath = async () => {
      try {
        const hasPath = (await invoke("has_active_content_path")) as boolean;
        setHasActiveContentPath(hasPath);

        if (hasPath) {
          const activePath = (await invoke("get_active_content_path")) as
            | string
            | null;
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
    return <LoadingOverlay message={t("loading_content_path_status")} />;
  }

  const isAtContentRoot =
    currentPath === initialActivePath && hasActiveContentPath;

  const onCloseQuiz = () => {
    setShowQuiz(false);
    setCurrentQuizData(null);
  };

  const username = user?.name || "User";

  const mainContent = showQuiz ? (
    <QuizPage isOpen={showQuiz} onClose={onCloseQuiz} quizData={currentQuizData} />
  ) : hasActiveContentPath ? (
    <>
      {userRole !== "admin" && <WelcomeBanner username={username} />}
      <div className="mb-4 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          {t("content_area")}
        </h1>
        {!isAtContentRoot && currentPath !== null && (
          <Button variant="outline" size="sm" onClick={handleBack} fullWidth={false}>
            &larr; {t("back")}
          </Button>
        )}
      </div>
      {currentPath && initialActivePath && (
        <ContentBrowser
          currentPath={currentPath}
          onNavigate={handleNavigate}
          onOpenFile={handleOpenFile}
          initialActivePath={initialActivePath}
        />
      )}
    </>
  ) : userRole === "admin" ? (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="mb-4 text-2xl font-bold text-[var(--color-text)]">
        {t("no_active_content_path_set")}
      </h1>
      <p className="mb-6 max-w-md text-[var(--color-text-secondary)]">
        {t("set_active_content_path_message")}
      </p>
      <Button onClick={handleAddContentPathClick}>
        {t("go_to_content_path_settings")}
      </Button>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <WelcomeBanner username={username} />
      <p className="text-lg text-[var(--color-text-secondary)]">
        {t("no_content_available")}
      </p>
    </div>
  );

  return (
    <AppShell sidebar={userRole === "admin" ? <AdminSidebar /> : undefined}>
      <PageContent>{mainContent}</PageContent>
      {isDecrypting && <LoadingOverlay message={t("loading")} />}
      {snackbarVisible && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[var(--color-text)] px-5 py-3 text-sm text-[var(--color-background)] shadow-[var(--shadow-lg)]">
          {snackbarMessage}
        </div>
      )}
    </AppShell>
  );
}

export default HomePage;
