import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import ProductActivation from "./ProductActivation.jsx";
import ActivationForm from "./ActivationForm.jsx";
import ActivationDetails from "./ActivationDetails.jsx";
import Login from "./Login.jsx";

const App = () => {
  return (
    <HashRouter>
      <Notifications position="top-right" />
      <Routes>
        <Route path="/" element={<ProductActivation />} />
        <Route path="/activation-details" element={<ActivationDetails />} />
        <Route path="/activation-form" element={<ActivationForm />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
