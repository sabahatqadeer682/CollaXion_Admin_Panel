import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email) {
            setError("Please enter your email address");
            setMessage("");
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address");
            setMessage("");
            return;
        }

        // reset email sent
        setError("");
        setMessage("Password reset link sent to your email!");
        setTimeout(() => navigate("/"), 2000);
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                <h2 style={styles.title}>Forgot Password?</h2>
                <p style={styles.subtitle}>
                    Enter your email address to reset your password.
                </p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Email Address</label>
                    <input
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                    />
                    {error && <p style={styles.error}>{error}</p>}
                    {message && <p style={styles.success}>{message}</p>}

                    <button type="submit" style={styles.button}>
                        Send Reset Link
                    </button>
                </form>

                <p style={styles.footerText}>
                    Back to{" "}
                    <span
                        style={styles.link}
                        onClick={() => navigate("LoginScreenWeb")}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background:
            "linear-gradient(135deg, #e3f2fd 0%, #f9fbfc 50%, #e3f2fd 100%)",
        fontFamily: "'Poppins', sans-serif",
    },
    card: {
        width: "400px",
        background: "#fff",
        borderRadius: "14px",
        padding: "40px 45px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        textAlign: "center",
    },
    title: {
        fontSize: "1.6rem",
        color: "#193648",
        marginBottom: "8px",
    },
    subtitle: {
        fontSize: "0.95rem",
        color: "#6b7280",
        marginBottom: "25px",
    },
    form: {
        textAlign: "left",
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
        border: "1px solid #ccc",
        outline: "none",
        transition: "all 0.3s ease",
    },
    error: {
        color: "#e63946",
        fontSize: "0.85rem",
        marginTop: "5px",
    },
    success: {
        color: "#2e7d32",
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
        marginTop: "15px",
        transition: "background-color 0.3s ease, transform 0.2s ease",
    },
    footerText: {
        marginTop: "20px",
        fontSize: "0.9rem",
        color: "#6b7280",
    },
    link: {
        color: "#193648",
        textDecoration: "none",
        fontWeight: "500",
        cursor: "pointer",
    },
};

export default ForgotPasswordScreen;
