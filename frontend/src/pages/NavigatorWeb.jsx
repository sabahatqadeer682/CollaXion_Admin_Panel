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
import EventCreation from "./EventCreation";
import SystemSettings from "./SystemSettings";
import IndustryActiveness from "./IndustryActiveness";
import IndustryProjects from "./IndustryProjects";
import RatingsFeedback from "./RatingsFeedback";


import InternshipLogin from "../pages/InchargeSystem/InternshipLogin";
import InternshipDashboard from "./InchargeSystem/InternshipDashboard";
import CoCurricularDashboard from "./InchargeSystem/CoCurricularDashboard";
import CoCurricularLogin from "./InchargeSystem/CoCurricularLogin";



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
        <Route path="/event-creation" element={<EventCreation />} />
        <Route path="/system-settings" element={<SystemSettings />} />
        <Route path="/industry-activeness" element={<IndustryActiveness />} />
        <Route path="/industry-projects" element={<IndustryProjects />} />
        <Route path="/ratings-feedback" element={<RatingsFeedback />} />
        <Route path="/internship-login" element={<InternshipLogin />} />
        <Route path="/internship-dashboard" element={<InternshipDashboard />} />
        <Route path="/co-curricular-login" element={<CoCurricularLogin />} />
        <Route path="/co-curricular-dashboard" element={<CoCurricularDashboard />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default NavigatorWeb;
