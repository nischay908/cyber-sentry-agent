import { useState, useCallback, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, Search, Brain, ShieldCheck, Terminal, GitBranch, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import cyberCityImg from "@/assets/cyber-city.png";

const SLIDES = [
  { id: "logo" },
  { id: "tagline" },
  { id: "features" },
  { id: "image" },
  { id: "stats" },
  { id: "cta" },
];

const SLIDE_DURATION = 3000;

const featurePills = [
  { icon: Search, label: "Vulnerability Scanning" },
  { icon: Brain, label: "AI Reasoning" },
  { icon: Terminal, label: "Log Analysis" },
  { icon: ShieldCheck, label: "Auto-Patching" },
  { icon: GitBranch, label: "Agentic Loop" },
  { icon: Zap, label: "Real-time Alerts" },
];

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (showSplash || paused) return;
    if (slide >= SLIDES.length - 1) return; // stop at last slide (CTA)
    const timer = setTimeout(() => setSlide((s) => s + 1), SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [showSplash, slide, paused]);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* ─── Background ─── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(230 25% 5%) 0%, hsl(260 40% 12%) 40%, hsl(280 50% 18%) 60%, hsl(230 25% 5%) 100%)" }} />
        <motion.div className="absolute top-[5%] right-[10%] w-[400px] h-[400px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(270 95% 60%), transparent 70%)" }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, hsl(330 90% 60%), transparent 70%)" }} animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute top-[40%] left-[50%] w-[250px] h-[250px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, hsl(200 95% 55%), transparent 70%)" }} animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(hsl(var(--neon-purple) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-purple) / 0.5) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div key={i} className="absolute rounded-full" style={{ width: 1 + Math.random() * 2, height: 1 + Math.random() * 2, background: i % 3 === 0 ? "hsl(var(--neon-purple))" : i % 3 === 1 ? "hsl(var(--neon-pink))" : "hsl(var(--neon-blue))", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ y: [0, -60, 0], opacity: [0, 0.8, 0] }} transition={{ duration: 3 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 3, ease: "easeInOut" }} />
        ))}
      </div>

      {/* ─── Progress dots ─── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className="relative w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{ background: i === slide ? "hsl(var(--neon-purple))" : "hsl(var(--muted))" }}
          >
            {i === slide && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: "hsl(var(--neon-purple))", boxShadow: "0 0 8px hsl(var(--neon-purple))" }}
                layoutId="activeDot"
              />
            )}
          </button>
        ))}
      </div>

      {/* ─── Slide content ─── */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* Slide 0: Logo reveal */}
          {slide === 0 && (
            <motion.div key="logo" className="flex flex-col items-center text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }} transition={{ duration: 0.5 }}>
              <motion.div
                className="w-28 h-28 md:w-36 md:h-36 rounded-3xl flex items-center justify-center mb-8"
                style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              >
                <Shield className="w-14 h-14 md:w-18 md:h-18 text-primary-foreground" />
              </motion.div>
              <motion.h1
                className="text-5xl md:text-7xl font-display font-bold gradient-text"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                VulnHunter
              </motion.h1>
              <motion.div
                className="mt-3 h-0.5 w-20 rounded-full mx-auto"
                style={{ background: "linear-gradient(90deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              />
            </motion.div>
          )}

          {/* Slide 1: Tagline */}
          {slide === 1 && (
            <motion.div key="tagline" className="flex flex-col items-center text-center px-6 max-w-3xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -80 }} transition={{ duration: 0.5 }}>
              <motion.p
                className="text-sm md:text-base font-display tracking-[0.4em] uppercase text-primary mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Autonomous Security Agent
              </motion.p>
              <motion.h2
                className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                AI that <span className="gradient-text">identifies</span>,{" "}
                <span className="gradient-text">exploits</span>, and{" "}
                <span className="gradient-text">patches</span> vulnerabilities
              </motion.h2>
              <motion.p
                className="text-base md:text-lg text-muted-foreground font-body max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Powered by Chain-of-Thought reasoning for transparent, explainable security testing.
              </motion.p>
            </motion.div>
          )}

          {/* Slide 2: Features */}
          {slide === 2 && (
            <motion.div key="features" className="flex flex-col items-center text-center px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -80 }} transition={{ duration: 0.5 }}>
              <motion.h3
                className="text-xl md:text-2xl font-display font-bold text-foreground mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="gradient-text">Core Capabilities</span>
              </motion.h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
                {featurePills.map((f, i) => (
                  <motion.div
                    key={f.label}
                    className="flex items-center gap-3 px-5 py-4 rounded-2xl glass-card"
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary flex-shrink-0">
                      <f.icon className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-body text-foreground text-left">{f.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Slide 3: Image showcase */}
          {slide === 3 && (
            <motion.div key="image" className="flex flex-col items-center text-center px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }}>
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.img
                  src={cyberCityImg}
                  alt="Cybersecurity visualization"
                  className="w-72 md:w-96 lg:w-[28rem] rounded-2xl mx-auto"
                  style={{ filter: "drop-shadow(0 0 60px hsl(270 95% 60% / 0.35))" }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <motion.p
                className="mt-6 text-sm text-muted-foreground font-body"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Protecting the digital frontier with autonomous intelligence
              </motion.p>
            </motion.div>
          )}

          {/* Slide 4: Stats */}
          {slide === 4 && (
            <motion.div key="stats" className="flex flex-col items-center text-center px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -80 }} transition={{ duration: 0.5 }}>
              <motion.h3
                className="text-xl md:text-2xl font-display font-bold gradient-text mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Why VulnHunter?
              </motion.h3>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                {[
                  { value: "10x", label: "Faster than manual testing" },
                  { value: "500+", label: "Vulnerability patterns" },
                  { value: "24/7", label: "Autonomous monitoring" },
                  { value: "< 1s", label: "Average patch time" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                  >
                    <span className="text-4xl md:text-5xl font-display font-bold gradient-text">{stat.value}</span>
                    <span className="text-xs md:text-sm text-muted-foreground font-body mt-1 max-w-[120px]">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Slide 5: CTA / Login */}
          {slide === 5 && (
            <motion.div
              key="cta"
              className="flex flex-col items-center text-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onAnimationComplete={() => setPaused(true)}
            >
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <Shield className="w-8 h-8 text-primary-foreground" />
              </motion.div>

              <motion.h2
                className="text-3xl md:text-5xl font-display font-bold text-foreground mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Ready to <span className="gradient-text">Hunt</span>?
              </motion.h2>

              <motion.p
                className="text-base text-muted-foreground font-body mb-10 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Sign in or create an account to start scanning your code for vulnerabilities.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  onClick={() => navigate("/login")}
                  className="group flex items-center gap-3 px-10 py-4 rounded-2xl text-primary-foreground font-display text-base font-semibold tracking-wide glow-purple"
                  style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    boxShadow: [
                      "0 0 20px hsl(270 95% 60% / 0.3), 0 0 60px hsl(270 95% 60% / 0.1)",
                      "0 0 35px hsl(270 95% 60% / 0.5), 0 0 80px hsl(270 95% 60% / 0.2)",
                      "0 0 20px hsl(270 95% 60% / 0.3), 0 0 60px hsl(270 95% 60% / 0.1)",
                    ],
                  }}
                  transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
                >
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl glass-card text-foreground font-display text-base font-medium hover:bg-muted/50 transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Create Account
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Skip button ─── */}
      {slide < SLIDES.length - 1 && (
        <motion.button
          className="absolute top-8 right-8 z-30 text-xs font-body text-muted-foreground/50 hover:text-muted-foreground tracking-wider uppercase transition-colors"
          onClick={() => setSlide(SLIDES.length - 1)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Skip →
        </motion.button>
      )}
    </div>
  );
};

export default Index;
