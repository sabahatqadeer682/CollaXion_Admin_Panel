// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import collaxionLogo from "../images/collaxionlogo.jpeg"; 

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            navigate("/maindashboard");
        }, 3000); // 3 seconds splash screen

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={styles.container}>
            <AnimatePresence>
                {loading && (
                    <motion.div
                        style={styles.loaderContainer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.img
                            src={collaxionLogo}
                            alt="CollaXion Logo"
                            style={styles.logo}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        />
                        <motion.div
                            style={styles.loaderDots}
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <span style={styles.dot}></span>
                            <span style={styles.dot}></span>
                            <span style={styles.dot}></span>
                        </motion.div>
                        <motion.h1
                            style={styles.title}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Welcome to CollaXion
                        </motion.h1>
                        <motion.p
                            style={styles.text}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            Loading dashboard...
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#E2EEF9",
        fontFamily: "'Poppins', sans-serif",
    },
    loaderContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
    },
    logo: {
        width: "80px",
        height: "80px",
        borderRadius: "20px",
        marginBottom: "10px",
    },
    loaderDots: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
    },
    dot: {
        width: "10px",
        height: "10px",
        backgroundColor: "#193648",
        borderRadius: "50%",
        display: "inline-block",
    },
    title: {
        fontSize: "1.8rem",
        color: "#193648",
        fontWeight: "700",
    },
    text: {
        fontSize: "1.1rem",
        color: "#193648",
    },
};

export default Dashboard;
