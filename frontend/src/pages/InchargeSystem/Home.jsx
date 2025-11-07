

import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Keyframe animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInButton = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.01); /* Slightly less intense pulse */
  }
  100% {
    transform: scale(1);
  }
`;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #193648; /* Dark theme color remains for depth */
  color: #E2EEF9; /* Light theme color for text */
  font-family: 'Poppins', sans-serif; /* Modern font */
  position: relative;
  overflow: hidden;

  /* Brighter, more active gradient overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(226,238,249,0.8) 0%, rgba(25,54,72,0.6) 70%, rgba(2,0,36,0.4) 100%);
    opacity: 0.9; /* Increased opacity for brighter feel */
    z-index: 1;
  }

  /* Video background effect using a subtle pattern/gradient */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Using your provided image for a dynamic background, adjusting size and opacity */
    background-image: url("https://media.istockphoto.com/id/2218739375/photo/abstract-digital-network-with-glowing-nodes-and-connections.webp?a=1&b=1&s=612x612&w=0&k=20&c=-XWbsf_jNczAQD8esH1bfqEcPBz488WG5bzWw2_wdVQ=");
    background-size: cover; /* Cover the entire area */
    background-position: center;
    opacity: 0.2; /* Slightly increased opacity for more presence */
    z-index: 0;
    animation: ${pulse} 20s infinite alternate ease-in-out; /* Slower, smoother pulse */
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.2); /* Lighter, more transparent background */
  padding: 50px 40px;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); /* Slightly softer shadow */
  text-align: center;
  max-width: 550px; /* Slightly wider */
  width: 90%;
  animation: ${fadeIn} 1s ease-out forwards;
  backdrop-filter: blur(8px); /* More pronounced frosted glass effect */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Subtle light border */
`;

const Heading = styled.h1`
  font-size: 3.2em; /* Even larger heading */
  margin-bottom: 30px; /* Slightly less margin */
  color: #193648; /* Darker heading for contrast against brighter background */
  letter-spacing: 2px;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Lighter text shadow */
  font-weight: 800; /* Bolder font weight */

  @media (max-width: 768px) {
    font-size: 3em;
  }
  @media (max-width: 480px) {
    font-size: 2.2em;
  }
`;

const SubHeading = styled.p`
  font-size: 1.3em;
  color: #193648;
  margin-bottom: 50px;
  font-weight: 500;
  animation: ${fadeIn} 1.2s ease-out forwards;
  animation-delay: 0.5s;
  opacity: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
`;

const StyledButton = styled.button`
  background-color: #193648; /* Dark theme color for buttons */
  color: #E2EEF9; /* Light theme color for button text */
  border: none;
  padding: 18px 40px; /* Larger padding */
  border-radius: 10px; /* More rounded corners */
  cursor: pointer;
  font-size: 1em; /* Larger font size */
  font-weight: 700; /* Bolder font weight */
  letter-spacing: 1.5px;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 350px; /* Wider buttons */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  animation: ${slideInButton} 0.8s ease-out forwards;
  opacity: 0; /* Start hidden for animation */

  &:nth-child(1) { animation-delay: 0.8s; } /* Adjusted delays */
  &:nth-child(2) { animation-delay: 1s; }
  &:nth-child(3) { animation-delay: 1.2s; }

  &:hover {
    background-color: #0d2838; /* Even darker on hover */
    transform: translateY(-7px) scale(1.03); /* More pronounced lift */
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(-3px) scale(0.98);
  }
`;

const Home = () => {
    const navigate = useNavigate();

    return (
        <PageContainer>
            <ContentWrapper>
                <Heading>Welcome!</Heading>
                <SubHeading>Select your position to access the dashboard.</SubHeading>
                <ButtonContainer>
                    <StyledButton onClick={() => navigate("/login")}>
                        Industry Liaison Incharge
                    </StyledButton>
                    <StyledButton onClick={() => navigate("/internship-login")}>
                        Internship Incharge
                    </StyledButton>
                    <StyledButton onClick={() => navigate("/co-curricular-login")}>
                        Co-Curricular Incharge
                    </StyledButton>

                </ButtonContainer>
            </ContentWrapper>
        </PageContainer>
    );
};

export default Home;