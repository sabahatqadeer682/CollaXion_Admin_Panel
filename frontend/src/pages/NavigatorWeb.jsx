// src/pages/NavigatorWeb.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SplashScreenWeb from "./SplashScreenWeb";
import LoginScreenWeb from "./LoginScreenWeb";
import Dashboard from "./Dashboard";
import MainDashboardWeb from "./MainDashboardWeb";
import MouManagement from "./MouManagement";
import NearbyIndustries from "./NearbyIndustries";
import AdvisoryMeetings from "./AdvisoryMeetings";

const NavigatorWeb = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreenWeb />} />
        <Route path="/login" element={<LoginScreenWeb />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/maindashboard" element={<MainDashboardWeb />} />
        <Route path="/mou-management" element={<MouManagement />} />
        <Route path="/AdvisoryMeetings" element={<AdvisoryMeetings />} />
        <Route path="/nearby-industries" element={<NearbyIndustries />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default NavigatorWeb;
