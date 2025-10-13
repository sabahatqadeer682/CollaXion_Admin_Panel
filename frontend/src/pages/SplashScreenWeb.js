import React, { useEffect, useState } from "react";
import LoginScreenWeb from "./LoginScreenWeb";

const SplashScreenWeb = () => {
    const [showFullText, setShowFullText] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {

        const highlightTimer = setTimeout(() => {
            setShowFullText(true);
        }, 1500);


        const finishTimer = setTimeout(() => {
            setShowLogin(true);
        }, 3000);

        return () => {
            clearTimeout(highlightTimer);
            clearTimeout(finishTimer);
        };
    }, []);

    const handleLogin = (credentials) => {
        console.log("Login attempted:", credentials);

    };


    if (showLogin) {
        return <LoginScreenWeb onLogin={handleLogin} />;
    }

    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to bottom, #aa9b9bff, #E2EEF9, #AAC3FC)",
        fontFamily: "'Poppins', sans-serif",
    };

    const logoWrapperStyle = {
        position: "relative",
        width: "350px",
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const cxStyle = {
        color: "#193648",
        fontSize: "4rem",
        fontWeight: "bold",
        position: "absolute",
        left: "50%",
        transform: showFullText
            ? "translateX(-50%) scale(1)"
            : "translateX(-50%) scale(1.8) rotate(-10deg)",
        opacity: showFullText ? 0 : 1,
        transition: "all 0.7s ease-in-out",
        mixBlendMode: "multiply",
    };

    const fullTextStyle = {
        color: "#193648",
        fontSize: "4rem",
        fontWeight: "bold",
        opacity: showFullText ? 1 : 0,
        transform: showFullText ? "translateY(0)" : "translateY(-20px)",
        transition: "opacity 0.8s ease-in-out, transform 0.8s ease-in-out",
        letterSpacing: "3px",
        textAlign: "center",
        width: "100%",
        position: "absolute",
        left: 0,
    };

    const taglineStyle = {
        fontSize: "1.2rem",
        color: "#FFFFFF",
        opacity: showFullText ? 1 : 0,
        transition: "opacity 1s ease-in",
        marginTop: "15px",
        textAlign: "center",
    };

    return (
        <div style={containerStyle}>
            <div style={logoWrapperStyle}>
                <span style={cxStyle}>C</span>
                <span
                    style={{
                        ...cxStyle,
                        left: "calc(50% + 40px)",
                        transform: showFullText
                            ? "scale(1)"
                            : "translateX(-50%) scale(1.8) rotate(10deg)",
                    }}
                >
                    X
                </span>
                <span style={fullTextStyle}>CollaXion</span>
            </div>
            <p style={taglineStyle}>Where Collaboration Meets Innovation</p>
        </div>
    );
};

export default SplashScreenWeb;
