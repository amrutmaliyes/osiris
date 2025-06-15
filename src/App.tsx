import { useState, useEffect } from "react";
import "./input.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ActivationPage from "./pages/ActivationPage";
import LoginPage from "./pages/LoginPage";
import NewActivationForm from "./pages/NewActivationForm";
import ReactivationForm from "./pages/ReactivationForm";
import HomePage from "./pages/HomePage";
import ContentPathPage from "./pages/ContentPathPage";
import Users from "./pages/Users";
import { invoke } from "@tauri-apps/api/core";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [initialRoute, setInitialRoute] = useState("/");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkActivationAndRoute = async () => {
      try {
        const hasActivation = await invoke("has_activation");

        if (hasActivation) {
          const isExpired = await invoke("check_activation_expiry");
          if (isExpired) {
            setInitialRoute("/reactivation");
          } else {
            setInitialRoute("/login");
          }
        } else {
          setInitialRoute("/activation");
        }
      } catch (error) {
        console.error("Error checking activation or expiry:", error);
        setInitialRoute("/activation");
      } finally {
        setLoading(false);
      }
    };

    checkActivationAndRoute();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={initialRoute} replace />} />
          <Route path="/activation" element={<ActivationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/new-activation" element={<NewActivationForm />} />
          <Route path="/reactivation" element={<ReactivationForm />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/content" element={<ContentPathPage />} />
          <Route path="/users" element={<Users />} />
          <Route path="*" element={<Navigate to={initialRoute} replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
