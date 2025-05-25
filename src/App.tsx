import { useState, useEffect } from "react";
import "./input.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ActivationPage from './pages/ActivationPage';
import LoginPage from './pages/LoginPage';
import NewActivationForm from './pages/NewActivationForm';
import ReactivationForm from './pages/ReactivationForm';
import { invoke } from '@tauri-apps/api/core';

function App() {
  const [initialRoute, setInitialRoute] = useState('/');
  const [loading, setLoading] = useState(true);

  const handleLoginSuccess = () => {};

  useEffect(() => {
    const checkActivationAndRoute = async () => {
      try {
        const hasActivation = await invoke('has_activation');
        console.log('has_activation result:', hasActivation);

        if (hasActivation) {
          const isExpired = await invoke('check_activation_expiry');
          console.log('check_activation_expiry result:', isExpired);
          if (isExpired) {
            setInitialRoute('/reactivation');
          } else {
            setInitialRoute('/login');
          }
        } else {
          setInitialRoute('/activation');
        }
      } catch (error) {
        console.error('Error checking activation or expiry:', error);
        setInitialRoute('/activation');
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
    <Router>
      <Routes>
        <Route path="/activation" element={<ActivationPage />} />
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/new-activation" element={<NewActivationForm />} />
        <Route path="/reactivation" element={<ReactivationForm />} />
        <Route path="/" element={<Navigate to={initialRoute} replace />} />
        <Route path="*" element={<Navigate to={initialRoute} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
