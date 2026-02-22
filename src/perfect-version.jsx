import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring, useMotionValue, useVelocity, useAnimationFrame } from "framer-motion";
import StackIcon from "tech-stack-icons";

// ─── THEME ────────────────────────────────────────────────────────────────────

const LIGHT = {
  bg: "#FCF8FF", bg2: "#F4F0FA", card: "#ffffff",
  ink: "#1a1025", inkSoft: "#5a4a6e", inkMuted: "#9a88b0",
  accent: "#9B72CF", accentDark: "#7d55b5",
  border: "rgba(155,114,207,0.18)", borderHover: "rgba(155,114,207,0.5)",
  tagBg: "rgba(155,114,207,0.1)", tagColor: "#6b4da0",
  navBg: "rgba(252,248,255,0.9)",
  orb1: "rgba(155,114,207,0.18)", orb2: "rgba(180,140,220,0.12)",
};
const DARK = {
  bg: "#0d0a14", bg2: "#130e1e", card: "#1a1229",
  ink: "#f0eaf8", inkSoft: "#b8a8d0", inkMuted: "#6e5e88",
  accent: "#b38de8", accentDark: "#9B72CF",
  border: "rgba(155,114,207,0.22)", borderHover: "rgba(179,141,232,0.6)",
  tagBg: "rgba(155,114,207,0.18)", tagColor: "#c9aef5",
  navBg: "rgba(13,10,20,0.9)",
  orb1: "rgba(155,114,207,0.12)", orb2: "rgba(100,60,180,0.1)",
};


// ─── SKILL DATA — tech-stack-icons ───────────────────────────────────────────

const SKILLS_BY_CATEGORY = [
  {
    cat: "Frontend",
    label: "What you see",
    icon: "Monitor",
    skills: [
      { name: "HTML5", stackIcon: "html5", color: "#E34F26" },
      { name: "CSS3", stackIcon: "css3", color: "#1572B6" },
      { name: "JavaScript", stackIcon: "js", color: "#F7DF1E" },
      { name: "React", stackIcon: "react", color: "#61DAFB" },
      { name: "Bootstrap", stackIcon: "bootstrap5", color: "#7952B3", imgSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg" },
      { name: "Tailwind", stackIcon: "tailwindcss", color: "#38B2AC" },
      { name: "Vite",      stackIcon: "vitejs",     color: "#646CFF", imgSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" },
      { name: "jQuery", stackIcon: "jquery", color: "#0769AD" },
      { name: "JSON",      stackIcon: "json",       color: "#5A9E6F", imgSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/json/json-original.svg" },
      { name: "WordPress", stackIcon: "wordpress", color: "#21759B" },
    ],
  },
  {
    cat: "Backend",
    label: "What powers it",
    icon: "Server",
    skills: [
      { name: "PHP", stackIcon: "php", color: "#777BB4" },
      { name: "Laravel", stackIcon: "laravel", color: "#FF2D20" },
      { name: "MySQL", stackIcon: "mysql", color: "#4479A1" },
      { name: "SQLite", stackIcon: "sqlite", color: "#0F80CC", imgSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg" },
      { name: "REST API", stackIcon: "postman", color: "#FF6C37" },
      { name: "Java", stackIcon: "java", color: "#007396" },
      { name: "Maven", stackIcon: "maven", color: "#C71A36", fallback: "MVN" },
      { name: "C++", stackIcon: "c++", color: "#00599C" },
      { name: "NPM", stackIcon: "npm", color: "#CB3837" },
      { name: "Git", stackIcon: "git", color: "#F05032" },
      { name: "GitHub", stackIcon: "github", color: "#333", darkVariant: "light" },
      { name: "Figma", stackIcon: "figma", color: "#F24E1E" },
    ],
  },
  {
    cat: "Mobile",
    label: "Everywhere you go",
    icon: "Smartphone",
    skills: [
      { name: "Flutter", stackIcon: "flutter", color: "#54C5F8" },
      { name: "Dart", stackIcon: "dart", color: "#0175C2" },
      { name: "Kotlin", stackIcon: "kotlin", color: "#7F52FF", imgSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg" },
    ],
  },
];

const SOFT_SKILLS = [
  { icon: "Brain", label: "Problem Solver", desc: "Breaks complex challenges into elegant, logical solutions." },
  { icon: "Target", label: "Detail-Oriented", desc: "Every pixel, every function — precision is a habit." },
  { icon: "Users", label: "Collaborative", desc: "Thrives in teams, listens actively, communicates clearly." },
  { icon: "Zap", label: "Fast Learner", desc: "Adopted an entire tech stack and landed an internship at 18." },
  { icon: "Lightbulb", label: "Creative Thinker", desc: "Doesn't just build what's asked — reimagines what's possible." },
  { icon: "Flame", label: "Self-Motivated", desc: "Fell into coding by accident. Never looked back. Still going." },
];

const PROJECTS = [
  { id: 1, title: "Project One", desc: "A brief description of what this project does and the problem it solves.", tags: ["React", "Laravel", "MySQL"], link: "#", github: "#" },
  { id: 2, title: "Project Two", desc: "A brief description of what this project does and the problem it solves.", tags: ["Flutter", "Dart", "REST API"], link: "#", github: "#" },
  { id: 3, title: "Project Three", desc: "A brief description of what this project does and the problem it solves. ", tags: ["PHP", "MySQL", "Bootstrap"], link: "#", github: "#" },
  { id: 4, title: "Project Four", desc: "A brief description of what this project does and the problem it solves. ", tags: ["React.js", "Tailwind", "Firebase"], link: "#", github: "#" },
  { id: 5, title: "Project Five", desc: "A brief description of what this project does and the problem it solves. ", tags: ["Java", "JSP", "Maven"], link: "#", github: "#" },
  { id: 6, title: "Project Six", desc: "A brief description of what this project does and the problem it solves.", tags: ["React", "Node.js", "MongoDB"], link: "#", github: "#" },
];

const NAV_LINKS = ["About", "Skills", "Projects", "Experience", "Contact"];

// ─── ANIMATION HELPERS ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };

// ─── ICON PATHS (UI icons only — skill icons use tech-stack-icons) ─────────────

const ICON_PATHS = {
  Brain: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z",
  Target: "M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-6a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
  Users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  Zap: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  Lightbulb: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5 M9 18h6 M10 22h4",
  Flame: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
  Moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  Sun: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z",
  MapPin: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  GraduationCap: "M22 10v6M2 10l10-5 10 5-10 5-10-5z M6 12v5c3 3 9 3 12 0v-5",
  Briefcase: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16 M2 9h20 M22 9a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9z",
  Building: "M3 21h18 M5 21V7l8-4v18 M19 21V11l-6-4 M9 9v.01 M9 12v.01 M9 15v.01 M9 18v.01",
  Mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  Phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 14a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.07 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 18v3.82",
  Globe: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  Github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  Instagram: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z",
  MessageSquare: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  ExternalLink: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3",
  ArrowRight: "M5 12h14 M12 5l7 7-7 7",
  Download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  Code: "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  Coffee: "M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3",
  Menu: "M3 12h18 M3 6h18 M3 18h18",
  X: "M18 6L6 18 M6 6l12 12",
  Monitor: "M20 3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z M8 21h8 M12 17v4",
  Server: "M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z M2 19a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1z M6 12v.01 M6 20v.01",
  Smartphone: "M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z M12 18h.01",
};

function Icon({ name, size = 18, color = "currentColor", strokeWidth = 1.7 }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  // Split on any uppercase M that follows a non-space character (e.g. "2M" or "zM")
  // OR is preceded by whitespace — covers all subpath separators
  const subpaths = d.match(/[Mm][^Mm]*/g) || [];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {subpaths.map((subpath, i) => (
        <path key={i} d={subpath.trim()} />
      ))}
    </svg>
  );
}

// ─── TECH-STACK-ICONS SKILL CARD ─────────────────────────────────────────────

function SkillCard({ skill, t, dark }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -8, scale: 1.07 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
    >
      <motion.div
        animate={{
          boxShadow: hov ? `0 0 26px ${skill.color}55` : `0 0 0px transparent`,
          background: hov ? `${skill.color}16` : t.card,
          borderColor: hov ? `${skill.color}80` : t.border,
        }}
        transition={{ duration: 0.22 }}
        style={{ width: 64, height: 64, borderRadius: 14, border: "1.5px solid", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <div style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {skill.fallback ? (
            <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, fontSize: 11, color: skill.color, letterSpacing: "-0.02em" }}>{skill.fallback}</span>
          ) : skill.imgSrc ? (
            <img src={skill.imgSrc} alt={skill.name} width={34} height={34} style={{ objectFit: "contain" }} />
          ) : (
            <StackIcon name={skill.stackIcon} variant={skill.darkOnly ? "dark" : (dark ? "dark" : "light")} style={{ width: "100%", height: "100%" }} />
          )}
        </div>
      </motion.div>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.07em", color: hov ? skill.color : t.inkMuted, transition: "color 0.22s", textAlign: "center", maxWidth: 68, lineHeight: 1.3 }}>
        {skill.name}
      </span>
    </motion.div>
  );
}

// ─── SCROLL PROGRESS ─────────────────────────────────────────────────────────

function ScrollBar({ t }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  return <motion.div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, background: t.accent, scaleX, transformOrigin: "0%", zIndex: 300 }} />;
}

// ─── CINEMATIC LOADER ────────────────────────────────────────────────────────

function Loader({ onDone }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1800);
    const t2 = setTimeout(() => { setPhase(2); onDone(); }, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div key="loader" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
          style={{ position: "fixed", inset: 0, zIndex: 10000, background: "#0d0a14", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
          <motion.div animate={phase === 1 ? { y: "-100%" } : { y: 0 }} transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
            style={{ position: "absolute", inset: 0, background: "#0d0a14", zIndex: 2 }} />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", zIndex: 3, textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#9B72CF", marginBottom: 20 }}>Full Stack Web & Mobile Developer</p>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 700, color: "#f0eaf8", lineHeight: 0.95, letterSpacing: "-0.02em" }}>
              Messadh<br /><em style={{ fontStyle: "italic", color: "#9B72CF" }}>River.</em>
            </h1>
          </motion.div>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, ease: "easeInOut" }}
            style={{ position: "relative", zIndex: 3, width: 180, height: 1, background: "rgba(155,114,207,0.3)", transformOrigin: "left" }}>
            <motion.div style={{ position: "absolute", inset: 0, background: "#9B72CF", transformOrigin: "left", scaleX: phase === 1 ? 1 : 0.5 }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── SCROLL FLOAT — inspired by reactbits.dev/text-animations/scroll-float ───
// Each word floats up from a clipped container as you scroll past the hero.
// On the hero name we use a mount-time stagger (no scroll dependency there).

function ScrollFloat({ children, delay = 0, as: Tag = "span", style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <span ref={ref} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", ...style }}>
      <motion.span
        style={{ display: "inline-block" }}
        initial={{ y: "110%", opacity: 0, rotateX: -20 }}
        animate={inView ? { y: "0%", opacity: 1, rotateX: 0 } : {}}
        transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// ─── HERO NAME — CINEMATIC SPLIT ENTRANCE ────────────────────────────────────
// Letters rise from below a clip mask with a staggered blur + 3D flip,
// then each letter has a subtle continuous float on hover.
// "River." gets a shimmer sweep after it lands.

function HeroName({ t }) {
  const line1 = "Messadh".split("");
  const line2 = "River.".split("");
  const [hovered, setHovered] = useState(null);
  const [shimmer, setShimmer] = useState(false);

  // Trigger shimmer sweep on River. after animation completes
  useEffect(() => {
    const timer = setTimeout(() => setShimmer(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Each letter: rises from clip + blurs in + 3D rotateX flip
  const charAnim = (i, isLine2 = false) => ({
    initial: { y: "120%", opacity: 0, filter: "blur(16px)", rotateX: -45, skewX: isLine2 ? -4 : 0 },
    animate: {
      y: "0%",
      opacity: 1,
      filter: "blur(0px)",
      rotateX: 0,
      skewX: 0,
      transition: {
        duration: 0.85,
        delay: 0.25 + i * 0.055,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  });

  const nameStyle = {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(32px, 9vw, 140px)",
    fontWeight: 700,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    marginBottom: 32,
    perspective: "1200px",
    userSelect: "none",
    wordBreak: "break-word",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={nameStyle}>
      {/* ── Line 1: Messadh ── */}
      <div style={{ display: "flex", overflow: "hidden", paddingBottom: "0.08em" }}>
        {line1.map((ch, i) => (
          <motion.span
            key={i}
            style={{ display: "inline-block", color: t.ink, cursor: "default" }}
            {...charAnim(i)}
            onHoverStart={() => setHovered(`l1-${i}`)}
            onHoverEnd={() => setHovered(null)}
            animate={hovered === `l1-${i}` ? { y: "-6px", color: t.accent, filter: "blur(0px)", rotateX: 0, skewX: 0, transition: { duration: 0.2 } } : charAnim(i).animate}
          >
            {ch}
          </motion.span>
        ))}
      </div>

      {/* ── Line 2: River. italic + shimmer ── */}
      <div style={{ display: "flex", overflow: "hidden", paddingBottom: "0.08em", position: "relative" }}>
        {line2.map((ch, i) => (
          <motion.span
            key={i}
            style={{
              display: "inline-block",
              fontStyle: "italic",
              color: t.accent,
              cursor: "default",
              position: "relative",
            }}
            {...charAnim(line1.length + i + 1, true)}
            onHoverStart={() => setHovered(`l2-${i}`)}
            onHoverEnd={() => setHovered(null)}
            animate={hovered === `l2-${i}` ? { y: "-6px", filter: "brightness(1.3) blur(0px)", rotateX: 0, skewX: 0, transition: { duration: 0.2 } } : charAnim(line1.length + i + 1, true).animate}
          >
            {ch}
          </motion.span>
        ))}

        {/* Shimmer sweep over "River." — fires once after letters land */}
        {shimmer && (
          <motion.div
            initial={{ x: "-110%", opacity: 0.7 }}
            animate={{ x: "110%", opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(105deg, transparent 30%, ${t.accent}60 50%, transparent 70%)`,
              pointerEvents: "none",
              borderRadius: 4,
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── WORD-BY-WORD FADE (for tagline and profile text) ────────────────────────
// Inspired by reactbits.dev/text-animations word-fade

function WordFade({ text, delay = 0, style = {}, className = "" }) {
  const words = text.split(" ");
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: delay } },
  };
  const word = {
    hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.span
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      style={{ display: "inline", ...style }}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word} style={{ display: "inline-block", marginRight: "0.28em" }}>
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ─── TYPEWRITER CURSOR (for eyebrow text) ────────────────────────────────────

function TypewriterText({ text, delay = 0, style = {} }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [inView, delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 45);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span ref={ref} style={style}>
      {displayed}
      {displayed.length < text.length && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }} style={{ display: "inline-block", width: 2, height: "1em", background: "currentColor", verticalAlign: "middle", marginLeft: 2 }} />
      )}
    </span>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function RevealText({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── SLIDE-IN FROM SIDE ───────────────────────────────────────────────────────
function SlideIn({ children, direction = 1, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: direction * 60, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── SCALE-IN CARD ───────────────────────────────────────────────────────────
function ScaleIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children, t }) {
  return (
    <RevealText>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: t.accent, display: "block", marginBottom: 16 }}>
        {children}
      </span>
    </RevealText>
  );
}

function ThemeToggle({ dark, toggle, t }) {
  return (
    <motion.button onClick={toggle} whileTap={{ scale: 0.88 }}
      style={{ background: "transparent", border: `1.5px solid ${t.border}`, borderRadius: 40, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
      <AnimatePresence mode="wait">
        <motion.span key={dark ? "sun" : "moon"} initial={{ opacity: 0, rotate: -20 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 20 }} transition={{ duration: 0.2 }}>
          <Icon name={dark ? "Sun" : "Moon"} size={15} color={t.accent} />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav({ dark, toggle, t }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinkStyle = { fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textDecoration: "none", color: t.inkMuted, textTransform: "uppercase", transition: "color 0.2s" };

  return (
    <>
      <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, padding: "0 clamp(20px,5vw,60px)", background: scrolled ? t.navBg : "transparent", backdropFilter: scrolled ? "blur(14px)" : "none", borderBottom: scrolled ? `1px solid ${t.border}` : "none", transition: "background .4s, border .4s" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
          <a href="#hero" style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, textDecoration: "none", color: t.ink, letterSpacing: "0.06em", flexShrink: 0 }}>
            M<span style={{ color: t.accent }}>.</span>River
          </a>

          {/* Desktop */}
          <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 48 }}>
            <ul style={{ display: "flex", gap: 32, listStyle: "none", margin: 0, padding: 0 }}>
              {NAV_LINKS.map(n => (
                <li key={n}>
                  <a href={`#${n.toLowerCase()}`} style={navLinkStyle}
                    onMouseEnter={e => e.target.style.color = t.accent}
                    onMouseLeave={e => e.target.style.color = t.inkMuted}>{n}</a>
                </li>
              ))}
            </ul>
            <ThemeToggle dark={dark} toggle={toggle} t={t} />
          </div>

          {/* Mobile */}
          <div className="nav-mobile" style={{ display: "none", alignItems: "center", gap: 10 }}>
            <ThemeToggle dark={dark} toggle={toggle} t={t} />
            <button onClick={() => setMenuOpen(o => !o)}
              style={{ background: "transparent", border: `1.5px solid ${t.border}`, borderRadius: 8, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name={menuOpen ? "X" : "Menu"} size={16} color={t.ink} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ position: "fixed", top: 70, left: 0, right: 0, zIndex: 190, background: t.navBg, backdropFilter: "blur(16px)", borderBottom: `1px solid ${t.border}`, padding: "16px clamp(20px,5vw,60px)" }}>
            {NAV_LINKS.map(n => (
              <a key={n} href={`#${n.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: "0.1em", textDecoration: "none", color: t.inkSoft, textTransform: "uppercase", padding: "11px 0", borderBottom: `1px solid ${t.border}` }}>
                {n}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero({ t }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);

  return (
    <section id="hero" style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(90px,12vw,120px) clamp(20px,5vw,60px) clamp(32px,4vw,44px)", position: "relative", overflow: "hidden" }}>
      {/* Ambient orbs */}
      <div style={{ position: "absolute", top: "12%", right: "5%", width: "min(520px,52vw)", height: "min(520px,52vw)", borderRadius: "50%", background: `radial-gradient(circle, ${t.orb1} 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "8%", left: "1%", width: "min(300px,32vw)", height: "min(300px,32vw)", borderRadius: "50%", background: `radial-gradient(circle, ${t.orb2} 0%, transparent 70%)`, pointerEvents: "none" }} />

      <motion.div style={{ y, opacity, maxWidth: 1200, width: "100%", boxSizing: "border-box", overflow: "hidden" }}>
        {/* Eyebrow */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontFamily: "'DM Mono', monospace", fontSize: "clamp(10px,1.2vw,12px)", letterSpacing: "0.22em", textTransform: "uppercase", color: t.accent, marginBottom: 30, display: "flex", alignItems: "center", gap: 12, overflow: "hidden", minWidth: 0 }}>
          <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ display: "inline-block", width: 28, height: 1, background: t.accent, flexShrink: 0, transformOrigin: "left" }} />
          <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
            <TypewriterText text="Available for hire · Algiers, Algeria" delay={0.3} />
          </span>
        </motion.p>

        {/* ── DESKTOP: two-column layout / MOBILE: single column ── */}
        <div className="hero-layout">

          {/* LEFT — Name */}
          <div className="hero-left">
            {/* ★ THE NAME */}
            <HeroName t={t} />

            {/* "Full Stack Web & Mobile Developer" — mobile only, sits right under the name */}
            <motion.div
              className="hero-role-mobile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              style={{ display: "none", alignItems: "center", gap: 10, marginBottom: 28 }}
            >
              <span style={{ display: "inline-block", width: 20, height: 1, background: t.accent, flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: t.accent }}>
                Full Stack Web & Mobile Developer
              </span>
            </motion.div>

            {/* Tagline */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 1.1 }}
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: "clamp(15px,2.1vw,24px)", color: t.inkSoft, maxWidth: "min(600px, 100%)", lineHeight: 1.55, marginBottom: 52, wordBreak: "break-word" }}>
              <WordFade text='"Code is just the medium. The real craft is solving problems people didnt know they had"' delay={1.2} />
            </motion.p>

            {/* CTA Buttons — mobile only */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.55 }}
              className="hero-cta hero-cta-mobile">
              <a href="#projects"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 30px", background: t.accent, color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", borderRadius: 3, transition: "background .25s, transform .2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = t.accentDark; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = t.accent; e.currentTarget.style.transform = "translateY(0)"; }}>
                View My Work <Icon name="ArrowRight" size={13} color="#fff" />
              </a>
              <a href="#contact"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 30px", background: "transparent", color: t.ink, fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", border: `1.5px solid ${t.border}`, borderRadius: 3, transition: "border-color .25s, transform .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "translateY(0)"; }}>
                Let's Talk
              </a>
              <a href="#"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 30px", background: "transparent", color: t.ink, fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", border: `1.5px solid ${t.border}`, borderRadius: 3, transition: "border-color .25s, transform .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "translateY(0)"; }}>
                Get My Resume <Icon name="Download" size={13} color={t.ink} />
              </a>
            </motion.div>
          </div>

          {/* RIGHT — desktop only: role + buttons */}
          <motion.div
            className="hero-right"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.13, delayChildren: 0.9 } } }}
            style={{ display: "none", flexDirection: "column", justifyContent: "center", paddingLeft: "clamp(32px,4vw,64px)", borderLeft: `1px solid ${t.border}` }}
          >
            {/* Role label */}
            <motion.div
              variants={{ hidden: { opacity: 0, x: 48 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
              style={{ marginBottom: 16 }}
            >
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: t.accent, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ display: "inline-block", width: 24, height: 1, background: t.accent }} />
                Full Stack Web & Mobile Developer
              </span>
            </motion.div>

            {/* Short descriptor */}
            <motion.p
              variants={{ hidden: { opacity: 0, x: 48 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
              style={{ fontFamily: "Georgia, serif", fontSize: "clamp(14px,1.1vw,16px)", color: t.inkSoft, lineHeight: 1.8, marginBottom: 40, maxWidth: 320 }}
            >
              Frontend craft. Backend architecture. Mobile engineering. All in one.
            </motion.p>

            {/* CTA Buttons — each slides in individually */}
            <motion.a
              href="#projects"
              variants={{ hidden: { opacity: 0, x: 48 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 30px", background: t.accent, color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", borderRadius: 3, transition: "background .25s, transform .2s", whiteSpace: "nowrap", marginBottom: 14 }}
              onMouseEnter={e => { e.currentTarget.style.background = t.accentDark; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = t.accent; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              View My Work <Icon name="ArrowRight" size={13} color="#fff" />
            </motion.a>
            <motion.a
              href="#contact"
              variants={{ hidden: { opacity: 0, x: 48 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 30px", background: "transparent", color: t.ink, fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", border: `1.5px solid ${t.border}`, borderRadius: 3, transition: "border-color .25s, transform .2s", whiteSpace: "nowrap", marginBottom: 14 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Let's Talk
            </motion.a>
            <motion.a
              href="#"
              variants={{ hidden: { opacity: 0, x: 48 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 30px", background: "transparent", color: t.ink, fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", border: `1.5px solid ${t.border}`, borderRadius: 3, transition: "border-color .25s, transform .2s", whiteSpace: "nowrap" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Get My Resume <Icon name="Download" size={13} color={t.ink} />
            </motion.a>
          </motion.div>
        </div>

        {/* Stats — full width, below both columns */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.85, duration: 0.8 }}
          className="hero-stats">
          {[["19", "Years Old"], ["15+", "Technologies"], ["1Y 3M", "@ Sonelgaz"], ["6", "Projects"]].map(([val, lbl], i) => (
            <motion.div key={lbl}
              initial={{ opacity: 0, y: 19 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: t.accent, lineHeight: 1 }}
                whileInView={{ textShadow: [`0 0 0px ${t.accent}`, `0 0 24px ${t.accent}80`, `0 0 0px ${t.accent}`] }}
                transition={{ delay: 2.1 + i * 0.1, duration: 1.2 }}
              >{val}</motion.div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: t.inkMuted, marginTop: 4 }}>{lbl}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── ABOUT ───────────────────────────────────────────────────────────────────

function About({ t }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  // ── Gloss animation (all screen sizes) ──
  const glossRef = useRef(null);
  const hasGlossedOnce = useRef(false);

  const triggerGloss = () => {
    const el = glossRef.current;
    if (!el) return;
    el.classList.remove("gloss-run");
    void el.offsetWidth; // reflow to restart animation
    el.classList.add("gloss-run");
  };

  // Fire gloss once on scroll-in
  useEffect(() => {
    if (inView && !hasGlossedOnce.current) {
      hasGlossedOnce.current = true;
      setTimeout(triggerGloss, 400);
    }
  }, [inView]);

  return (
    <section id="about" ref={ref} className="section-padded" style={{ maxWidth: 1260, margin: "0 auto" }}>
      <div className="about-grid">
        {/* Photo placeholder */}
        <SlideIn direction={-1} delay={0.1}>
          <motion.div
            className="about-photo-wrap"
            style={{ position: "relative" }}
            onHoverStart={triggerGloss}
            onTap={triggerGloss}
          >
            <div
              className="about-photo-inner"
              style={{ background: `linear-gradient(135deg, ${t.bg2} 0%, ${t.card} 100%)`, overflow: "hidden", border: `1px solid ${t.border}`, position: "relative" }}
            >
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <Icon name="Code" size={36} color={t.accent} />
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: t.inkMuted, letterSpacing: "0.1em", textAlign: "center", padding: "0 20px" }}>[ Replace with your photo ]<br />Recommended: 600×800px</p>
              </div>
              <img src="/river.jpg" alt="Messadh River" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} onError={e => e.target.style.display = "none"} />
              {/* Gloss overlay — all screen sizes */}
              <div ref={glossRef} className="about-photo-gloss" />
            </div>
            <div className="about-photo-border" style={{ position: "absolute", top: 14, left: 14, right: 0, bottom: -14, border: `1.5px solid ${t.border}`, borderRadius: 6, zIndex: -1, overflow: "hidden" }} />
          </motion.div>
        </SlideIn>

        {/* Text */}
        <div style={{ minWidth: 0 }}>
          <SectionLabel t={t}>— About Me</SectionLabel>
          <RevealText>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px,4vw,50px)", fontWeight: 700, color: t.ink, lineHeight: 1.1, marginBottom: 24 }}>
              <WordFade text="I didn't choose to code." /><br />
              <em style={{ color: t.accent, fontStyle: "italic" }}>
                <WordFade text="Coding chose me." delay={0.3} />
              </em>
            </h2>
          </RevealText>
          <RevealText delay={0.15}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(14px,1.4vw,17px)", lineHeight: 1.9, color: t.inkSoft, marginBottom: 18 }}>
              At 17, I stumbled into software — and never left. What started as an accident became an obsession. Today I'm a <strong style={{ color: t.ink }}>fullstack developer</strong> who moves fluidly between frontend craft, backend architecture, and mobile engineering.
            </p>
          </RevealText>
          <RevealText delay={0.15}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(14px,1.4vw,17px)", lineHeight: 1.9, color: t.inkSoft, marginBottom: 18 }}>
              Currently interning at <strong style={{ color: t.accent }}>Sonelgaz</strong> — one of Algeria's largest energy companies — where I've spent over a year shipping real software for real users. I know what it means to build things people depend on.
            </p>
          </RevealText>
          <RevealText delay={0.2}>
            <div className="about-pills">
              {[["MapPin", "Algiers, Algeria"], ["GraduationCap", "INSFP Rahmania"], ["Briefcase", "Open to Work"], ["Building", "Intern @ Sonelgaz"]].map(([icon, label]) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "'DM Mono', monospace", fontSize: 11, color: t.inkSoft }}>
                  <Icon name={icon} size={13} color={t.accent} /><span>{label}</span>
                </div>
              ))}
            </div>
          </RevealText>
        </div>
      </div>
    </section>
  );
}

// ─── SKILL MARQUEE ───────────────────────────────────────────────────────────

function SkillMarquee({ t }) {
  const items = ["HTML5", "CSS3", "JavaScript", "React", "Laravel", "PHP", "Flutter", "MySQL", "Tailwind", "Git", "Figma", "Kotlin", "Dart", "Vite", "Bootstrap", "WordPress", "Docker", "NPM"];
  const repeated = [...items, ...items];
  return (
    <div style={{ display: "flex", gap: "clamp(32px,4vw,52px)", overflow: "hidden", WebkitMaskImage: "linear-gradient(90deg,transparent,black 10%,black 90%,transparent)" }}>
      <motion.div
        style={{ display: "flex", gap: "clamp(32px,4vw,52px)", flexShrink: 0, whiteSpace: "nowrap" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
      >
        {repeated.map((name, i) => (
          <span key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: t.inkMuted, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: t.accent, display: "inline-block", flexShrink: 0 }} />
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────

function Skills({ t, dark }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="skills" ref={ref} className="section-padded" style={{ background: `linear-gradient(to bottom, transparent, ${t.bg2}55, transparent)` }}>
      <div style={{ maxWidth: 1260, margin: "0 auto" }}>
        <SectionLabel t={t}>— Technical Arsenal</SectionLabel>
        <RevealText>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 700, color: t.ink, marginBottom: 16 }}>
            <WordFade text="Built to build" /> <em style={{ color: t.accent, fontStyle: "italic" }}><WordFade text="anything." delay={0.25} /></em>
          </h2>
        </RevealText>
        <RevealText delay={0.05}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: t.inkSoft, marginBottom: 64, maxWidth: 520, lineHeight: 1.8 }}>
            A technology stack assembled through passion, projects, and a year of production engineering at scale.
          </p>
        </RevealText>

        {/* Marquee ticker — storytelling accent */}
        <div style={{ overflow: "hidden", width: "100%", margin: "0 0 56px", position: "relative" }}>
          <div style={{ height: 1, background: t.border, marginBottom: 28 }} />
          <SkillMarquee t={t} />
          <div style={{ height: 1, background: t.border, marginTop: 28 }} />
        </div>

        {/* Skill categories */}
        {SKILLS_BY_CATEGORY.map((cat, ci) => (
          <div key={cat.cat} style={{ marginBottom: 60 }}>
            <RevealText delay={ci * 0.05}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: t.tagBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={cat.icon} size={16} color={t.accent} />
                </div>
                <div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 17, color: t.ink, margin: 0 }}>{cat.cat}</p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: t.inkMuted, letterSpacing: "0.1em", margin: 0 }}>{cat.label}</p>
                </div>
              </div>
            </RevealText>

            <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger}
              className="skill-grid">
              {cat.skills.map((skill, i) => (
                <motion.div key={skill.name} variants={fadeUp} custom={i}>
                  <SkillCard skill={skill} t={t} dark={dark} />
                </motion.div>
              ))}
            </motion.div>

            {ci < SKILLS_BY_CATEGORY.length - 1 && (
              <div style={{ height: 1, background: t.border, marginTop: 52 }} />
            )}
          </div>
        ))}

        {/* Soft Skills */}
        <div style={{ marginTop: 80 }}>
          <SectionLabel t={t}>— Soft Skills</SectionLabel>
          <RevealText>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px,3vw,40px)", fontWeight: 700, color: t.ink, marginBottom: 40 }}>
              The human side of the <em style={{ color: t.accent, fontStyle: "italic" }}>engineer.</em>
            </h2>
          </RevealText>
          <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger}
            className="soft-skills-grid">
            {SOFT_SKILLS.map((s, i) => (
              <motion.div key={s.label} variants={fadeUp} custom={i}
                style={{ display: "flex", gap: 16, padding: 22, background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, transition: "box-shadow .25s, transform .25s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${t.accent}20`; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 10, background: t.tagBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={s.icon} size={16} color={t.accent} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: t.ink, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: t.inkSoft, lineHeight: 1.6, wordBreak: "break-word" }}>{s.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────

function Projects({ t }) {
  return (
    <section id="projects" className="section-padded">
      <div style={{ maxWidth: 1260, margin: "0 auto" }}>
        <SectionLabel t={t}>— Selected Work</SectionLabel>
        <RevealText>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 700, color: t.ink, marginBottom: 14 }}>
            <WordFade text="6 projects." /><br /><em style={{ color: t.accent, fontStyle: "italic" }}><WordFade text="Each one a story." delay={0.2} /></em>
          </h2>
        </RevealText>
        <RevealText delay={0.1}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: t.inkSoft, marginBottom: 56, maxWidth: 520, lineHeight: 1.8 }}>
            Placeholders for now — but each project will be a deep dive into a unique problem, the tech stack I chose to solve it, and the impact it had. From solo passion projects to production software used by thousands.
          </p>
        </RevealText>

        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <ScaleIn key={p.id} delay={i * 0.09}>
              <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", transition: "box-shadow .3s, transform .3s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 16px 56px ${t.accent}30`; e.currentTarget.style.transform = "translateY(-6px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ height: 190, background: `linear-gradient(135deg, hsl(${255 + i * 18},44%,${i % 2 === 0 ? "88" : "20"}%) 0%, hsl(${270 + i * 12},52%,${i % 2 === 0 ? "78" : "14"}%) 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, position: "relative" }}>
                  <Icon name="Code" size={26} color={t.accent} />
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: t.inkMuted, letterSpacing: "0.1em" }}>[ Screenshot ]</div>
                  <div style={{ position: "absolute", top: 14, right: 14, background: t.tagBg, borderRadius: 20, padding: "3px 11px", fontFamily: "'DM Mono', monospace", fontSize: 10, color: t.accent }}>0{p.id}</div>
                </div>
                <div style={{ padding: 24, minWidth: 0 }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: t.ink, marginBottom: 8, wordBreak: "break-word" }}>{p.title}</h3>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: t.inkSoft, lineHeight: 1.7, marginBottom: 16, wordBreak: "break-word" }}>{p.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                    {p.tags.map(tag => (
                      <span key={tag} style={{ background: t.tagBg, color: t.tagColor, fontFamily: "'DM Mono', monospace", fontSize: 10, padding: "3px 9px", borderRadius: 2 }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <a href={p.link} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: t.accent, textDecoration: "none", display: "flex", alignItems: "center", gap: 5, borderBottom: `1px solid ${t.accent}55` }}>
                      Live Demo <Icon name="ExternalLink" size={10} color={t.accent} />
                    </a>
                    <a href={p.github} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: t.inkMuted, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon name="Github" size={12} color={t.inkMuted} /> GitHub
                    </a>
                  </div>
                </div>
              </div>
            </ScaleIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── EXPERIENCE ──────────────────────────────────────────────────────────────

function Experience({ t }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const cards = [
    { side: -1, delay: 0.2, label: "Work Experience", icon: "Briefcase", date: "Oct 2024 – Present · Algiers", role: "Software Development Intern", org: "Sonelgaz — National Electricity & Gas Company", desc: "Over a year of hands-on experience building and maintaining internal software for one of Algeria's largest state enterprises. Contributed to production systems used by thousands of employees daily.", tags: ["Laravel", "React.js", "MySQL", "REST API", "PHP", "Java", "WordPress", "Kotlin", "Flutter"] },
    { side: 1, delay: 0.35, label: "Education", icon: "GraduationCap", date: "2024 – Present", role: "Web & Mobile Development", org: "INSFP Rahmania · Algiers, Algeria", desc: "Specializing in fullstack web and mobile development — from algorithms to production-grade applications and cross-platform mobile apps.", tags: [] },
  ];

  return (
    <section id="experience" ref={ref} className="section-padded" style={{ background: `linear-gradient(to bottom, transparent, ${t.bg2}55, transparent)` }}>
      <div style={{ maxWidth: 1260, margin: "0 auto" }}>
        <SectionLabel t={t}>— Experience & Background</SectionLabel>
        <RevealText>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,52px)", fontWeight: 700, color: t.ink, marginBottom: 56 }}>
            <WordFade text="Where I've been" /> <em style={{ color: t.accent, fontStyle: "italic" }}><WordFade text="proving myself." delay={0.2} /></em>
          </h2>
        </RevealText>
        <div className="experience-grid">
          {cards.map(({ side, delay, label, icon, date, role, org, desc, tags }) => (
            <div key={label} style={{ minWidth: 0 }}>
              <RevealText delay={delay - 0.1}>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: t.accent, marginBottom: 28, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name={icon} size={13} color={t.accent} /> {label}
                </h3>
              </RevealText>
              <motion.div initial={{ opacity: 0, x: side * 40, filter: "blur(6px)" }} animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}} transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "relative", paddingLeft: 24, borderLeft: `2px solid ${t.border}`, minWidth: 0 }}>
                <div style={{ position: "absolute", left: -7, top: 6, width: 12, height: 12, borderRadius: "50%", background: t.accent }} />
                <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: "clamp(18px,3vw,28px)", minWidth: 0, overflow: "hidden" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: t.accent, marginBottom: 8 }}>{date}</div>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(16px,2vw,20px)", color: t.ink, marginBottom: 4, wordBreak: "break-word" }}>{role}</h4>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: t.accent, fontStyle: "italic", marginBottom: 12, wordBreak: "break-word" }}>{org}</p>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: t.inkSoft, lineHeight: 1.8, wordBreak: "break-word" }}>{desc}</p>
                  {tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
                      {tags.map(tag => <span key={tag} style={{ background: t.tagBg, color: t.tagColor, fontFamily: "'DM Mono', monospace", fontSize: 10, padding: "3px 9px", borderRadius: 2 }}>{tag}</span>)}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function Contact({ t }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const contacts = [
    { icon: "Mail", label: "Email", value: "sarahimenemessadh@gmail.com", href: "mailto:sarahimenemessadh@gmail.com" },
    { icon: "Phone", label: "Phone", value: "+213 55 09 43 87", href: "tel:+213 55 09 43 87" },
    { icon: "Globe", label: "Upwork", value: "River M.", href: "https://www.upwork.com/freelancers/~017d459f20e3d30e04?mp_source=share" },
    { icon: "Github", label: "GitHub", value: "riverimenemessadh", href: "https://github.com/riverimenemessadh" },
    { icon: "Instagram", label: "Instagram", value: "@lilyysfanacc", href: "https://www.instagram.com/lilyysfanacc/" },
    { icon: "MessageSquare", label: "Discord", value: "uenicebitch_14005", href: "https://discord.com/users/1397636269286101137" },
  ];

  return (
    <section id="contact" ref={ref} className="section-padded-bottom">
      <div style={{ maxWidth: 1260, margin: "0 auto" }}>
        <SectionLabel t={t}>— Let's Connect</SectionLabel>
        <RevealText>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,6vw,80px)", fontWeight: 700, color: t.ink, lineHeight: 1, marginBottom: 20 }}>
            <WordFade text="Ready to build" /><br /><em style={{ color: t.accent, fontStyle: "italic" }}><WordFade text="something great?" delay={0.25} /></em>
          </h2>
        </RevealText>
        <RevealText delay={0.1}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(15px,1.5vw,18px)", color: t.inkSoft, maxWidth: "min(520px, 100%)", lineHeight: 1.8, marginBottom: 56 }}>
            I'm actively looking for my next opportunity. Whether you have a project, a position, or just want to talk tech — my inbox is always open.
          </p>
        </RevealText>

        <motion.div initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger}
          className="contact-grid">
          {contacts.map((c, i) => (
            <motion.a key={c.label} href={c.href} target="_blank" rel="noreferrer" variants={fadeUp} custom={i}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, textDecoration: "none", transition: "box-shadow .25s, transform .2s, border-color .25s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${t.accent}25`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = t.borderHover; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = t.border; }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: t.tagBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={c.icon} size={16} color={t.accent} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: t.accent, marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, color: t.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.value}</div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 36 }} className="contact-footer">
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: t.inkMuted, letterSpacing: "0.07em" }}>
            © 2025 Messadh River.
          </p>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: t.inkMuted, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="MapPin" size={11} color={t.accent} /> Algiers, Algeria
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [dark, setDark] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const t = dark ? DARK : LIGHT;

  return (
    <div style={{ background: t.bg, minHeight: "100svh", fontFamily: "'Syne', sans-serif", transition: "background 0.5s, color 0.5s", color: t.ink, overflowX: "hidden", width: "100%" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; max-width: 100%; }
        html { scroll-behavior: smooth; overflow-x: hidden; max-width: 100%; }
        body { overflow-x: hidden; margin: 0; max-width: 100%; }
        img, svg, video { max-width: 100%; display: block; }
        ::selection { background: rgba(155,114,207,0.28); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #9B72CF; border-radius: 2px; }
        a, button { cursor: pointer; }

        /* ── NAV BREAKPOINTS ── */
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile  { display: none !important; }
        }

        /* ── HERO CTA: stack on small screens ── */
        .hero-cta {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          align-items: center;
        }
        @media (max-width: 480px) {
          .hero-cta {
            flex-direction: column;
            align-items: stretch;
          }
          .hero-cta a {
            justify-content: center;
            width: 100%;
          }
        }

        /* ── HERO LAYOUT: two-column on desktop ── */
        .hero-layout {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .hero-left {
          width: 100%;
          min-width: 0;
        }
        .hero-right {
          display: none !important;
        }
        .hero-cta-mobile {
          display: flex !important;
        }
        .hero-role-mobile {
          display: flex !important;
        }
        @media (min-width: 900px) {
          .hero-layout {
            flex-direction: row;
            align-items: center;
            gap: clamp(32px, 4vw, 60px);
          }
          .hero-left {
            flex: 1;
            min-width: 0;
          }
          .hero-right {
            display: flex !important;
            flex-shrink: 0;
            width: clamp(260px, 28vw, 360px);
          }
          .hero-cta-mobile {
            display: none !important;
          }
          .hero-role-mobile {
            display: none !important;
          }
        }

        /* ── HERO STATS: 2-col on mobile, row on desktop ── */
        .hero-stats {
          display: flex;
          gap: clamp(24px, 4vw, 52px);
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }
        @media (max-width: 480px) {
          .hero-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            margin-top: 36px;
            padding-top: 24px;
            gap: 20px 16px;
          }
        }

        /* ── ABOUT GRID ── */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(32px, 6vw, 80px);
          align-items: center;
        }
        @media (min-width: 640px) {
          .about-grid {
            grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
          }
        }

        /* ── ABOUT PHOTO: circle on mobile, rectangle on desktop ── */
        .about-photo-wrap {
          max-width: 200px;
          margin: 0 auto;
          width: 100%;
        }
        .about-photo-inner {
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          overflow: hidden;
        }
        .about-photo-border {
          display: none;
        }
        @media (min-width: 640px) {
          .about-photo-wrap {
            max-width: 100%;
            margin: 0;
          }
          .about-photo-inner {
            aspect-ratio: 3 / 4;
            border-radius: 6px;
          }
          .about-photo-border {
            display: block;
          }
        }

        /* ── GLOSS SWEEP (both mobile + desktop) ── */
        @keyframes glossSweep {
          0%   { transform: translateX(-150%) skewX(-20deg); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateX(250%) skewX(-20deg); opacity: 0; }
        }
        .about-photo-gloss {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 3;
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(255,255,255,0.45) 50%,
            transparent 70%
          );
          opacity: 0;
        }
        .about-photo-gloss.gloss-run {
          animation: glossSweep 0.9s ease-in-out forwards;
        }

        /* ── ABOUT INFO PILLS: wrap tightly on mobile ── */
        .about-pills {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          flex-wrap: wrap;
        }
        @media (max-width: 480px) {
          .about-pills {
            gap: 8px 16px;
          }
        }

        /* ── SKILL GRID: tighter min on mobile ── */
        .skill-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
        }
        @media (max-width: 480px) {
          .skill-grid {
            gap: 14px;
          }
        }

        /* ── SOFT SKILLS GRID ── */
        .soft-skills-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 480px) {
          .soft-skills-grid {
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 278px), 1fr));
          }
        }

        /* ── PROJECTS GRID ── */
        .projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 480px) {
          .projects-grid {
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
          }
        }

        /* ── EXPERIENCE GRID ── */
        .experience-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(40px, 5vw, 60px);
        }
        @media (min-width: 640px) {
          .experience-grid {
            grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
          }
        }

        /* ── CONTACT GRID ── */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          margin-bottom: 80px;
        }
        @media (min-width: 400px) {
          .contact-grid {
            grid-template-columns: repeat(auto-fill, minmax(min(100%, 258px), 1fr));
          }
        }

        /* ── CONTACT FOOTER ── */
        .contact-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        /* ── SECTION PADDING: reduce on mobile ── */
        .section-padded {
          padding: clamp(72px, 10vw, 120px) clamp(20px, 5vw, 60px);
        }
        .section-padded-bottom {
          padding: clamp(72px, 10vw, 120px) clamp(20px, 5vw, 60px) clamp(48px, 6vw, 80px);
        }
      `}</style>

      <Loader onDone={() => setLoaded(true)} />

      {loaded && (
        <>
          <ScrollBar t={t} />
          <Nav dark={dark} toggle={() => setDark(d => !d)} t={t} />
          <Hero t={t} />
          <About t={t} />
          <Skills t={t} dark={dark} />
          <Projects t={t} />
          <Experience t={t} />
          <Contact t={t} />
        </>
      )}
    </div>
  );
}
