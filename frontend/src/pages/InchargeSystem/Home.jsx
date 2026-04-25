import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import collaxionLogo from "../../images/collaxionlogo.jpeg";

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(40px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)  scale(1); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
`;

const drift1 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(30px, -25px) scale(1.08); }
`;

const drift2 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(-40px, 30px) scale(1.12); }
`;

const drift3 = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.55; }
  50%      { transform: scale(1.15); opacity: 0.75; }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(25,54,72,0.0); }
  50%      { box-shadow: 0 0 0 12px rgba(25,54,72,0.06); }
`;

const shine = keyframes`
  0%   { background-position: -220px 0; }
  100% { background-position:  220px 0; }
`;

const arrowSlide = keyframes`
  0%, 100% { transform: translateX(0); }
  50%      { transform: translateX(5px); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const spinReverse = keyframes`
  from { transform: rotate(360deg); }
  to   { transform: rotate(0deg); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0;   transform: scale(0.6); }
  50%      { opacity: 0.9; transform: scale(1.1); }
`;

const sweep = keyframes`
  0%   { transform: translateX(-120%) skewX(-18deg); }
  100% { transform: translateX(220%)  skewX(-18deg); }
`;

// ─── Page ─────────────────────────────────────────────────────────────────────
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 56px 24px 80px;
  background:
    radial-gradient(circle at 20% 18%, rgba(58,112,176,0.12) 0%, transparent 55%),
    radial-gradient(circle at 80% 82%, rgba(25,54,72,0.10) 0%, transparent 55%),
    linear-gradient(135deg, #FFFFFF 0%, #F4F9FD 55%, #E2EEF9 100%);
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
  color: #193648;
  position: relative;
`;

// Subtle dotted grid
const Grid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(rgba(25,54,72,0.08) 1px, transparent 1px);
  background-size: 28px 28px;
  -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%);
          mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%);
  pointer-events: none;
`;

// Animated blobs
const Blob = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  ${({ variant }) =>
    variant === "a" &&
    css`
      width: 480px; height: 480px;
      top: -10%; left: -8%;
      background: radial-gradient(circle, rgba(25,54,72,0.22) 0%, rgba(25,54,72,0) 70%);
      animation: ${drift1} 11s ease-in-out infinite;
    `}
  ${({ variant }) =>
    variant === "b" &&
    css`
      width: 540px; height: 540px;
      bottom: -12%; right: -10%;
      background: radial-gradient(circle, rgba(58,112,176,0.32) 0%, rgba(58,112,176,0) 70%);
      animation: ${drift2} 13s ease-in-out infinite;
    `}
  ${({ variant }) =>
    variant === "c" &&
    css`
      width: 320px; height: 320px;
      top: 40%; left: 50%;
      background: radial-gradient(circle, rgba(207,224,240,0.55) 0%, rgba(207,224,240,0) 70%);
      animation: ${drift3} 9s ease-in-out infinite;
    `}
`;

// Decorative sparkles scattered around
const Sparkles = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const Spark = styled.span`
  position: absolute;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle, #3A70B0 0%, rgba(58,112,176,0) 70%);
  animation: ${sparkle} 3s ease-in-out infinite;
  ${({ top, left, delay, size }) => css`
    top: ${top}; left: ${left};
    animation-delay: ${delay};
    width: ${size}px; height: ${size}px;
  `}
`;

const ContentWrapper = styled.div`
  z-index: 1;
  position: relative;
  text-align: center;
  max-width: 1240px;
  padding: 0 24px;
  width: 100%;
  animation: ${fadeIn} 0.9s ease-out;
`;

// ── Logo medallion at the top ────────────────────────────────────────────────
const LogoMedallion = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  margin: 0 auto 22px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RingDashed = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px dashed rgba(25,54,72,0.30);
  animation: ${spin} 14s linear infinite;
`;

const RingArc = styled.span`
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  border: 1.5px solid rgba(25,54,72,0.10);
  border-top-color: #193648;
  animation: ${spinReverse} 9s linear infinite;
`;

const RingGlow = styled.span`
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(25,54,72,0.18) 0%, rgba(25,54,72,0) 70%);
`;

const LogoBadge = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fff;
  border: 1.5px solid #E2EEF9;
  box-shadow: 0 14px 40px rgba(25,54,72,0.18), inset 0 0 0 1px rgba(255,255,255,0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 2;
`;

const LogoImg = styled.img`
  width: 50px; height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #E2EEF9;
  color: #193648;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  box-shadow: 0 6px 20px rgba(25,54,72,0.06);
  margin-bottom: 18px;
`;

const SparkleIcon = styled.span`
  color: #3A70B0;
  font-size: 0.85rem;
`;

const Heading = styled.h1`
  font-size: clamp(2.2rem, 4.4vw, 3.4rem);
  font-weight: 900;
  margin: 0 0 12px 0;
  color: #193648;
  letter-spacing: -0.025em;
  line-height: 1.05;
`;

const HeadingAccent = styled.span`
  background: linear-gradient(135deg, #3A70B0 0%, #193648 100%);
  -webkit-background-clip: text;
          background-clip: text;
  -webkit-text-fill-color: transparent;
          color: transparent;
`;

const SubHeading = styled.p`
  font-size: 1.05rem;
  color: #3A70B0;
  margin: 0 0 56px 0;
  letter-spacing: 0.01em;
  font-weight: 500;
`;

const Shimmer = styled.span`
  display: inline-block;
  background: linear-gradient(90deg, #193648 0%, #3A70B0 30%, #193648 70%);
  background-size: 220px 100%;
  -webkit-background-clip: text;
          background-clip: text;
  -webkit-text-fill-color: transparent;
          color: transparent;
  animation: ${shine} 3s linear infinite;
  font-weight: 800;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
  max-width: 1080px;
  margin: 0 auto;

  @media (max-width: 980px)  { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const RoleCard = styled.div`
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(244,249,253,0.92) 100%);
  border: 1.5px solid #E2EEF9;
  border-radius: 24px;
  padding: 30px 26px 28px;
  cursor: pointer;
  transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
  text-align: center;
  box-shadow: 0 12px 34px rgba(25,54,72,0.10);
  animation: ${slideIn} 0.7s ease forwards;
  animation-delay: ${({ $delay }) => $delay || "0s"};
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 350px;
  backdrop-filter: blur(6px);

  /* Top accent bar */
  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 5px;
    background: linear-gradient(90deg, #193648, #3A70B0, #193648);
    background-size: 200% 100%;
    transform-origin: left center;
    transform: scaleX(0.45);
    transition: transform 0.45s ease;
    animation: ${shine} 4s linear infinite;
  }

  /* Top-right radial glow */
  &::after {
    content: "";
    position: absolute;
    top: -50px; right: -50px;
    width: 220px; height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(58,112,176,0.22) 0%, rgba(58,112,176,0) 70%);
    opacity: 0;
    transition: opacity 0.45s ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-10px);
    border-color: rgba(25,54,72,0.45);
    box-shadow: 0 26px 56px rgba(25,54,72,0.20);
  }
  &:hover::before { transform: scaleX(1); }
  &:hover::after  { opacity: 1; }
`;

// Light shine sweep visible on hover
const Sweep = styled.span`
  position: absolute;
  top: 0; left: 0;
  width: 80px; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${RoleCard}:hover & {
    opacity: 1;
    animation: ${sweep} 1.4s ease forwards;
  }
`;

// Conic-gradient rotating glow ring around the icon halo
const HaloRing = styled.span`
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background:
    conic-gradient(from 0deg, #193648, #3A70B0, #E2EEF9, #3A70B0, #193648);
  filter: blur(12px);
  opacity: 0.55;
  animation: ${spin} 8s linear infinite;
`;

const HaloMask = styled.span`
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: #fff;
  z-index: 1;
`;

const IconHalo = styled.div`
  position: relative;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #E2EEF9 0%, #CFE0F0 100%);
  margin-bottom: 18px;
  animation: ${pulse} 3s ease-in-out infinite;
  z-index: 2;
`;

const Illustration = styled.img`
  width: 96px;
  height: 96px;
  object-fit: contain;
  animation: ${float} 3.4s ease-in-out infinite;
  position: relative;
  z-index: 3;
`;

const Tag = styled.span`
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #fff;
  background: linear-gradient(135deg, #193648 0%, #3A70B0 100%);
  padding: 5px 12px;
  border-radius: 999px;
  margin-bottom: 14px;
  box-shadow: 0 6px 14px rgba(25,54,72,0.25);
`;

const CardTitle = styled.h2`
  font-size: 1.22rem;
  color: #193648;
  margin: 0 0 8px 0;
  font-weight: 800;
  letter-spacing: -0.005em;
`;

const CardDescription = styled.p`
  font-size: 0.92rem;
  color: #5b7184;
  line-height: 1.55;
  max-width: 270px;
  margin: 0;
  flex: 1;
`;

const ContinueRow = styled.div`
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 999px;
  background: linear-gradient(135deg, #193648 0%, #2C5F80 100%);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  box-shadow: 0 8px 20px rgba(25,54,72,0.30);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  & > span:last-child {
    display: inline-block;
    animation: ${arrowSlide} 1.4s ease-in-out infinite;
  }

  ${RoleCard}:hover & {
    transform: translateY(-2px);
    box-shadow: 0 12px 26px rgba(25,54,72,0.36);
  }
`;

const Footer = styled.div`
  position: absolute;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  color: #3A70B0;
  letter-spacing: 0.05em;
  font-weight: 500;
`;

const FooterDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22C55E;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.20);
  animation: ${drift3} 4s ease-in-out infinite;
`;

// ─── Component ────────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Industry Liaison Incharge",
      tag:   "Partnerships",
      description: "Manage partnerships, MOUs, and strategic collaborations with industry partners.",
      path: "/login",
      img: "/gifs/handshake.gif",
    },
    {
      title: "Internship Incharge",
      tag:   "Placements",
      description: "Oversee internships, applications, and career-readiness programs efficiently.",
      path: "/internship-login",
      img: "/gifs/evaluate.gif",
    },
    {
      title: "Co-Curricular Incharge",
      tag:   "Engagement",
      description: "Coordinate student events, activities, and on-campus engagement opportunities.",
      path: "/co-curricular-login",
      img: "/gifs/calendar.gif",
    },
  ];

  return (
    <PageContainer>
      <Grid />
      <Blob variant="a" />
      <Blob variant="b" />
      <Blob variant="c" />

      {/* Decorative sparkles */}
      <Sparkles>
        <Spark top="14%"  left="8%"  delay="0s"   size={8} />
        <Spark top="22%"  left="92%" delay="0.6s" size={6} />
        <Spark top="62%"  left="6%"  delay="1.2s" size={7} />
        <Spark top="78%"  left="94%" delay="1.8s" size={9} />
        <Spark top="46%"  left="14%" delay="2.4s" size={5} />
        <Spark top="34%"  left="86%" delay="3s"   size={6} />
        <Spark top="86%"  left="48%" delay="0.9s" size={7} />
        <Spark top="10%"  left="50%" delay="1.5s" size={5} />
      </Sparkles>

      <ContentWrapper>
        <LogoMedallion>
          <RingGlow />
          <RingDashed />
          <RingArc />
          <LogoBadge>
            <LogoImg src={collaxionLogo} alt="CollaXion" />
          </LogoBadge>
        </LogoMedallion>

        <Eyebrow>
          <SparkleIcon>✦</SparkleIcon> CollaXion Admin Suite
        </Eyebrow>
        <Heading>
          Welcome to <HeadingAccent>CollaXion</HeadingAccent>
        </Heading>
        <SubHeading>
          <Shimmer>Select your role</Shimmer> to continue to your workspace
        </SubHeading>

        <CardsContainer>
          {roles.map((role, index) => (
            <RoleCard
              key={index}
              onClick={() => navigate(role.path)}
              $delay={`${0.15 + index * 0.12}s`}
            >
              <Sweep />
              <div style={{ position: "relative", marginBottom: 18 }}>
                <HaloRing />
                <HaloMask />
                <IconHalo>
                  <Illustration src={role.img} alt={role.title} />
                </IconHalo>
              </div>
              <Tag>{role.tag}</Tag>
              <CardTitle>{role.title}</CardTitle>
              <CardDescription>{role.description}</CardDescription>
              <ContinueRow>
                <span>Continue</span>
                <span>→</span>
              </ContinueRow>
            </RoleCard>
          ))}
        </CardsContainer>
      </ContentWrapper>

      <Footer>
        <FooterDot />
        <span>Powered by <strong>CollaXion</strong> · Bridging Academia &amp; Industry</span>
      </Footer>
    </PageContainer>
  );
};

export default Home;
