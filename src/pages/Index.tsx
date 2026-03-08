import { useState, useCallback, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, Github, Twitter, Linkedin, Search, Brain, ShieldCheck, Terminal, GitBranch, Zap, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import cyberCityImg from "@/assets/cyber-city.png";

/* ─── Sequential reveal sections ─── */
const REVEAL_SECTIONS = [
  { id: "logo", delay: 0 },
  { id: "title", delay: 800 },
  { id: "subtitle", delay: 1600 },
  { id: "features-preview", delay: 2600 },
  { id: "image", delay: 3600 },
  { id: "cta", delay: 4600 },
];

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [revealPhase, setRevealPhase] = useState(-1);
  const [revealDone, setRevealDone] = useState(false);
  const navigate = useNavigate();

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Sequential reveal after splash
  useEffect(() => {
    if (showSplash) return;
    REVEAL_SECTIONS.forEach((section, i) => {
      setTimeout(() => {
        setRevealPhase(i);
        if (i === REVEAL_SECTIONS.length - 1) {
          setTimeout(() => setRevealDone(true), 800);
        }
      }, section.delay);
    });
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="relative">
      {/* ─── Fixed background ─── */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, hsl(230 25% 5%) 0%, hsl(260 40% 12%) 40%, hsl(280 50% 18%) 60%, hsl(230 25% 5%) 100%)" }}
        />
        <svg className="absolute bottom-0 left-0 w-full h-[70%] opacity-30" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(270 95% 60%)" stopOpacity="0.6" />
              <stop offset="50%" stopColor="hsl(330 90% 60%)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(200 95% 55%)" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="wave2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(200 95% 55%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(270 95% 60%)" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,400 C200,300 400,500 720,350 C1040,200 1200,450 1440,300 L1440,800 L0,800 Z"
            fill="url(#wave1)"
            animate={{ d: ["M0,400 C200,300 400,500 720,350 C1040,200 1200,450 1440,300 L1440,800 L0,800 Z", "M0,350 C200,450 400,300 720,400 C1040,350 1200,250 1440,350 L1440,800 L0,800 Z", "M0,400 C200,300 400,500 720,350 C1040,200 1200,450 1440,300 L1440,800 L0,800 Z"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,500 C300,400 600,600 900,450 C1200,300 1350,500 1440,400 L1440,800 L0,800 Z"
            fill="url(#wave2)"
            animate={{ d: ["M0,500 C300,400 600,600 900,450 C1200,300 1350,500 1440,400 L1440,800 L0,800 Z", "M0,450 C300,550 600,400 900,500 C1200,450 1350,350 1440,450 L1440,800 L0,800 Z", "M0,500 C300,400 600,600 900,450 C1200,300 1350,500 1440,400 L1440,800 L0,800 Z"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
        <motion.div className="absolute top-[10%] right-[15%] w-[300px] h-[300px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(270 95% 60%), transparent 70%)" }} animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute bottom-[20%] left-[10%] w-[200px] h-[200px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, hsl(330 90% 60%), transparent 70%)" }} animate={{ scale: [1.1, 1, 1.1], x: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(hsl(var(--neon-purple) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-purple) / 0.5) 1px, transparent 1px)`, backgroundSize: "80px 80px" }} />
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div key={i} className="absolute rounded-full" style={{ width: 1 + Math.random() * 2, height: 1 + Math.random() * 2, background: i % 3 === 0 ? "hsl(var(--neon-purple))" : i % 3 === 1 ? "hsl(var(--neon-pink))" : "hsl(var(--neon-blue))", left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ y: [0, -80, 0], opacity: [0, 1, 0] }} transition={{ duration: 4 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 4, ease: "easeInOut" }} />
        ))}
      </div>

      {/* ─── SECTION 1: Fullscreen Sequential Reveal ─── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="flex flex-col items-center text-center max-w-4xl">

          {/* Phase 0: Logo */}
          <AnimatePresence>
            {revealPhase >= 0 && (
              <motion.div
                className="mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              >
                <motion.div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                  animate={{ boxShadow: ["0 0 40px hsl(270 95% 60% / 0.3)", "0 0 80px hsl(270 95% 60% / 0.5)", "0 0 40px hsl(270 95% 60% / 0.3)"] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Shield className="w-12 h-12 text-primary-foreground" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 1: Title */}
          <AnimatePresence>
            {revealPhase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 50, filter: "blur(20px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-4"
              >
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold leading-[0.9]">
                  <span className="gradient-text">VULN</span>
                  <span className="text-foreground">HUNTER</span>
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 2: Subtitle + description */}
          <AnimatePresence>
            {revealPhase >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-10"
              >
                <motion.p
                  className="text-sm md:text-base font-display tracking-[0.35em] uppercase text-muted-foreground mb-4"
                  initial={{ opacity: 0, letterSpacing: "0.6em" }}
                  animate={{ opacity: 1, letterSpacing: "0.35em" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Autonomous Security Agent
                </motion.p>
                <motion.p
                  className="text-base md:text-lg text-muted-foreground font-body leading-relaxed max-w-xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  An AI agent that identifies vulnerabilities, executes penetration tests,
                  and applies patches — powered by <span className="text-accent font-medium">Chain-of-Thought reasoning</span>.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 3: Feature pills */}
          <AnimatePresence>
            {revealPhase >= 3 && (
              <motion.div
                className="flex flex-wrap items-center justify-center gap-3 mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {[
                  { icon: Search, label: "Scanning" },
                  { icon: Brain, label: "AI Reasoning" },
                  { icon: Terminal, label: "Log Analysis" },
                  { icon: ShieldCheck, label: "Auto-Patch" },
                  { icon: GitBranch, label: "Agentic Loop" },
                  { icon: Zap, label: "Real-time" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-body text-muted-foreground"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05, borderColor: "hsl(var(--neon-purple) / 0.3)" }}
                  >
                    <item.icon className="w-3.5 h-3.5 text-primary" />
                    {item.label}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 4: Image */}
          <AnimatePresence>
            {revealPhase >= 4 && (
              <motion.div
                className="mb-10 relative"
                initial={{ opacity: 0, y: 60, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src={cyberCityImg}
                    alt="Futuristic cybersecurity visualization"
                    className="w-64 md:w-80 lg:w-96 rounded-2xl mx-auto"
                    style={{ filter: "drop-shadow(0 0 50px hsl(270 95% 60% / 0.3))" }}
                    loading="lazy"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 5: CTA - Enter button */}
          <AnimatePresence>
            {revealPhase >= 5 && (
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <motion.button
                  onClick={() => navigate("/login")}
                  className="group flex items-center gap-3 px-10 py-4 rounded-2xl text-primary-foreground font-display text-base font-semibold tracking-wide transition-all duration-300 hover:scale-105 glow-purple"
                  style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    boxShadow: [
                      "0 0 20px hsl(270 95% 60% / 0.3), 0 0 60px hsl(270 95% 60% / 0.1)",
                      "0 0 30px hsl(270 95% 60% / 0.5), 0 0 80px hsl(270 95% 60% / 0.2)",
                      "0 0 20px hsl(270 95% 60% / 0.3), 0 0 60px hsl(270 95% 60% / 0.1)",
                    ],
                  }}
                  transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
                >
                  <Shield className="w-5 h-5" />
                  Enter VulnHunter
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.p
                  className="text-xs text-muted-foreground/60 font-body"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Sign in or create an account to start scanning
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll indicator - only after reveal done */}
        {revealDone && (
          <motion.div
            className="absolute bottom-8 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-[10px] font-body text-muted-foreground/50 tracking-[0.3em] uppercase">Scroll to explore</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* ─── SECTION 2: Full content (scrollable) ─── */}
      {revealDone && (
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Features */}
          <section id="features" className="py-24 relative">
            <div className="container mx-auto px-4">
              <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4"><span className="gradient-text">Core Capabilities</span></h2>
                <p className="text-muted-foreground font-body max-w-xl mx-auto text-lg">Autonomous penetration testing powered by advanced AI reasoning</p>
              </motion.div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {features.map((f, i) => (
                  <motion.div key={f.title} className="group relative p-6 rounded-2xl glass-card hover:border-primary/30 transition-all duration-500" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6, scale: 1.02 }}>
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 bg-gradient-to-br ${f.gradient}`}>
                      <f.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-base font-semibold mb-2 text-foreground">{f.title}</h3>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section id="how-it-works" className="py-24 relative">
            <div className="container mx-auto px-4">
              <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4"><span className="gradient-text-alt">Agentic Workflow</span></h2>
                <p className="text-muted-foreground font-body max-w-xl mx-auto text-lg">A continuous autonomous loop of detection, analysis, and remediation</p>
              </motion.div>
              <div className="max-w-3xl mx-auto space-y-0">
                {steps.map((step, i) => (
                  <motion.div key={step.num} className="flex gap-6 items-start group" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-primary-foreground font-display text-sm font-bold group-hover:scale-110 transition-transform`}>{step.num}</div>
                      {i < steps.length - 1 && <div className="w-0.5 h-16 bg-gradient-to-b from-border to-transparent" />}
                    </div>
                    <div className="pb-12 pt-2">
                      <h3 className="font-display text-xl font-bold text-foreground mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground font-body leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-24 relative z-10">
            <div className="container mx-auto px-4">
              <motion.div className="max-w-3xl mx-auto text-center glass-card rounded-3xl p-12 relative overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at center, hsl(var(--neon-purple) / 0.2), transparent 70%)" }} />
                <div className="relative z-10">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4"><span className="gradient-text">Ready to Secure Your Code?</span></h2>
                  <p className="text-muted-foreground font-body mb-8 max-w-lg mx-auto">Start scanning for vulnerabilities in seconds. Our AI-powered agent finds threats before attackers do.</p>
                  <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-primary-foreground font-display text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 glow-purple" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}>
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border/30 py-10 relative z-10">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary"><Shield className="w-4 h-4 text-primary-foreground" /></div>
                  <span className="font-display text-sm font-bold gradient-text">VulnHunter</span>
                </div>
                <div className="flex items-center gap-6 text-sm font-body text-muted-foreground">
                  <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                  <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
                  <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
                </div>
                <p className="text-xs text-muted-foreground font-body">© 2026 VulnHunter. Hackathon Project.</p>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  );
};

/* ─── Data ─── */
const features = [
  { icon: Search, title: "Vulnerability Scanning", desc: "Autonomously scans codebases using Semgrep, nmap, and custom heuristics.", gradient: "from-primary to-neon-pink" },
  { icon: Brain, title: "CoT Reasoning", desc: "Explains pivot decisions between exploit attempts transparently.", gradient: "from-neon-pink to-secondary" },
  { icon: Terminal, title: "Log Interpretation", desc: "Parses raw security logs to determine the next optimal step.", gradient: "from-accent to-neon-blue" },
  { icon: ShieldCheck, title: "Auto-Patching", desc: "Applies security patches automatically with rollback capabilities.", gradient: "from-neon-green to-accent" },
  { icon: GitBranch, title: "Agentic Loop", desc: "Continuous cycle: scan → exploit → analyze → patch → verify.", gradient: "from-primary to-accent" },
  { icon: Zap, title: "Real-time Alerts", desc: "Instant critical vulnerability notifications with severity scoring.", gradient: "from-secondary to-neon-pink" },
];

const steps = [
  { num: "01", title: "Scan", desc: "Agent scans the target codebase with Semgrep, nmap, and custom rules.", color: "from-primary to-neon-pink" },
  { num: "02", title: "Identify", desc: "Vulnerabilities are classified by severity with Chain-of-Thought reasoning.", color: "from-neon-pink to-secondary" },
  { num: "03", title: "Exploit", desc: "Agent attempts exploitation, pivoting strategies based on results.", color: "from-accent to-neon-blue" },
  { num: "04", title: "Patch", desc: "Automated patches are generated, applied, and verified.", color: "from-neon-green to-accent" },
];

export default Index;
