import { useState, useCallback, useEffect, useRef } from "react";
import SplashScreen from "@/components/SplashScreen";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Shield, ArrowRight, Search, Brain, ShieldCheck, Terminal, GitBranch, Zap, Lock, Eye, Code, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import cyberCityImg from "@/assets/cyber-city.png";

const SLIDES = [
  { id: "logo" },
  { id: "tagline" },
  { id: "terminal" },
  { id: "features" },
  { id: "image" },
  { id: "stats" },
  { id: "cta" },
];

const SLIDE_DURATION = 3500;

const featurePills = [
  { icon: Search, label: "Vulnerability Scanning", desc: "Semgrep, nmap & custom heuristics", gradient: "from-primary to-neon-pink" },
  { icon: Brain, label: "AI Reasoning", desc: "Chain-of-Thought transparency", gradient: "from-neon-pink to-secondary" },
  { icon: Terminal, label: "Log Analysis", desc: "Intelligent log parsing", gradient: "from-accent to-neon-blue" },
  { icon: ShieldCheck, label: "Auto-Patching", desc: "Fix with rollback support", gradient: "from-neon-green to-accent" },
  { icon: GitBranch, label: "Agentic Loop", desc: "Continuous scan → patch cycle", gradient: "from-primary to-accent" },
  { icon: Zap, label: "Real-time Alerts", desc: "Critical severity notifications", gradient: "from-secondary to-neon-pink" },
];

const terminalLines = [
  { text: "$ vulnhunter scan --target ./app --mode deep", color: "text-neon-green" },
  { text: "[INFO] Loading 500+ vulnerability patterns...", color: "text-muted-foreground" },
  { text: "[SCAN] Analyzing 2,847 files across 12 modules", color: "text-muted-foreground" },
  { text: "[VULN] SQL Injection in /api/users — CRITICAL", color: "text-secondary" },
  { text: "[COT]  XSS failed → pivoting to SQLi vector", color: "text-accent" },
  { text: "[PATCH] Applying parameterized query fix...", color: "text-neon-green" },
  { text: "✓ All vulnerabilities patched", color: "text-neon-green" },
];

/* Animated counter hook */
const useCounter = (end: number, duration = 2000, active = false) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, end, duration]);
  return val;
};

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [terminalVisible, setTerminalVisible] = useState(0);
  const navigate = useNavigate();

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (showSplash || paused) return;
    if (slide >= SLIDES.length - 1) return;
    const timer = setTimeout(() => setSlide((s) => s + 1), SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [showSplash, slide, paused]);

  // Terminal lines animation
  useEffect(() => {
    if (slide !== 2) { setTerminalVisible(0); return; }
    const timers = terminalLines.map((_, i) =>
      setTimeout(() => setTerminalVisible(i + 1), 300 + i * 350)
    );
    return () => timers.forEach(clearTimeout);
  }, [slide]);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* ─── Background ─── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(230 25% 4%) 0%, hsl(260 40% 10%) 35%, hsl(280 45% 16%) 55%, hsl(230 25% 4%) 100%)" }} />

        {/* Animated mesh gradient */}
        <motion.div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, hsl(270 60% 20% / 0.4), transparent)" }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Large orbs */}
        <motion.div className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, hsl(270 95% 60% / 0.15), transparent 65%)" }} animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute -bottom-[15%] -left-[10%] w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, hsl(330 90% 60% / 0.12), transparent 65%)" }} animate={{ scale: [1.1, 1, 1.1], x: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute top-[30%] right-[30%] w-[350px] h-[350px] rounded-full" style={{ background: "radial-gradient(circle, hsl(200 95% 55% / 0.08), transparent 65%)" }} animate={{ y: [0, -40, 0], x: [0, 30, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `linear-gradient(hsl(var(--neon-purple) / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-purple) / 0.6) 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />

        {/* Scan lines */}
        <motion.div className="absolute left-0 right-0 h-px opacity-20" style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--neon-purple) / 0.6) 30%, hsl(var(--neon-pink) / 0.4) 70%, transparent 100%)" }} animate={{ top: ["-5%", "105%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />

        {/* Particles */}
        {Array.from({ length: 35 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1 + Math.random() * 2.5,
              height: 1 + Math.random() * 2.5,
              background: i % 4 === 0 ? "hsl(var(--neon-purple))" : i % 4 === 1 ? "hsl(var(--neon-pink))" : i % 4 === 2 ? "hsl(var(--neon-blue))" : "hsl(var(--neon-green))",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -(40 + Math.random() * 80), 0], opacity: [0, 0.7, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 3 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 4, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ─── Top bar ─── */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}>
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-sm gradient-text">VulnHunter</span>
        </div>
        <div className="flex items-center gap-3">
          {slide < SLIDES.length - 1 && (
            <button
              className="text-[11px] font-body text-muted-foreground/40 hover:text-muted-foreground tracking-wider uppercase transition-colors"
              onClick={() => setSlide(SLIDES.length - 1)}
            >
              Skip
            </button>
          )}
        </div>
      </motion.div>

      {/* ─── Progress bar (top) ─── */}
      <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-muted/20">
        <motion.div
          className="h-full rounded-r-full"
          style={{ background: "linear-gradient(90deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)), hsl(var(--neon-blue)))" }}
          animate={{ width: `${((slide + 1) / SLIDES.length) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* ─── Slide indicator (right side) ─── */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)} className="group flex items-center gap-2">
            <motion.div
              className="rounded-full transition-all duration-500"
              style={{
                width: i === slide ? 10 : 6,
                height: i === slide ? 10 : 6,
                background: i === slide ? "hsl(var(--neon-purple))" : i < slide ? "hsl(var(--neon-purple) / 0.4)" : "hsl(var(--muted))",
                boxShadow: i === slide ? "0 0 10px hsl(var(--neon-purple) / 0.5)" : "none",
              }}
              layout
            />
          </button>
        ))}
      </div>

      {/* ─── Slide number ─── */}
      <div className="absolute bottom-8 left-8 z-20 font-display text-muted-foreground/20 text-sm">
        <span className="text-foreground/60 text-lg font-bold">{String(slide + 1).padStart(2, "0")}</span>
        <span className="mx-1">/</span>
        <span>{String(SLIDES.length).padStart(2, "0")}</span>
      </div>

      {/* ─── Slide content ─── */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <AnimatePresence mode="wait">

          {/* ── 0: Logo ── */}
          {slide === 0 && (
            <motion.div key="logo" className="flex flex-col items-center text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -40, filter: "blur(12px)" }} transition={{ duration: 0.6 }}>
              {/* Rotating rings */}
              <div className="relative mb-10">
                <motion.div className="absolute inset-0 m-auto w-44 h-44 md:w-56 md:h-56 rounded-full border border-dashed" style={{ borderColor: "hsl(var(--neon-purple) / 0.2)" }} animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
                <motion.div className="absolute inset-0 m-auto w-36 h-36 md:w-44 md:h-44 rounded-full border" style={{ borderColor: "hsl(var(--neon-pink) / 0.15)" }} animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ background: "hsl(var(--neon-pink))", boxShadow: "0 0 8px hsl(var(--neon-pink))" }} />
                </motion.div>
                <motion.div
                  className="relative z-10 w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0, boxShadow: ["0 0 40px hsl(270 95% 60% / 0.3)", "0 0 80px hsl(270 95% 60% / 0.5)", "0 0 40px hsl(270 95% 60% / 0.3)"] }}
                  transition={{ scale: { duration: 1, type: "spring", bounce: 0.3 }, rotate: { duration: 1, type: "spring" }, boxShadow: { duration: 2.5, repeat: Infinity } }}
                >
                  <Shield className="w-14 h-14 md:w-18 md:h-18 text-primary-foreground" />
                </motion.div>
              </div>
              <motion.h1 className="text-6xl md:text-8xl font-display font-bold" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}>
                <span className="gradient-text">VulnHunter</span>
              </motion.h1>
              <motion.p className="mt-3 text-sm font-display tracking-[0.4em] uppercase text-muted-foreground" initial={{ opacity: 0, letterSpacing: "0.6em" }} animate={{ opacity: 1, letterSpacing: "0.4em" }} transition={{ delay: 0.9, duration: 0.6 }}>
                Autonomous Security Agent
              </motion.p>
              <motion.div className="mt-5 h-px w-24 rounded-full mx-auto" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--neon-purple)), transparent)" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.2, duration: 0.6 }} />
            </motion.div>
          )}

          {/* ── 1: Tagline ── */}
          {slide === 1 && (
            <motion.div key="tagline" className="flex flex-col items-center text-center max-w-4xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -60, filter: "blur(8px)" }} transition={{ duration: 0.5 }}>
              <motion.div className="flex items-center gap-2 mb-6" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <motion.span className="w-2 h-2 rounded-full bg-neon-green" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <span className="text-xs font-body text-muted-foreground tracking-widest uppercase">System Active</span>
              </motion.div>
              <motion.h2
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-[1.05] mb-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                AI that{" "}
                <motion.span className="gradient-text inline-block" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>identifies</motion.span>,{" "}
                <motion.span className="gradient-text inline-block" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>exploits</motion.span>, &{" "}
                <motion.span className="gradient-text inline-block" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}>patches</motion.span>
                <br />vulnerabilities
              </motion.h2>
              <motion.p className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                Powered by <span className="text-accent font-medium">Chain-of-Thought reasoning</span> for transparent, explainable security testing.
              </motion.p>
            </motion.div>
          )}

          {/* ── 2: Terminal ── */}
          {slide === 2 && (
            <motion.div key="terminal" className="flex flex-col items-center w-full max-w-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }}>
              <motion.h3 className="text-lg font-display font-bold text-foreground mb-6 text-center" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="gradient-text">Watch It Work</span>
              </motion.h3>
              <motion.div
                className="w-full rounded-2xl overflow-hidden glass-card"
                style={{ boxShadow: "0 0 40px hsl(270 95% 60% / 0.15), 0 20px 60px hsl(0 0% 0% / 0.3)" }}
                initial={{ y: 30, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/30">
                  <div className="w-3 h-3 rounded-full bg-destructive/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-neon-green/70" />
                  <span className="ml-3 text-xs text-muted-foreground font-mono">vulnhunter@agent:~</span>
                </div>
                <div className="p-6 space-y-2 font-mono text-sm min-h-[220px]">
                  {terminalLines.slice(0, terminalVisible).map((line, i) => (
                    <motion.div
                      key={i}
                      className={`${line.color} flex items-start gap-2`}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {line.text}
                    </motion.div>
                  ))}
                  {terminalVisible < terminalLines.length && (
                    <motion.span className="inline-block w-2 h-4 bg-neon-green" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.6, repeat: Infinity }} />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ── 3: Features ── */}
          {slide === 3 && (
            <motion.div key="features" className="flex flex-col items-center text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.5 }}>
              <motion.h3 className="text-2xl md:text-3xl font-display font-bold mb-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="gradient-text">Core Capabilities</span>
              </motion.h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 max-w-3xl">
                {featurePills.map((f, i) => (
                  <motion.div
                    key={f.label}
                    className="group relative flex flex-col items-center gap-3 p-5 md:p-6 rounded-2xl glass-card hover:border-primary/20 transition-all duration-500 text-center"
                    initial={{ opacity: 0, y: 40, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${f.gradient}`}>
                      <f.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-display font-semibold text-foreground">{f.label}</span>
                    <span className="text-[11px] text-muted-foreground font-body leading-snug">{f.desc}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── 4: Image ── */}
          {slide === 4 && (
            <motion.div key="image" className="flex flex-col items-center text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} transition={{ duration: 0.5 }}>
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                {/* Outer glow */}
                <div className="absolute inset-0 rounded-3xl" style={{ boxShadow: "0 0 120px hsl(270 95% 60% / 0.2), 0 0 60px hsl(330 90% 60% / 0.1)" }} />
                <motion.img
                  src={cyberCityImg}
                  alt="Cybersecurity visualization"
                  className="w-80 md:w-[28rem] lg:w-[32rem] rounded-3xl relative z-10"
                  style={{ filter: "drop-shadow(0 0 60px hsl(270 95% 60% / 0.3))" }}
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <motion.p className="mt-8 text-base font-display text-foreground/80" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                Protecting the <span className="gradient-text font-semibold">digital frontier</span>
              </motion.p>
              <motion.p className="text-sm text-muted-foreground font-body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                with autonomous intelligence
              </motion.p>
            </motion.div>
          )}

          {/* ── 5: Stats ── */}
          {slide === 5 && (
            <motion.div key="stats" className="flex flex-col items-center text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.5 }}>
              <motion.h3 className="text-2xl md:text-3xl font-display font-bold gradient-text mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                Why VulnHunter?
              </motion.h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
                {[
                  { value: "10x", label: "Faster than manual testing", icon: Zap },
                  { value: "500+", label: "Vulnerability patterns", icon: Eye },
                  { value: "24/7", label: "Autonomous monitoring", icon: Cpu },
                  { value: "<1s", label: "Average patch time", icon: Code },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                  >
                    <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center mb-1">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-4xl md:text-5xl font-display font-bold gradient-text">{stat.value}</span>
                    <span className="text-xs text-muted-foreground font-body max-w-[130px] leading-snug">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── 6: CTA ── */}
          {slide === 6 && (
            <motion.div
              key="cta"
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              onAnimationComplete={() => setPaused(true)}
            >
              {/* Animated shield */}
              <motion.div className="relative mb-8">
                <motion.div className="absolute inset-0 m-auto w-32 h-32 rounded-full" style={{ border: "1px dashed hsl(var(--neon-purple) / 0.2)" }} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
                <motion.div
                  className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0, boxShadow: ["0 0 30px hsl(270 95% 60% / 0.3)", "0 0 60px hsl(270 95% 60% / 0.5)", "0 0 30px hsl(270 95% 60% / 0.3)"] }}
                  transition={{ scale: { type: "spring", bounce: 0.4 }, boxShadow: { duration: 2, repeat: Infinity } }}
                >
                  <Lock className="w-9 h-9 text-primary-foreground" />
                </motion.div>
              </motion.div>

              <motion.h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
                Ready to <span className="gradient-text">Hunt</span>?
              </motion.h2>

              <motion.p className="text-base md:text-lg text-muted-foreground font-body mb-10 max-w-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                Sign in or create an account to start scanning your code for vulnerabilities.
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row items-center gap-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                {/* Sign In - hero button */}
                <motion.button
                  onClick={() => navigate("/login")}
                  className="group relative overflow-hidden flex items-center gap-3 px-14 py-5 rounded-2xl text-primary-foreground font-display text-lg font-bold tracking-wide"
                  style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{ boxShadow: ["0 0 30px hsl(270 95% 60% / 0.35), 0 8px 40px hsl(270 95% 60% / 0.15)", "0 0 50px hsl(270 95% 60% / 0.55), 0 8px 60px hsl(270 95% 60% / 0.25)", "0 0 30px hsl(270 95% 60% / 0.35), 0 8px 40px hsl(270 95% 60% / 0.15)"] }}
                  transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
                >
                  {/* Shimmer sweep */}
                  <motion.div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.15) 50%, transparent 60%)" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                  />
                  <Shield className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Sign In</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
                </motion.button>

                {/* Divider */}
                <span className="text-muted-foreground/30 font-body text-sm hidden sm:block">or</span>

                {/* Create Account - glass button */}
                <motion.button
                  onClick={() => navigate("/login")}
                  className="group relative overflow-hidden flex items-center gap-3 px-12 py-5 rounded-2xl font-display text-lg font-bold tracking-wide text-foreground"
                  style={{
                    background: "hsl(var(--card) / 0.5)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid hsl(var(--neon-purple) / 0.25)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    borderColor: "hsl(270 95% 60% / 0.5)",
                    boxShadow: "0 0 30px hsl(270 95% 60% / 0.15), inset 0 0 20px hsl(270 95% 60% / 0.05)",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Gradient border shimmer */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--neon-purple) / 0.1), hsl(var(--neon-pink) / 0.05))",
                    }}
                  />
                  <Sparkles className="w-5 h-5 text-primary relative z-10" />
                  <span className="relative z-10 gradient-text">Create Account</span>
                  <ArrowRight className="w-5 h-5 text-primary relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
                </motion.button>
              </motion.div>

              <motion.p className="mt-8 text-[11px] text-muted-foreground/40 font-body" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
                © 2026 VulnHunter — Hackathon Project
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
