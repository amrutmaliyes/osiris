import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
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
  return (
    <HashRouter>
      <Notifications position="top-right" />
      <Routes>
        <Route path="/" element={<ProductActivation />} />
        <Route path="/activation-details" element={<ActivationDetails />} />
        <Route path="/activation-form" element={<ActivationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/Security" element={<Security />} />
        <Route path="/Account" element={<Account />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/Report" element={<Report />} />
        <Route path="/Support" element={<Support />} />
        <Route path="/FeatureCard" element={<FeatureCard />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
