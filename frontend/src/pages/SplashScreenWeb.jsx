// src/pages/SplashScreenWeb.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoginScreenWeb from "./LoginScreenWeb";
import collaxionLogo from "../images/collaxionlogo.jpeg";

const letters = ["C", "o", "l", "l", "a", "X", "i", "o", "n"];

const SplashScreenWeb = () => {
  const [showText, setShowText] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [goToLogin, setGoToLogin] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowText(true), 1500),  // Show CollaXion text
      setTimeout(() => setShowTagline(true), 3200), // Tagline appear
      setTimeout(() => setGoToLogin(true), 5500),   // Go to login
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (goToLogin) return <LoginScreenWeb />;

  return (
    <div style={styles.container}>
      {/* Step 1: Logo animation */}
      {!showText && (
        <motion.img
          src={collaxionLogo}
          alt="CollaXion Logo"
          style={styles.logo}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
      )}

      {/* Step 2: CollaXion animated text */}
      {showText && (
        <motion.h1 style={styles.title}>
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12, duration: 0.35 }}
              style={letter === "X" ? styles.xLetter : {}}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>
      )}

      {/* Step 3: Tagline */}
      {showTagline && (
        <motion.p
          style={styles.tagline}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Where Collaboration Meets Innovation
        </motion.p>
      )}
    </div>
  );
};

// 🎨 Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #f4f8fc 0%, #e4edf7 100%)",
    fontFamily: "'Poppins', sans-serif",
    overflow: "hidden",
  },
  logo: {
    width: "110px",
    height: "110px",
    borderRadius: "20px",
    marginBottom: "8px", // less gap between logo and text
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
  },
  title: {
    fontSize: "3.3rem",
    fontWeight: "800",
    color: "#193648",
    textShadow: "1.5px 1.5px 6px rgba(0,0,0,0.18)",
    display: "flex",
    gap: "2px", // tight letters
    lineHeight: "1", // removes extra vertical space
  },
  xLetter: {
    background: "linear-gradient(90deg, #3a70b0, #193648)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  tagline: {
    fontSize: "1.05rem",
    color: "#193648",
    marginTop: "4px", // 🔹 tightened spacing
    fontWeight: "500",
    opacity: 0.95,
    letterSpacing: "0.5px",
  },
};

export default SplashScreenWeb;
