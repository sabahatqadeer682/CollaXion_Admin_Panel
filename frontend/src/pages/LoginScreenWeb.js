import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginScreenWeb = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const validate = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {

            navigate("/dashboard");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Admin Login</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                        />
                        {errors.email && <p style={styles.error}>{errors.email}</p>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />
                        {errors.password && <p style={styles.error}>{errors.password}</p>}
                    </div>

                    <button type="submit" style={styles.button}>
                        Login
                    </button>
                </form>
            </div>
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
    formContainer: {
        background: "#FFFFFF",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        width: "350px",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#193648",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    inputGroup: {
        marginBottom: "15px",
        display: "flex",
        flexDirection: "column",
    },
    input: {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        marginTop: "5px",
        fontSize: "1rem",
    },
    error: {
        color: "red",
        fontSize: "0.85rem",
        marginTop: "5px",
    },
    button: {
        padding: "12px",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "#193648",
        color: "white",
        fontSize: "1rem",
        cursor: "pointer",
        marginTop: "10px",
    },
};

export default LoginScreenWeb;
