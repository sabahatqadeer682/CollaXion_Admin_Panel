import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import {
  Handshake,
  FileSignature,
  GraduationCap,
  CalendarDays,
  Building2,
  BellRing,
  LayoutDashboard,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Users,
  Award,
} from "lucide-react";
import collaxionLogo from "../../images/collaxionlogo.jpeg";

// ── Count-up hook for stat numbers ────────────────────────────────────────────
const useCountUp = (target, duration = 1400) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now) => {
              const p = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(Math.round(target * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return [val, ref];
};

// ── Reveal-on-scroll hook ─────────────────────────────────────────────────────
const useReveal = (threshold = 0.18) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setShown(true)),
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [shown, ref];
};

// ── Scroll-progress hook (top progress bar) ───────────────────────────────────
const useScrollProgress = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setPct(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return pct;
};

// ── Mouse-tilt hook (3D card tilt) ────────────────────────────────────────────
const useTilt = (max = 7) => {
  const ref = useRef(null);
  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateY(-12px) scale(1.02)`;
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  };
  return { ref, onMouseMove, onMouseLeave };
};

// ── Magnetic-glow hook (cursor-follow glow inside an element) ────────────────
const useMagneticGlow = () => {
  const ref = useRef(null);
  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - r.left}px`);
    el.style.setProperty("--gy", `${e.clientY - r.top}px`);
  };
  return { ref, onMouseMove };
};

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

const letterIn = keyframes`
  0%   { opacity: 0; transform: translateY(60px) rotateX(80deg) scale(0.6); filter: blur(8px); }
  60%  { opacity: 1; filter: blur(0); }
  100% { opacity: 1; transform: none; filter: none; }
`;

const accentGradientPan = keyframes`
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const caretBlink = keyframes`
  0%, 49%   { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const accentGlow = keyframes`
  0%, 100% { text-shadow: 0 0 0 rgba(58,112,176,0); }
  50%      { text-shadow: 0 0 22px rgba(58,112,176,0.45); }
`;

const eyebrowIn = keyframes`
  0%   { opacity: 0; transform: translateY(-8px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const subShine = keyframes`
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`;

const subIn = keyframes`
  0%   { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
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

const marqueeMove = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

const countUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const revealUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const borderSpin = keyframes`
  to { transform: rotate(360deg); }
`;

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
`;

const tilt = keyframes`
  0%, 100% { transform: rotate(-1deg); }
  50%      { transform: rotate(1deg); }
`;

// ── Top scroll progress bar ──────────────────────────────────────────────────
const ScrollProgress = styled.div`
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  width: ${({ $w }) => $w}%;
  background: linear-gradient(90deg, #193648 0%, #3A70B0 60%, #7AA9D6 100%);
  z-index: 100;
  transition: width 0.12s ease-out;
  box-shadow: 0 0 18px rgba(58,112,176,0.55);
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
      background: radial-gradient(circle, rgba(25,54,72,0.14) 0%, rgba(25,54,72,0) 70%);
      animation: ${drift1} 14s ease-in-out infinite;
    `}
  ${({ variant }) =>
    variant === "b" &&
    css`
      width: 540px; height: 540px;
      bottom: -12%; right: -10%;
      background: radial-gradient(circle, rgba(58,112,176,0.20) 0%, rgba(58,112,176,0) 70%);
      animation: ${drift2} 16s ease-in-out infinite;
    `}
  ${({ variant }) =>
    variant === "c" &&
    css`
      width: 320px; height: 320px;
      top: 40%; left: 50%;
      background: radial-gradient(circle, rgba(207,224,240,0.40) 0%, rgba(207,224,240,0) 70%);
      animation: ${drift3} 12s ease-in-out infinite;
    `}
`;

// Floating geometric ornaments (slow drift)
const Ornaments = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
`;

const Ornament = styled.span`
  position: absolute;
  border-radius: 22%;
  border: 1.5px solid rgba(58,112,176,0.22);
  background: linear-gradient(135deg, rgba(255,255,255,0.65), rgba(226,238,249,0.30));
  backdrop-filter: blur(2px);
  box-shadow: 0 12px 26px rgba(25,54,72,0.06);
  ${({ $top, $left, $size, $rot, $dur, $delay }) => css`
    top: ${$top};
    left: ${$left};
    width: ${$size}px;
    height: ${$size}px;
    transform: rotate(${$rot}deg);
    animation: ${float} ${$dur || "8s"} ease-in-out infinite;
    animation-delay: ${$delay || "0s"};
  `}
`;

const OrnamentRing = styled.span`
  position: absolute;
  border-radius: 50%;
  border: 1.5px dashed rgba(25,54,72,0.18);
  ${({ $top, $left, $size, $dur, $delay }) => css`
    top: ${$top};
    left: ${$left};
    width: ${$size}px;
    height: ${$size}px;
    animation: ${spin} ${$dur || "30s"} linear infinite;
    animation-delay: ${$delay || "0s"};
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
  opacity: 0;
  animation: ${eyebrowIn} 0.6s 0.05s cubic-bezier(0.22, 1, 0.36, 1) forwards;
`;

const SparkleIcon = styled.span`
  color: #3A70B0;
  font-size: 0.85rem;
`;

const Heading = styled.h1`
  font-size: clamp(2.2rem, 4.4vw, 3.4rem);
  font-weight: 900;
  margin: 0 0 14px 0;
  color: #193648;
  letter-spacing: -0.025em;
  line-height: 1.08;
  perspective: 800px;
`;

const HeadingWord = styled.span`
  display: inline-block;
  white-space: nowrap;
`;

const HeadingLetter = styled.span`
  display: inline-block;
  opacity: 0;
  animation: ${letterIn} 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: ${({ $delay }) => $delay || "0s"};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: geometricPrecision;
`;

const HeadingAccent = styled.span`
  color: #193648;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: geometricPrecision;
`;

const HeadingCaret = styled.span`
  display: inline-block;
  width: 4px;
  height: 0.85em;
  background: #193648;
  vertical-align: -0.10em;
  margin-left: 8px;
  border-radius: 2px;
  opacity: 0;
  animation: ${eyebrowIn} 0.5s 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards,
             ${caretBlink} 1s 2.7s steps(1, end) infinite;
`;

const SubHeading = styled.p`
  font-size: 1.05rem;
  color: #193648;
  margin: 0 0 56px 0;
  letter-spacing: 0.01em;
  font-weight: 500;
  opacity: 0;
  animation: ${subIn} 0.7s 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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
  gap: 32px;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 980px)  { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const RoleCard = styled.div`
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(244,249,253,0.92) 100%);
  border: 1px solid #E2EEF9;
  border-radius: 24px;
  padding: 24px 28px 22px;
  cursor: pointer;
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  text-align: center;
  box-shadow: 0 8px 24px rgba(25,54,72,0.06), 0 1px 2px rgba(25,54,72,0.04);
  animation: ${slideIn} 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: ${({ $delay }) => $delay || "0s"};
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  min-height: 280px;
  will-change: transform;
  backdrop-filter: blur(6px);
  transform-style: preserve-3d;

  /* Top accent bar - uses role accent if provided */
  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 5px;
    background: ${({ $accent }) =>
      $accent || "linear-gradient(90deg, #193648, #3A70B0, #193648)"};
    background-size: 200% 100%;
    transform-origin: left center;
    transform: scaleX(0.5);
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    animation: ${shine} 4s linear infinite;
  }

  /* Top-right radial glow - uses role accent */
  &::after {
    content: "";
    position: absolute;
    top: -50px; right: -50px;
    width: 240px; height: 240px;
    border-radius: 50%;
    background: ${({ $glow }) =>
      $glow || "radial-gradient(circle, rgba(58,112,176,0.22) 0%, rgba(58,112,176,0) 70%)"};
    opacity: 0;
    transition: opacity 0.45s ease;
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(58,112,176,0.40);
    box-shadow: 0 30px 56px rgba(25,54,72,0.20), 0 4px 12px rgba(25,54,72,0.08);
  }
  &:hover::before { transform: scaleX(1); }
  &:hover::after  { opacity: 1; }
`;

const Card3DLayer = styled.div`
  transform: translateZ(0);
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  ${RoleCard}:hover & { transform: translateZ(${({ $z }) => $z || 30}px); }
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
  width: 110px;
  height: 110px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #E2EEF9 0%, #CFE0F0 100%);
  animation: ${pulse} 3s ease-in-out infinite;
  z-index: 2;
`;

const Illustration = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffffff;
  box-shadow: 0 8px 18px rgba(25,54,72,0.22);
  animation: ${float} 3.4s ease-in-out infinite;
  position: relative;
  z-index: 3;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #fff;
  background: ${({ $bg }) =>
    $bg || "linear-gradient(135deg, #193648 0%, #3A70B0 100%)"};
  padding: 5px 12px;
  border-radius: 999px;
  margin: 0;
  box-shadow: 0 6px 14px rgba(25,54,72,0.22);

  & svg { stroke-width: 2.5; }
`;

const CardBullets = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
`;

const Bullet = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: #2c4a5e;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-align: left;

  & svg { stroke-width: 2.4; color: #3A70B0; flex-shrink: 0; }
`;

const LiveDot = styled.span`
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #22C55E;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.18);
  animation: ${pulse} 2.4s ease-in-out infinite;
`;

const CardTitle = styled.h2`
  font-size: 1.18rem;
  color: #193648;
  margin: 0 0 4px 0;
  font-weight: 800;
  letter-spacing: -0.005em;
  text-align: center;
`;

const CardDescription = styled.p`
  font-size: 0.88rem;
  color: #5b7184;
  line-height: 1.5;
  max-width: 280px;
  margin: 0 auto;
  text-align: center;
`;

const ContinueRow = styled.div`
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 6px;
  background: linear-gradient(135deg, #193648 0%, #2C5F80 100%);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  box-shadow: 0 10px 22px rgba(25,54,72,0.28);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;

  & svg {
    stroke-width: 2.4;
    animation: ${arrowSlide} 1.6s ease-in-out infinite;
  }

  ${RoleCard}:hover & {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba(25,54,72,0.34);
  }
`;

// ── "Trusted by" lower strip ─────────────────────────────────────────────────
const TrustedSection = styled.section`
  margin: 64px auto 0;
  max-width: 1080px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const TrustedEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #3A70B0;
  margin-bottom: 18px;

  &::before, &::after {
    content: "";
    width: 32px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(58,112,176,0.55), transparent);
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  perspective: 1200px;

  @media (max-width: 820px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`;

const StatTile = styled.div`
  background: linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(244,249,253,0.92) 100%);
  border: 1px solid #E2EEF9;
  border-radius: 18px;
  padding: 18px 20px 16px;
  text-align: left;
  backdrop-filter: blur(6px);
  box-shadow: 0 10px 26px rgba(25,54,72,0.07);
  position: relative;
  overflow: hidden;
  animation: ${countUp} 0.7s ease both;
  animation-delay: ${({ $delay }) => $delay || "0s"};
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.4s ease, border-color 0.4s ease;
  cursor: default;
  will-change: transform;

  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, #193648, #3A70B0, #193648);
    background-size: 200% 100%;
    animation: ${shine} 4s linear infinite;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at var(--mx, 50%) var(--my, 50%),
      rgba(58,112,176,0.18) 0%,
      rgba(58,112,176,0) 55%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover {
    box-shadow: 0 22px 42px rgba(25,54,72,0.18);
    border-color: rgba(58,112,176,0.35);
  }
  &:hover::after { opacity: 1; }
`;

const StatTileLayer = styled.div`
  transform: translateZ(0);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  ${StatTile}:hover & { transform: translateZ(${({ $z }) => $z || 24}px); }
`;

const StatHead = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
`;

const StatIconBox = styled.div`
  width: 32px; height: 32px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #E2EEF9 0%, #CFE0F0 100%);
  color: #193648;
  border: 1px solid rgba(58,112,176,0.18);
  & svg { stroke-width: 2; }
`;

const StatNumber = styled.div`
  font-size: 1.7rem;
  font-weight: 900;
  color: #193648;
  letter-spacing: -0.02em;
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

const StatPlus = styled.span`
  background: linear-gradient(135deg, #3A70B0 0%, #193648 100%);
  -webkit-background-clip: text;
          background-clip: text;
  -webkit-text-fill-color: transparent;
          color: transparent;
`;

const StatLabel = styled.div`
  font-size: 0.74rem;
  color: #5b7184;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  margin-top: 6px;
`;

const MarqueeStrip = styled.div`
  margin-top: 36px;
  overflow: hidden;
  position: relative;
  border-top: 1px solid #E2EEF9;
  border-bottom: 1px solid #E2EEF9;
  background: rgba(255,255,255,0.55);
  padding: 16px 0;
  backdrop-filter: blur(4px);

  &::before, &::after {
    content: "";
    position: absolute;
    top: 0; bottom: 0;
    width: 90px;
    z-index: 2;
    pointer-events: none;
  }
  &::before { left: 0;  background: linear-gradient(90deg, #F4F9FD 10%, transparent); }
  &::after  { right: 0; background: linear-gradient(-90deg, #F4F9FD 10%, transparent); }
`;

const MarqueeTrack = styled.div`
  display: flex;
  gap: 48px;
  width: max-content;
  animation: ${marqueeMove} 32s linear infinite;
`;

const PartnerName = styled.span`
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 14px;

  ${({ $variant }) =>
    $variant === "tag"
      ? css`
          font-size: 0.88rem;
          font-weight: 600;
          font-style: italic;
          letter-spacing: 0.02em;
          background: linear-gradient(90deg, #3A70B0 0%, #193648 100%);
          -webkit-background-clip: text;
                  background-clip: text;
          -webkit-text-fill-color: transparent;
                  color: transparent;
        `
      : css`
          font-size: 0.85rem;
          font-weight: 800;
          color: #193648;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        `}

  &::after {
    content: "✦";
    color: #3A70B0;
    font-size: 0.7rem;
    opacity: 0.55;
    -webkit-text-fill-color: #3A70B0;
  }
  &:last-child::after { display: none; }
`;

// ── "How it works" steps ────────────────────────────────────────────────────
const HowSection = styled.section`
  margin: 96px auto 0;
  max-width: 1080px;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 56px;
  animation: ${revealUp} 0.9s ease both;
`;

const SectionEyebrow = styled.div`
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(58,112,176,0.10), rgba(25,54,72,0.06));
  color: #3A70B0;
  border: 1px solid rgba(58,112,176,0.18);
  margin-bottom: 18px;
`;

const SectionTitle = styled.h2`
  position: relative;
  display: inline-block;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 900;
  margin: 0 0 28px 0;
  padding-bottom: 14px;
  color: #193648;
  letter-spacing: -0.02em;
  line-height: 1.2;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 56px;
    height: 3px;
    border-radius: 999px;
    background: linear-gradient(90deg, #193648, #3A70B0, #7AA9D6, #3A70B0, #193648);
    background-size: 220% 100%;
    animation: ${shine} 4s linear infinite;
  }
`;

const SectionEyebrowSpacer = styled.div`
  margin-bottom: 14px;
`;

const SectionSubtitle = styled.p`
  font-size: 0.98rem;
  color: #5b7184;
  max-width: 620px;
  margin: 0 auto;
  line-height: 1.55;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 820px) { grid-template-columns: 1fr; }
`;

const StepCard = styled.div`
  position: relative;
  border-radius: 22px;
  padding: 26px 22px 24px;
  background: linear-gradient(160deg, rgba(255,255,255,0.96) 0%, rgba(244,249,253,0.96) 100%);
  border: 1px solid #E2EEF9;
  box-shadow: 0 10px 26px rgba(25,54,72,0.06);
  text-align: left;
  overflow: hidden;
  animation: ${revealUp} 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${({ $delay }) => $delay || "0s"};
  transition:
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;

  &::before {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: 22px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(58,112,176,0.55), rgba(25,54,72,0) 60%);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(25,54,72,0.12), 0 2px 6px rgba(25,54,72,0.04);
    border-color: rgba(58,112,176,0.30);
  }
  &:hover::before { opacity: 1; }
`;

const StepNumber = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, #193648 0%, #3A70B0 100%);
  background-size: 200% 200%;
  animation: ${gradientShift} 6s ease infinite;
  box-shadow: 0 14px 28px rgba(25,54,72,0.32);
  margin-bottom: 16px;

  & svg { stroke-width: 2; }
`;

const StepBadge = styled.span`
  position: absolute;
  top: -8px; right: -8px;
  background: #fff;
  color: #193648;
  border: 1px solid #E2EEF9;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  box-shadow: 0 6px 14px rgba(25,54,72,0.12);
`;

const StepTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 800;
  color: #193648;
  margin: 0 0 6px 0;
  letter-spacing: -0.005em;
`;

const StepDesc = styled.p`
  font-size: 0.88rem;
  color: #5b7184;
  line-height: 1.55;
  margin: 0;
`;

// ── Feature grid ────────────────────────────────────────────────────────────
const FeatureSection = styled.section`
  margin: 96px auto 0;
  max-width: 1080px;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;

  @media (max-width: 820px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;

const FeatureCard = styled.div`
  position: relative;
  border-radius: 18px;
  padding: 22px 20px;
  background: rgba(255,255,255,0.92);
  border: 1px solid #E2EEF9;
  text-align: left;
  overflow: hidden;
  animation: ${revealUp} 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${({ $delay }) => $delay || "0s"};
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  backdrop-filter: blur(6px);
  will-change: transform;

  &::after {
    content: "";
    position: absolute;
    top: -40px; right: -40px;
    width: 140px; height: 140px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(58,112,176,0.16) 0%, rgba(58,112,176,0) 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(58,112,176,0.30);
    box-shadow: 0 16px 32px rgba(25,54,72,0.10), 0 2px 4px rgba(25,54,72,0.04);
  }
  &:hover::after { opacity: 1; }
`;

const FeatureIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #E2EEF9 0%, #CFE0F0 100%);
  color: #193648;
  margin-bottom: 12px;
  border: 1px solid rgba(58,112,176,0.18);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.7);

  & svg { stroke-width: 1.8; }
`;

const FeatureTitle = styled.h4`
  font-size: 0.98rem;
  font-weight: 800;
  color: #193648;
  margin: 0 0 4px 0;
`;

const FeatureDesc = styled.p`
  font-size: 0.84rem;
  color: #5b7184;
  line-height: 1.5;
  margin: 0;
`;

// ── Partner categories chip strip ───────────────────────────────────────────
const programMarqueeScroll = keyframes`
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const CategoriesSection = styled.section`
  margin: 64px auto 0;
  max-width: 1280px;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const ProgramMarqueeViewport = styled.div`
  position: relative;
  overflow: hidden;
  padding: 18px 0;
  mask-image: linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%);
`;

const ProgramMarqueeTrack = styled.div`
  display: flex;
  gap: 14px;
  width: max-content;
  animation: ${programMarqueeScroll} ${({ $speed }) => $speed || "32s"} linear infinite;
  animation-direction: ${({ $reverse }) => ($reverse ? "reverse" : "normal")};

  ${ProgramMarqueeViewport}:hover & { animation-play-state: paused; }
`;

const MarqueePill = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  border-radius: 999px;
  background: rgba(255,255,255,0.85);
  border: 1px solid #E2EEF9;
  color: #193648;
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 6px 18px rgba(25,54,72,0.06);
  backdrop-filter: blur(8px);
  white-space: nowrap;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: scale(1.08);
    border-color: #3A70B0;
    box-shadow: 0 12px 26px rgba(25,54,72,0.16);
  }
`;

const MarqueePillStrong = styled(MarqueePill)`
  background: linear-gradient(135deg, #193648 0%, #3A70B0 100%);
  color: #fff;
  border-color: rgba(255,255,255,0.18);
  box-shadow: 0 10px 22px rgba(25,54,72,0.30);
`;

const CategoryDot = styled.span`
  width: 8px; height: 8px; border-radius: 50%;
  background: linear-gradient(135deg, #193648 0%, #3A70B0 100%);
  box-shadow: 0 0 0 3px rgba(58,112,176,0.18);
`;

// ── Featured Collaborations (university × industry stories) ──────────────────
const FeaturedSection = styled.section`
  margin: 96px auto 0;
  max-width: 1080px;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const StoryCard = styled.div`
  position: relative;
  border-radius: 22px;
  padding: 24px 22px 22px;
  background: linear-gradient(160deg, rgba(255,255,255,0.96) 0%, rgba(244,249,253,0.96) 100%);
  border: 1px solid #E2EEF9;
  box-shadow: 0 10px 26px rgba(25,54,72,0.06);
  text-align: left;
  overflow: hidden;
  animation: ${revealUp} 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: ${({ $delay }) => $delay || "0s"};
  transition:
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;

  &::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #193648, #3A70B0, #7AA9D6, #3A70B0, #193648);
    background-size: 300% 100%;
    animation: ${shine} 5s linear infinite;
  }

  &::after {
    content: "";
    position: absolute;
    top: -60px; right: -60px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(58,112,176,0.20) 0%, rgba(58,112,176,0) 70%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 22px 44px rgba(25,54,72,0.14), 0 2px 6px rgba(25,54,72,0.04);
    border-color: rgba(58,112,176,0.35);
  }
  &:hover::after { opacity: 1; }
`;

const StoryHead = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
`;

const PartnerLogo = styled.div`
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 900;
  font-size: 0.88rem;
  color: #fff;
  background: ${({ $bg }) => $bg || "linear-gradient(135deg,#193648,#3A70B0)"};
  box-shadow: 0 8px 20px rgba(25,54,72,0.22);
  letter-spacing: 0.04em;
  flex-shrink: 0;
`;

const PartnerCross = styled.span`
  color: #3A70B0;
  font-weight: 900;
  font-size: 1rem;
  margin: 0 2px;
`;

const StoryMeta = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  flex: 1;
  min-width: 0;
`;

const StoryUni = styled.span`
  font-size: 0.92rem;
  font-weight: 800;
  color: #193648;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StoryIndustry = styled.span`
  font-size: 0.74rem;
  color: #5b7184;
  margin-top: 3px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
`;

const StoryDescription = styled.p`
  font-size: 0.88rem;
  color: #2c4a5e;
  line-height: 1.55;
  margin: 0 0 14px 0;
`;

const StoryStats = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  border-top: 1px dashed #E2EEF9;
  padding-top: 12px;
`;

const StoryChip = styled.span`
  font-size: 0.7rem;
  font-weight: 800;
  color: #193648;
  background: linear-gradient(135deg, #E2EEF9 0%, rgba(207,224,240,0.8) 100%);
  border: 1px solid rgba(58,112,176,0.30);
  border-radius: 999px;
  padding: 4px 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 5px;

  & svg { stroke-width: 2.4; color: #3A70B0; }
`;

// ── CTA banner ──────────────────────────────────────────────────────────────
const CtaBanner = styled.div`
  --gx: 50%;
  --gy: 50%;
  margin: 96px auto 0;
  max-width: 1080px;
  width: 100%;
  position: relative;
  border-radius: 26px;
  padding: 42px 36px;
  text-align: center;
  overflow: hidden;
  background:
    radial-gradient(circle at var(--gx) var(--gy), rgba(122,169,214,0.40) 0%, rgba(58,112,176,0) 38%),
    radial-gradient(circle at 18% 30%, rgba(58,112,176,0.55) 0%, rgba(58,112,176,0) 55%),
    radial-gradient(circle at 82% 70%, rgba(25,54,72,0.85) 0%, rgba(25,54,72,0.6) 60%),
    linear-gradient(135deg, #193648 0%, #2C5F80 100%);
  box-shadow: 0 28px 60px rgba(25,54,72,0.30);
  color: #fff;
  animation: ${revealUp} 0.9s ease both;
  z-index: 1;
  cursor: default;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px);
    background-size: 22px 22px;
    -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%);
            mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%);
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    top: -60px; right: -60px;
    width: 220px; height: 220px;
    border-radius: 50%;
    border: 1.5px dashed rgba(255,255,255,0.18);
    animation: ${borderSpin} 22s linear infinite;
    pointer-events: none;
  }
`;

const CtaTitle = styled.h2`
  font-size: clamp(1.4rem, 2.6vw, 2rem);
  font-weight: 900;
  margin: 0 0 10px 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
  position: relative;
`;

const CtaSubtitle = styled.p`
  font-size: 0.98rem;
  color: rgba(255,255,255,0.78);
  max-width: 560px;
  margin: 0 auto 22px;
  line-height: 1.55;
  position: relative;
`;

const CtaButtons = styled.div`
  display: inline-flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
`;

const CtaPrimary = styled.button`
  border: none;
  cursor: pointer;
  padding: 12px 22px;
  border-radius: 999px;
  background: #fff;
  color: #193648;
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  box-shadow: 0 12px 28px rgba(0,0,0,0.18);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(0,0,0,0.24); }
`;

const CtaGhost = styled.button`
  cursor: pointer;
  padding: 12px 22px;
  border-radius: 999px;
  background: transparent;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  border: 1.5px solid rgba(255,255,255,0.45);
  transition: background 0.25s ease, border-color 0.25s ease;

  &:hover { background: rgba(255,255,255,0.10); border-color: #fff; }
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

// ── Animated stat tile with count-up + 3D mouse-tilt ────────────────────────
const AnimatedStat = ({ Icon, value, suffix, label, delay }) => {
  const [n, countRef] = useCountUp(value);
  const tileRef = useRef(null);
  // Merge refs (count-up needs the same DOM node for IntersectionObserver)
  const setRefs = (el) => {
    tileRef.current = el;
    if (typeof countRef === "function") countRef(el);
    else if (countRef && "current" in countRef) countRef.current = el;
  };
  const onMouseMove = (e) => {
    const el = tileRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width  - 0.5;
    const py = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${py * -10}deg) rotateY(${px * 10}deg) translateY(-4px) scale(1.02)`;
    el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };
  const onMouseLeave = () => {
    const el = tileRef.current; if (!el) return;
    el.style.transform = "";
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  };
  return (
    <StatTile ref={setRefs} $delay={delay} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <StatTileLayer $z={36}>
        <StatHead>
          <StatIconBox><Icon size={16} /></StatIconBox>
          <StatLabel style={{ marginTop: 0 }}>{label}</StatLabel>
        </StatHead>
      </StatTileLayer>
      <StatTileLayer $z={20}>
        <StatNumber>
          {n.toLocaleString()}<StatPlus>{suffix}</StatPlus>
        </StatNumber>
      </StatTileLayer>
    </StatTile>
  );
};

// ── Tilted role card (mouse-tracked 3D) ──────────────────────────────────────
const TiltRoleCard = ({ role, $delay, onClick }) => {
  const tilt = useTilt(14);
  return (
    <RoleCard
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      onClick={onClick}
      $delay={$delay}
      $accent={role.accent}
      $glow={role.glow}
    >
      <Sweep />
      <Card3DLayer $z={70} style={{ position: "relative" }}>
        <HaloRing />
        <HaloMask />
        <IconHalo>
          <Illustration src={role.img} alt={role.title} />
        </IconHalo>
      </Card3DLayer>
      <Card3DLayer $z={42}>
        <Tag $bg={role.tagBg}>
          {role.Icon && <role.Icon size={11} />}
          {role.tag}
        </Tag>
      </Card3DLayer>
      <Card3DLayer $z={32} style={{ width: "100%" }}>
        <CardTitle>{role.title}</CardTitle>
        <CardDescription>{role.description}</CardDescription>
      </Card3DLayer>
      {role.bullets && (
        <Card3DLayer $z={20} style={{ width: "100%" }}>
          <CardBullets>
            {role.bullets.map((b, i) => (
              <Bullet key={i}>
                <b.Icon size={14} />
                {b.t}
              </Bullet>
            ))}
          </CardBullets>
        </Card3DLayer>
      )}
      <Card3DLayer $z={48}>
        <ContinueRow>
          <LiveDot />
          <span>Continue</span>
          <ArrowRight size={14} />
        </ContinueRow>
      </Card3DLayer>
    </RoleCard>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const scrollPct = useScrollProgress();
  const ctaGlow = useMagneticGlow();

  const roles = [
    {
      title: "Industry Liaison Incharge",
      tag:   "Partnerships",
      description: "Partnerships, MOUs & industry collaborations.",
      path: "/login",
      img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80",
      Icon: Handshake,
      tagBg: "linear-gradient(135deg, #193648 0%, #3A70B0 100%)",
      accent: "linear-gradient(90deg, #193648, #3A70B0, #193648)",
      glow: "radial-gradient(circle, rgba(58,112,176,0.28) 0%, rgba(58,112,176,0) 70%)",
    },
    {
      title: "Internship Incharge",
      tag:   "Placements",
      description: "Internships, applications & placements.",
      path: "/internship-login",
      img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
      Icon: Briefcase,
      tagBg: "linear-gradient(135deg, #2C5F80 0%, #3A70B0 100%)",
      accent: "linear-gradient(90deg, #2C5F80, #3A70B0, #2C5F80)",
      glow: "radial-gradient(circle, rgba(44,95,128,0.28) 0%, rgba(44,95,128,0) 70%)",
    },
    {
      title: "Co-Curricular Incharge",
      tag:   "Engagement",
      description: "Events, activities & student engagement.",
      path: "/co-curricular-login",
      img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80",
      Icon: CalendarDays,
      tagBg: "linear-gradient(135deg, #3A70B0 0%, #7AA9D6 100%)",
      accent: "linear-gradient(90deg, #3A70B0, #7AA9D6, #3A70B0)",
      glow: "radial-gradient(circle, rgba(122,169,214,0.32) 0%, rgba(122,169,214,0) 70%)",
    },
  ];

  return (
    <PageContainer>
      <ScrollProgress $w={scrollPct} />
      <Grid />
      <Blob variant="a" />
      <Blob variant="b" />
      <Blob variant="c" />

      {/* Subtle ambient sparkles */}
      <Sparkles>
        <Spark top="18%"  left="10%" delay="0s"   size={5} />
        <Spark top="62%"  left="92%" delay="1.2s" size={5} />
        <Spark top="40%"  left="88%" delay="2.4s" size={4} />
        <Spark top="80%"  left="14%" delay="0.6s" size={5} />
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
          <SparkleIcon>✦</SparkleIcon> Choose Your Workspace
        </Eyebrow>
        <Heading aria-label="Welcome to CollaXion">
          {(() => {
            const before = "Welcome";
            const conn   = "to";
            const accent = "CollaXion";
            let i = 0;
            const delay = (n) => `${0.35 + n * 0.05}s`;
            return (
              <>
                <HeadingWord>
                  {Array.from(before).map((ch, k) => (
                    <HeadingLetter key={`a${k}`} $delay={delay(i++)}>{ch}</HeadingLetter>
                  ))}
                </HeadingWord>
                {" "}
                <HeadingWord>
                  {Array.from(conn).map((ch, k) => (
                    <HeadingLetter key={`b${k}`} $delay={delay(i++)}>{ch}</HeadingLetter>
                  ))}
                </HeadingWord>
                {" "}
                <HeadingAccent>
                  <HeadingWord>
                    {Array.from(accent).map((ch, k) => (
                      <HeadingLetter key={`c${k}`} $delay={delay(i++)}>{ch}</HeadingLetter>
                    ))}
                  </HeadingWord>
                </HeadingAccent>
                <HeadingCaret aria-hidden />
              </>
            );
          })()}
        </Heading>
        <SubHeading>
          <Shimmer>Select your role</Shimmer> to continue to your workspace
        </SubHeading>

        <CardsContainer>
          {roles.map((role, index) => (
            <TiltRoleCard
              key={index}
              role={role}
              onClick={() => navigate(role.path)}
              $delay={`${0.15 + index * 0.12}s`}
            />
          ))}
        </CardsContainer>

        <TrustedSection>
          <TrustedEyebrow>Built for Riphah&apos;s Faculty of Computing</TrustedEyebrow>
          <StatsRow>
            {[
              { Icon: Building2,    value: 50,  suffix: "+", label: "Industry Partners" },
              { Icon: FileSignature, value: 120, suffix: "+", label: "MOUs Signed" },
              { Icon: GraduationCap, value: 850, suffix: "+", label: "Internships Placed" },
              { Icon: CalendarDays,  value: 75,  suffix: "+", label: "Campus Events" },
            ].map((s, i) => (
              <AnimatedStat
                key={i}
                Icon={s.Icon}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                delay={`${0.15 + i * 0.1}s`}
              />
            ))}
          </StatsRow>

          <MarqueeStrip>
            <MarqueeTrack>
              {[...Array(2)].flatMap((_, dup) =>
                [
                  { v: "uni", t: "Riphah · Faculty of Computing" },
                  { v: "tag", t: "Where Collaboration Meets Innovation" },
                  { v: "uni", t: "Department of Software Engineering" },
                  { v: "tag", t: "Bridging Classrooms with Boardrooms" },
                  { v: "uni", t: "Department of Software Engineering" },
                  { v: "tag", t: "From Curriculum to Career" },
                  { v: "uni", t: "Department of Artificial Intelligence" },
                  { v: "tag", t: "Where Mentors Meet Talent" },
                  { v: "uni", t: "Department of Cyber Security" },
                  { v: "tag", t: "Powering the Next Generation of Engineers" },
                  { v: "uni", t: "Department of Data Science" },
                  { v: "tag", t: "One Workspace · Every Partnership" },
                  { v: "uni", t: "FoC Industry Liaison Office" },
                  { v: "tag", t: "Academia & Industry, Synchronized" },
                ].map((item, i) => (
                  <PartnerName key={`${dup}-${i}`} $variant={item.v}>
                    {item.t}
                  </PartnerName>
                ))
              )}
            </MarqueeTrack>
          </MarqueeStrip>
        </TrustedSection>

        <CategoriesSection>
          <SectionHeader>
            <SectionEyebrow>Faculty of Computing · Programs</SectionEyebrow>
            <SectionTitle>
              One workspace for <HeadingAccent>every program</HeadingAccent>
            </SectionTitle>
          </SectionHeader>
          {(() => {
            const programs = [
              "Computer Science",
              "Software Engineering",
              "Artificial Intelligence",
              "Data Science",
              "Cyber Security",
              "Information Technology",
              "MS / MPhil Computing",
              "PhD Computing",
              "Final-Year Projects",
              "Industry Liaison Office",
            ];
            // Duplicate so the loop can scroll seamlessly (translateX -50% returns to start).
            const doubled = [...programs, ...programs];
            return (
              <>
                <ProgramMarqueeViewport>
                  <ProgramMarqueeTrack $speed="42s">
                    {doubled.map((p, i) => {
                      const Pill = i % 3 === 1 ? MarqueePillStrong : MarqueePill;
                      return (
                        <Pill key={`a${i}`}>
                          <CategoryDot />
                          {p}
                        </Pill>
                      );
                    })}
                  </ProgramMarqueeTrack>
                </ProgramMarqueeViewport>
                <ProgramMarqueeViewport>
                  <ProgramMarqueeTrack $speed="50s" $reverse>
                    {doubled.map((p, i) => {
                      const Pill = i % 4 === 2 ? MarqueePillStrong : MarqueePill;
                      return (
                        <Pill key={`b${i}`}>
                          <CategoryDot />
                          {p}
                        </Pill>
                      );
                    })}
                  </ProgramMarqueeTrack>
                </ProgramMarqueeViewport>
              </>
            );
          })()}
        </CategoriesSection>

        {false && (
        <>
        <HowSection>
          <SectionHeader>
            <SectionEyebrow>How CollaXion Works at the Faculty of Computing</SectionEyebrow>
            <SectionTitle>
              From outreach to <HeadingAccent>collaboration</HeadingAccent> - in three steps
            </SectionTitle>
            <SectionSubtitle>
              A streamlined workflow that lets the FoC industry liaison, internship, and co-curricular incharges coordinate partners, MOUs, placements, and events from one shared workspace.
            </SectionSubtitle>
          </SectionHeader>

          <StepsGrid>
            {[
              {
                n: "01",
                Icon: Handshake,
                t: "Onboard verified partners",
                d: "Register industry partners through a single guided form - capture company profile, NTN, focal contacts, and partnership scope, all reviewed by the liaison desk.",
              },
              {
                n: "02",
                Icon: FileSignature,
                t: "Sign MOUs digitally",
                d: "Auto-generate Memorandums of Understanding, stamp them on both sides, and notify the industry liaison the moment a partner signs back.",
              },
              {
                n: "03",
                Icon: GraduationCap,
                t: "Place students & host events",
                d: "Match students to internships, run on-campus engagements, and track placements, attendance, and feedback in one timeline.",
              },
            ].map((s, i) => (
              <StepCard key={i} $delay={`${0.15 + i * 0.12}s`}>
                <StepNumber>
                  <s.Icon size={22} />
                  <StepBadge>{s.n}</StepBadge>
                </StepNumber>
                <StepTitle>{s.t}</StepTitle>
                <StepDesc>{s.d}</StepDesc>
              </StepCard>
            ))}
          </StepsGrid>
        </HowSection>

        <FeatureSection>
          <SectionHeader>
            <SectionEyebrow>Tailored for the FoC liaison desks</SectionEyebrow>
            <SectionTitle>Everything the FoC team needs in one workspace</SectionTitle>
            <SectionSubtitle>
              Each FoC incharge gets a focused dashboard - but the data flows together so partnerships, placements, and engagement always stay in sync.
            </SectionSubtitle>
          </SectionHeader>

          <FeatureGrid>
            {[
              { Icon: Building2,       t: "Partner Directory",        d: "Searchable registry of verified industry partners with focal contacts, partnership scope, and engagement history." },
              { Icon: FileSignature,   t: "MOU Workflow",             d: "Draft, e-stamp, and track every Memorandum of Understanding with audit-friendly timestamps and version history." },
              { Icon: Briefcase,       t: "Internship Pipeline",      d: "Job postings, applications, faculty evaluations, and placement reports - every step in a single pipeline view." },
              { Icon: CalendarDays,    t: "Event Coordination",       d: "Plan campus events with RSVPs, reminders, attendance, and post-event analytics across all departments." },
              { Icon: BellRing,        t: "Liaison Notifications",    d: "Real-time alerts when a partner signs an MOU, posts an opening, or requires incharge attention." },
              { Icon: LayoutDashboard, t: "Role-aware Dashboards",    d: "Curated dashboards for each incharge - partnerships, placements, and engagement, with no clutter." },
              { Icon: ShieldCheck,     t: "Verified & Compliant",     d: "Built-in checks for NTN, registration, and HEC compliance so only authentic partners reach your students." },
              { Icon: TrendingUp,      t: "Outcome Analytics",        d: "Track placement conversion, partner activity, and event impact with charts you can share with leadership." },
              { Icon: Users,           t: "Multi-team Collaboration", d: "Industry, internship, and co-curricular incharges share data without ever stepping on each other's toes." },
            ].map((f, i) => (
              <FeatureCard key={i} $delay={`${0.1 + i * 0.07}s`}>
                <FeatureIcon><f.Icon size={20} /></FeatureIcon>
                <FeatureTitle>{f.t}</FeatureTitle>
                <FeatureDesc>{f.d}</FeatureDesc>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </FeatureSection>

        <FeaturedSection>
          <SectionHeader>
            <SectionEyebrow>Featured FoC collaborations</SectionEyebrow>
            <SectionTitle>
              FoC programs &amp; industry, <HeadingAccent>moving in step</HeadingAccent>
            </SectionTitle>
            <SectionSubtitle>
              A snapshot of partnerships powered through CollaXion at Riphah&apos;s Faculty of Computing - verified, active, and producing measurable outcomes for our students every semester.
            </SectionSubtitle>
          </SectionHeader>

          <StoryGrid>
            {[
              {
                uni: "Software Engineering",
                ind: "Software Houses",
                logo: "SE",
                bg: "linear-gradient(135deg,#193648,#3A70B0)",
                desc: "FoC's Software Engineering program partnered with leading software houses to launch a final-year industry-mentor track and rolling internship cohorts.",
                chips: [
                  { Icon: GraduationCap, t: "+86 internships" },
                  { Icon: FileSignature, t: "5 MOUs active" },
                  { Icon: CalendarDays,  t: "12 events / yr" },
                ],
              },
              {
                uni: "Artificial Intelligence",
                ind: "AI & FinTech",
                logo: "AI",
                bg: "linear-gradient(135deg,#3A70B0,#7AA9D6)",
                desc: "AI program faculty centralized partner outreach and cut MOU turnaround from weeks to days using digital stamping and live status tracking.",
                chips: [
                  { Icon: Briefcase,     t: "+62 placements" },
                  { Icon: TrendingUp,    t: "78% conversion" },
                  { Icon: Award,         t: "Top liaison desk 2025" },
                ],
              },
              {
                uni: "Cyber Security",
                ind: "Telecom & SOCs",
                logo: "CS",
                bg: "linear-gradient(135deg,#193648,#2C5F80)",
                desc: "Cyber Security faculty scaled SOC tours and capstone-sponsorship programs by routing every approval and partner request through one workspace.",
                chips: [
                  { Icon: Building2,     t: "18 partners" },
                  { Icon: ShieldCheck,   t: "100% verified" },
                  { Icon: CalendarDays,  t: "6 expos hosted" },
                ],
              },
            ].map((s, i) => (
              <StoryCard key={i} $delay={`${0.15 + i * 0.12}s`}>
                <StoryHead>
                  <PartnerLogo $bg={s.bg}>{s.logo}</PartnerLogo>
                  <PartnerCross>×</PartnerCross>
                  <StoryMeta>
                    <StoryUni>{s.uni}</StoryUni>
                    <StoryIndustry>{s.ind}</StoryIndustry>
                  </StoryMeta>
                </StoryHead>
                <StoryDescription>{s.desc}</StoryDescription>
                <StoryStats>
                  {s.chips.map((c, j) => (
                    <StoryChip key={j}>
                      <c.Icon size={11} /> {c.t}
                    </StoryChip>
                  ))}
                </StoryStats>
              </StoryCard>
            ))}
          </StoryGrid>
        </FeaturedSection>
        </>
        )}

        <CtaBanner ref={ctaGlow.ref} onMouseMove={ctaGlow.onMouseMove}>
          <CtaTitle>Ready to connect FoC &amp; industry?</CtaTitle>
          <CtaSubtitle>
            Pick your role above and step into a workspace built for Riphah Faculty of Computing&apos;s liaison, internship, and engagement teams.
          </CtaSubtitle>
          <CtaButtons>
            <CtaPrimary onClick={() => navigate("/login")}>
              Continue as Liaison <ArrowRight size={14} style={{ marginLeft: 6, verticalAlign: "-2px" }} />
            </CtaPrimary>
            <CtaGhost onClick={() => navigate("/internship-login")}>
              Internship Workspace
            </CtaGhost>
            <CtaGhost onClick={() => navigate("/co-curricular-login")}>
              Co-Curricular Workspace
            </CtaGhost>
          </CtaButtons>
        </CtaBanner>
      </ContentWrapper>

      <Footer>
        <FooterDot />
        <span>Powered by <strong>CollaXion</strong> · Bridging Academia &amp; Industry</span>
      </Footer>
    </PageContainer>
  );
};

export default Home;
