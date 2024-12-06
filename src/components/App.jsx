import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Notifications, notifications } from '@mantine/notifications';
import ProductActivation from "./ProductActivation.jsx";
import ActivationForm from "./ActivationForm.jsx";
import ActivationDetails from "./ActivationDetails.jsx";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Settings from "./Settings.jsx";
import Sidebar from "./Sidebar.jsx";
import Security from "./Security.jsx";
import Account from "./Account.jsx";
import Users from "./Users.jsx";
import Report from "./Report.jsx";
import Support from "./Support.jsx";
import FeatureCard from "./FeatureCard.jsx";

const AppContent = () => {
  const [isActivated, setIsActivated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleActivationSuccess = () => {
    setIsActivated(true);
  };

  const checkActivationStatus = async () => {
    try {
      const activated = await window.electronAPI.checkActivation();
      setIsActivated(activated);
      setIsLoading(false);
      
      if (!activated && 
          !location.pathname.includes("/activation-form") && 
          !location.pathname.includes("/activation-details") &&
          location.pathname !== "/" ) {
        notifications.show({
          title: "Activation Expired",
          message: "Your product activation has expired. Please reactivate to continue using the application.",
          color: "red",
          autoClose: 5000,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Activation check failed:", error);
      setIsActivated(false);
      setIsLoading(false);
      if (!location.pathname.includes("/activation-form") && 
          !location.pathname.includes("/activation-details") &&
          location.pathname !== "/") {
        notifications.show({
          title: "Activation Error",
          message: "There was an error checking your activation status. Please reactivate the product.",
          color: "red",
          autoClose: 5000,
        });
        navigate("/");
      }
    }
  };

  useEffect(() => {
    checkActivationStatus();
    const interval = setInterval(checkActivationStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isActivated ? (
            <Navigate to="/login" replace />
          ) : (
            <ProductActivation />
          )
        }
      />
      
      <Route
        path="/activation-form"
        element={
          !isActivated ? (
            <ActivationForm onActivationSuccess={handleActivationSuccess} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route
        path="/login"
        element={isActivated ? <Login /> : <Navigate to="/" replace />}
      />
      <Route
        path="/home"
        element={isActivated ? <Home /> : <Navigate to="/" replace />}
      />

      {/* Activation routes - only accessible if not activated */}
      <Route
        path="/activation-details"
        element={
          !isActivated ? (
            <ActivationDetails />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Other protected routes */}
      <Route
        path="/settings"
        element={isActivated ? <Settings /> : <Navigate to="/" replace />}
      />
      <Route
        path="/sidebar"
        element={isActivated ? <Sidebar /> : <Navigate to="/" replace />}
      />
      <Route
        path="/security"
        element={isActivated ? <Security /> : <Navigate to="/" replace />}
      />
      <Route
        path="/account"
        element={isActivated ? <Account /> : <Navigate to="/" replace />}
      />
      <Route
        path="/users"
        element={isActivated ? <Users /> : <Navigate to="/" replace />}
      />
      <Route
        path="/report"
        element={isActivated ? <Report /> : <Navigate to="/" replace />}
      />
      <Route
        path="/support"
        element={isActivated ? <Support /> : <Navigate to="/" replace />}
      />
      <Route
        path="/featurecard"
        element={isActivated ? <FeatureCard /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
};

const App = () => {
  return (
    <HashRouter>
      <Notifications position="top-right" />
      <AppContent />
    </HashRouter>
  );
};

export default App;
