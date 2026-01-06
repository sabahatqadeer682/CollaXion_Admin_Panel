import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

// Page Styles
const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top left, #E2EEF9, #cfdde8);
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
  color: #193648;
  position: relative;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(25, 54, 72, 0.1) 100%
  );
  backdrop-filter: blur(18px);
  z-index: 0;
`;

const ContentWrapper = styled.div`
  z-index: 1;
  text-align: center;
  max-width: 1300px;
  padding: 40px;
  animation: ${fadeIn} 1s ease-out;
`;

const Heading = styled.h1`
  font-size: 3em;
  font-weight: 700;
  margin-bottom: 10px;
  color: #193648;
  letter-spacing: 1px;
`;

const SubHeading = styled.p`
  font-size: 1.2em;
  color: #405e74;
  margin-bottom: 60px;
`;

const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: nowrap;
`;

const RoleCard = styled.div`
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(25, 54, 72, 0.25);
  border-radius: 20px;
  padding: 25px 25px 35px 25px;
  width: 320px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 0 8px 25px rgba(25, 54, 72, 0.15);
  animation: ${slideIn} 0.9s ease forwards;
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid #193648;
    box-shadow: 0 10px 35px rgba(25, 54, 72, 0.25);
  }
`;

const Illustration = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 20px;
  animation: ${float} 3s ease-in-out infinite;
`;

const CardTitle = styled.h2`
  font-size: 1.3em;
  color: #193648;
  margin-bottom: 10px;
  font-weight: 600;
`;

const CardDescription = styled.p`
  font-size: 0.95em;
  color: #405e74;
  line-height: 1.4;
  max-width: 260px;
`;

const Home = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Industry Liaison Incharge",
      description: "Manage partnerships, MoUs, and collaborations with industries.",
      path: "/login",
      img: "/gifs/handshake.gif", // from public/gifs
    },
    {
      title: "Internship Incharge",
      description: "Oversee internships, placements, and career programs efficiently.",
      path: "/internship-login",
      img: "/gifs/evaluate.gif", // from public/gifs
    },
    {
      title: "Co-Curricular Incharge",
      description: "Coordinate events, activities, and engagement opportunities for students.",
      path: "/co-curricular-login",
      img: "/gifs/calendar.gif", // from public/gifs
    },
  ];

  return (
    <PageContainer>
      <BackgroundOverlay />
      <ContentWrapper>
        <Heading>Welcome to CollaXion</Heading>
        <SubHeading>Select your role to continue</SubHeading>
        <CardsContainer>
          {roles.map((role, index) => (
            <RoleCard key={index} onClick={() => navigate(role.path)}>
              <Illustration src={role.img} alt={role.title} />
              <CardTitle>{role.title}</CardTitle>
              <CardDescription>{role.description}</CardDescription>
            </RoleCard>
          ))}
        </CardsContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default Home;
