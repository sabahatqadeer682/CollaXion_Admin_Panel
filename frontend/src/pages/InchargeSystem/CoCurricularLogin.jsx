

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../images/cocu.jpeg";


const CoCurricularLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // ✅ Hardcoded Admin Credentials
    const CoCurricular_USERNAME = "co.cu@collaxion.com";
    const CoCurricular_PASSWORD = "cocu123";

    const validate = () => {
        const newErrors = {};
        if (!username) newErrors.username = "Please enter your username";
        if (!password) newErrors.password = "Please enter your password";
        else if (password.length < 6)
            newErrors.password = "Password must be at least 6 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            if (username === CoCurricular_USERNAME && password === CoCurricular_PASSWORD) {
                navigate("/co-curricular-dashboard");
            } else {
                setErrors({
                    password: "Invalid admin credentials. Please try again.",
                });
            }
        }
    };

    // ✅ Animations
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(30px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      input:focus {
        border-color: #193648 !important;
        box-shadow: 0 0 0 3px rgba(25, 54, 72, 0.15);
      }

      button:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(25,54,72,0.3);
      }

      .card {
        transition: all 0.3s ease;
        animation: fadeInUp 1s ease;
      }

      .card:hover {
        transform: translateY(-6px);
      }
    `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    return (
        <div style={styles.mainContainer}>
            {/* Left Section with Background Image */}
            <div style={styles.leftContainer}>
                <div style={styles.overlay}></div>
                <div style={styles.leftContent}>
                    <h1 style={styles.brandTitle}>
                        <span style={{ fontSize: "3.3rem", color: "#fff" }}>C</span>olla
                        <span style={{ fontSize: "3.3rem", color: "#fff" }}>X</span>ion
                    </h1>
                    <p style={styles.brandSubtitle}>
                        Bridging the gap between universities and industries.
                    </p>
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div style={styles.rightContainer}>
                <div className="card" style={styles.card}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="Admin Avatar"
                        style={styles.logo}
                    />

                    <h2 style={styles.title}>Welcome Back</h2>
                    <p style={styles.subtitle}>Login to your Co-Curricular dashboard</p>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Username</label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    ...styles.input,
                                    borderColor: errors.username ? "#e63946" : "#d1d5db",
                                }}
                            />
                            {errors.username && (
                                <p style={styles.error}>{errors.username}</p>
                            )}
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    ...styles.input,
                                    borderColor: errors.password ? "#e63946" : "#d1d5db",
                                }}
                            />
                            {errors.password && (
                                <p style={styles.error}>{errors.password}</p>
                            )}
                        </div>

                        <button type="submit" style={styles.button}>
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// 🎨 Elegant Glassmorphic Styles
const styles = {
    mainContainer: {
        display: "flex",
        height: "100vh",
        fontFamily: "'Poppins', sans-serif",
    },
    leftContainer: {
        flex: 1,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(25, 54, 72, 0.7)",
        backdropFilter: "blur(6px)",
    },
    leftContent: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "#fff",
        textAlign: "center",
        width: "80%",
    },
    brandTitle: {
        fontSize: "3rem",
        fontWeight: "700",
        color: "#fff",
        letterSpacing: "3px",
    },
    brandSubtitle: {
        fontSize: "1.1rem",
        lineHeight: 1.6,
        opacity: 0.9,
    },
    rightContainer: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #E2EEF9, #FFFFFF)",
    },
    card: {
        width: "400px",
        background: "rgba(255, 255, 255, 0.25)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.4)",
        borderRadius: "18px",
        padding: "45px 40px",
        textAlign: "center",
        boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
    },
    logo: {
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        marginBottom: "15px",
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
    },
    title: {
        fontSize: "1.8rem",
        color: "#193648",
        fontWeight: "700",
        marginBottom: "6px",
    },
    subtitle: {
        fontSize: "0.95rem",
        color: "#6b7280",
        marginBottom: "25px",
    },
    form: {
        textAlign: "left",
    },
    inputGroup: {
        marginBottom: "20px",
    },
    label: {
        fontSize: "0.95rem",
        color: "#374151",
        marginBottom: "6px",
        display: "block",
    },
    input: {
        width: "100%",
        padding: "12px 14px",
        fontSize: "1rem",
        borderRadius: "10px",
        border: "1px solid #d1d5db",
        outline: "none",
        transition: "all 0.3s ease",
        backgroundColor: "rgba(255,255,255,0.8)",
    },
    error: {
        color: "#e63946",
        fontSize: "0.85rem",
        marginTop: "5px",
    },
    button: {
        width: "100%",
        padding: "12px",
        background: "linear-gradient(90deg, #193648, #234c6b)",
        color: "#fff",
        fontSize: "1rem",
        fontWeight: "600",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
};

export default CoCurricularLogin;
