// src/pages/NavigatorWeb.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SplashScreenWeb from "./SplashScreenWeb";
import LoginScreenWeb from "./LoginScreenWeb";
import Dashboard from "./Dashboard";
import ForgotPasswordScreen from "./ForgotPasswordScreen";

const NavigatorWeb = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SplashScreenWeb />} />
                <Route path="/login" element={<LoginScreenWeb />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="ForgotPassword" element={<ForgotPasswordScreen />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default NavigatorWeb;
