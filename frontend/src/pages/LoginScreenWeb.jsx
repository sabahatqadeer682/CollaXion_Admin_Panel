import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginScreenWeb = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // ✅ Hardcoded Admin Credentials
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";

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
            // ✅ Check hardcoded credentials
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                navigate("/dashboard");
            } else {
                setErrors({
                    general: "Invalid admin credentials. Please try again.",
                });
            }
        }
    };

    return (
        <div style={styles.mainContainer}>
            {/* Left Section */}
            <div style={styles.leftContainer}>
                <div style={styles.overlay}></div>
                <div style={styles.leftContent}>
                    <h1 style={styles.brandTitle}>CollaXion Admin</h1>
                    <p style={styles.brandSubtitle}>
                        Streamline university & industry collaboration.
                    </p>
                </div>
            </div>

            {/* Right Section (Login Card) */}
            <div style={styles.rightContainer}>
                <div style={styles.card}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        alt="Admin Avatar"
                        style={styles.logo}
                    />

                    <h2 style={styles.title}>Welcome Back</h2>
                    <p style={styles.subtitle}>Login to your admin dashboard</p>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        {errors.general && (
                            <p style={{ ...styles.error, textAlign: "center" }}>
                                {errors.general}
                            </p>
                        )}

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

// 🔹 Styles
const styles = {
    mainContainer: {
        display: "flex",
        height: "100vh",
        fontFamily: "'Poppins', sans-serif",
    },
    leftContainer: {
        flex: 1,
        backgroundImage:
            "url('https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=1600&q=80')",
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
        fontSize: "2rem",
        fontWeight: "700",
        marginBottom: "10px",
    },
    brandSubtitle: {
        fontSize: "1rem",
        lineHeight: 1.6,
        opacity: 0.9,
    },
    rightContainer: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
            "linear-gradient(135deg, #f7fafc 0%, #e9f1f8 50%, #f7fafc 100%)",
    },
    card: {
        width: "380px",
        background: "#fff",
        padding: "40px 45px",
        borderRadius: "14px",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    logo: {
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        marginBottom: "10px",
    },
    title: {
        fontSize: "1.6rem",
        color: "#193648",
        fontWeight: "600",
        marginBottom: "5px",
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
        marginBottom: "18px",
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
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        outline: "none",
        transition: "all 0.3s ease",
    },
    error: {
        color: "#e63946",
        fontSize: "0.85rem",
        marginTop: "5px",
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#193648",
        color: "#fff",
        fontSize: "1rem",
        fontWeight: "600",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.3s ease",
    },
};

export default LoginScreenWeb;
