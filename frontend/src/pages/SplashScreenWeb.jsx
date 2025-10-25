import React, { useEffect, useState } from "react";
import LoginScreenWeb from "./LoginScreenWeb";

const SplashScreenWeb = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 500),   // CX appears
      setTimeout(() => setStep(2), 1800),  // letters generate
      setTimeout(() => setStep(3), 3200),  // tagline fade
      setTimeout(() => setStep(4), 5200),  // move to login
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (step >= 4) {
    return <LoginScreenWeb />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.logoWrapper}>
        {/* Step 1 — CX Logo */}
        {step === 1 && (
          <div className="cx-start">
            <span className="c">C</span>
            <span className="x">X</span>
          </div>
        )}

        {/* Step 2 — Morph into CollaXion */}
        {step >= 2 && (
          <div className="collaxion">
            <span className="c moveC">C</span>
            <span className="midletters">olla</span>
            <span className="x moveX">X</span>
            <span className="endletters">ion</span>
          </div>
        )}
      </div>

      {/* Step 3 — Tagline */}
      {step >= 3 && (
        <p className="tagline">Where Collaboration Meets Innovation</p>
      )}

      <style>{`
        /* ================= BASE ================ */
        .cx-start {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 5rem;
          color: #193648;
          letter-spacing: -5px;
          opacity: 0;
          animation: fadeInScale 1.2s ease forwards;
        }

        .cx-start .x {
          background: linear-gradient(90deg, #3a70b0, #193648);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-left: -6px;
        }

        .collaxion {
          font-weight: 700;
          font-size: 4.2rem;
          color: #193648;
          display: inline-flex;
          opacity: 0;
          animation: fadeInWord 1s ease forwards;
          position: relative;
          letter-spacing: 2px;
        }

        .moveC {
          animation: moveC 1.6s ease forwards;
          display: inline-block;
        }

        .moveX {
          animation: moveX 1.6s ease forwards;
          display: inline-block;
          background: linear-gradient(90deg, #3a70b0, #193648);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .midletters,
        .endletters {
          opacity: 0;
          animation: fadeInLetters 1.3s ease forwards;
          animation-delay: 0.6s;
        }

        .tagline {
          margin-top: 20px;
          font-size: 1.1rem;
          color: #1f2e57;
          font-weight: 500;
          opacity: 0;
          transform: translateY(10px);
          animation: taglineFade 1.3s ease forwards;
        }

        /* ================= ANIMATIONS ================ */
        @keyframes fadeInScale {
          0% { transform: scale(0.7); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes fadeInWord {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes fadeInLetters {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes moveC {
          0% { transform: translateX(40px) scale(1.4); opacity: 0.8; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }

        @keyframes moveX {
          0% { transform: translateX(-50px) scale(1.4); opacity: 0.8; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }

        @keyframes taglineFade {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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
    background: "linear-gradient(135deg, #eaf1fb 0%, #dce8f6 40%, #b3cdee 100%)",
    fontFamily: "'Poppins', sans-serif",
    overflow: "hidden",
  },
  logoWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default SplashScreenWeb;
