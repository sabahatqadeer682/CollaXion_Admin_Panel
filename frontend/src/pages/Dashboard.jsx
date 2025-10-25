// src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/maindashboard"); // Redirect to main dashboard after 3s
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to CollaXion Dashboard</h1>
      <p style={styles.text}>This is the admin dashboard after login.</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "'Poppins', sans-serif",
    background: "#E2EEF9",
  },
  title: {
    color: "#193648",
    fontSize: "2rem",
    marginBottom: "10px",
  },
  text: {
    color: "#193648",
    fontSize: "1.2rem",
  },
};

export default Dashboard;
