import React, { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
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

const App = () => {
  const [isActivated, setIsActivated] = React.useState(null);

  useEffect(() => {
    // Check activation status on app load
    const checkActivation = async () => {
      const activated = await window.electronAPI.checkActivation();
      setIsActivated(activated);
    };

    checkActivation();

    // Listen for activation status changes
    window.electronAPI.onActivationCheck((event, status) => {
      setIsActivated(status);
    });
  }, []);

  // Show loading state while checking activation
  if (isActivated === null) {
    return <div>Loading...</div>;
  }

  return (
    <HashRouter>
      <Notifications position="top-right" />
      <Routes>
        {/* Redirect to activation if not activated */}
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
        {/* Protected routes - only accessible if activated */}
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
        <Route
          path="/activation-form"
          element={
            !isActivated ? <ActivationForm /> : <Navigate to="/login" replace />
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
    </HashRouter>
  );
};

export default App;
