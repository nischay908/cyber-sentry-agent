import { useState, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import cyberCityImg from "@/assets/cyber-city.png";

const navItems = ["Home", "Features", "How It Works", "About"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ─── Background: Vibrant gradient waves ─── */}
      <div className="fixed inset-0 z-0">
        {/* Base dark gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, hsl(230 25% 7%) 0%, hsl(260 40% 15%) 40%, hsl(280 50% 20%) 60%, hsl(230 25% 7%) 100%)",
          }}
        />

        {/* Flowing wave shapes */}
        <svg className="absolute bottom-0 left-0 w-full h-[70%] opacity-40" viewBox="0 0 1440 800" preserveAspectRatio="none">
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
            animate={{
              d: [
                "M0,400 C200,300 400,500 720,350 C1040,200 1200,450 1440,300 L1440,800 L0,800 Z",
                "M0,350 C200,450 400,300 720,400 C1040,350 1200,250 1440,350 L1440,800 L0,800 Z",
                "M0,400 C200,300 400,500 720,350 C1040,200 1200,450 1440,300 L1440,800 L0,800 Z",
              ],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,500 C300,400 600,600 900,450 C1200,300 1350,500 1440,400 L1440,800 L0,800 Z"
            fill="url(#wave2)"
            animate={{
              d: [
                "M0,500 C300,400 600,600 900,450 C1200,300 1350,500 1440,400 L1440,800 L0,800 Z",
                "M0,450 C300,550 600,400 900,500 C1200,450 1350,350 1440,450 L1440,800 L0,800 Z",
                "M0,500 C300,400 600,600 900,450 C1200,300 1350,500 1440,400 L1440,800 L0,800 Z",
              ],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* Floating orbs */}
        <motion.div
          className="absolute top-[10%] right-[15%] w-[300px] h-[300px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsl(270 95% 60%), transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[10%] w-[200px] h-[200px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, hsl(330 90% 60%), transparent 70%)" }}
          animate={{ scale: [1.1, 1, 1.1], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--neon-purple) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-purple) / 0.5) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 3 === 0 ? "hsl(var(--neon-purple))" : i % 3 === 1 ? "hsl(var(--neon-pink))" : "hsl(var(--neon-blue))",
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{ y: [0, -80, 0], opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 5, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 min-h-screen">
        {/* Navbar */}
        <motion.nav
          className="flex items-center justify-between px-8 md:px-16 py-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}>
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg gradient-text">VulnHunter</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item}
                href={item === "Home" ? "#" : `#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg font-display text-sm font-medium text-primary-foreground transition-all hover:opacity-90 glow-purple"
              style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
            >
              Get Started
            </Link>
          </div>
        </motion.nav>

        {/* ─── Hero: Split layout ─── */}
        <section className="flex flex-col lg:flex-row items-center min-h-[calc(100vh-80px)] px-8 md:px-16 gap-8 lg:gap-0">
          {/* Left: Text content */}
          <motion.div
            className="flex-1 flex flex-col justify-center max-w-2xl py-12"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold leading-[0.95] mb-6"
              variants={fadeUp}
            >
              <span className="gradient-text">VULN</span>
              <br />
              <span className="text-foreground">HUNTER</span>
            </motion.h1>

            <motion.p
              className="text-base md:text-lg text-muted-foreground font-body leading-relaxed max-w-md mb-8"
              variants={fadeUp}
            >
              An autonomous AI agent that identifies
              <br className="hidden md:block" />
              vulnerabilities, executes penetration tests,
              <br className="hidden md:block" />
              and applies patches — powered by
              <br className="hidden md:block" />
              <span className="text-accent font-medium">Chain-of-Thought reasoning</span>.
            </motion.p>

            <motion.div className="flex items-center gap-4 mb-12" variants={fadeUp}>
              <Link
                to="/login"
                className="group flex items-center gap-2 px-8 py-3.5 rounded-xl text-primary-foreground font-display text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 glow-purple"
                style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
              >
                Launch Scanner
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="px-6 py-3.5 rounded-xl glass-card text-foreground font-display text-sm font-medium tracking-wide hover:bg-muted/50 transition-all"
              >
                Learn More
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div className="flex items-center gap-4" variants={fadeUp}>
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Hero visual */}
          <motion.div
            className="flex-1 flex items-center justify-center relative"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={cyberCityImg}
                alt="Futuristic cybersecurity visualization"
                className="w-full max-w-lg xl:max-w-xl rounded-3xl"
                style={{
                  filter: "drop-shadow(0 0 40px hsl(270 95% 60% / 0.3)) drop-shadow(0 0 80px hsl(330 90% 60% / 0.15))",
                }}
                loading="lazy"
              />
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 60px hsl(270 95% 60% / 0.1), 0 0 100px hsl(270 95% 60% / 0.15)",
                }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* ─── Features Section ─── */}
        <FeaturesInline />

        {/* ─── How It Works ─── */}
        <HowItWorksInline />

        {/* ─── CTA Section ─── */}
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-3xl mx-auto text-center glass-card rounded-3xl p-12 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at center, hsl(var(--neon-purple) / 0.2), transparent 70%)" }} />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  <span className="gradient-text">Ready to Secure Your Code?</span>
                </h2>
                <p className="text-muted-foreground font-body mb-8 max-w-lg mx-auto">
                  Start scanning for vulnerabilities in seconds. Our AI-powered agent finds threats before attackers do.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-primary-foreground font-display text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 glow-purple"
                  style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="border-t border-border/30 py-10 relative z-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                  <Shield className="w-4 h-4 text-primary-foreground" />
                </div>
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
      </div>
    </motion.div>
  );
};

/* ─── Inline Features ─── */
import { Search, Brain, ShieldCheck, Terminal, GitBranch, Zap } from "lucide-react";

const features = [
  { icon: Search, title: "Vulnerability Scanning", desc: "Autonomously scans codebases using Semgrep, nmap, and custom heuristics.", gradient: "from-primary to-neon-pink" },
  { icon: Brain, title: "CoT Reasoning", desc: "Explains pivot decisions between exploit attempts transparently.", gradient: "from-neon-pink to-secondary" },
  { icon: Terminal, title: "Log Interpretation", desc: "Parses raw security logs to determine the next optimal step.", gradient: "from-accent to-neon-blue" },
  { icon: ShieldCheck, title: "Auto-Patching", desc: "Applies security patches automatically with rollback capabilities.", gradient: "from-neon-green to-accent" },
  { icon: GitBranch, title: "Agentic Loop", desc: "Continuous cycle: scan → exploit → analyze → patch → verify.", gradient: "from-primary to-accent" },
  { icon: Zap, title: "Real-time Alerts", desc: "Instant critical vulnerability notifications with severity scoring.", gradient: "from-secondary to-neon-pink" },
];

const FeaturesInline = () => (
  <section id="features" className="py-24 relative">
    <div className="container mx-auto px-4">
      <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4"><span className="gradient-text">Core Capabilities</span></h2>
        <p className="text-muted-foreground font-body max-w-xl mx-auto text-lg">Autonomous penetration testing powered by advanced AI reasoning</p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="group relative p-6 rounded-2xl glass-card hover:border-primary/30 transition-all duration-500"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6, scale: 1.02 }}
          >
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
);

/* ─── Inline How It Works ─── */
const steps = [
  { num: "01", title: "Scan", desc: "Agent scans the target codebase with Semgrep, nmap, and custom rules.", color: "from-primary to-neon-pink" },
  { num: "02", title: "Identify", desc: "Vulnerabilities are classified by severity with Chain-of-Thought reasoning.", color: "from-neon-pink to-secondary" },
  { num: "03", title: "Exploit", desc: "Agent attempts exploitation, pivoting strategies based on results.", color: "from-accent to-neon-blue" },
  { num: "04", title: "Patch", desc: "Automated patches are generated, applied, and verified.", color: "from-neon-green to-accent" },
];

const HowItWorksInline = () => (
  <section id="how-it-works" className="py-24 relative">
    <div className="container mx-auto px-4">
      <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4"><span className="gradient-text-alt">Agentic Workflow</span></h2>
        <p className="text-muted-foreground font-body max-w-xl mx-auto text-lg">A continuous autonomous loop of detection, analysis, and remediation</p>
      </motion.div>
      <div className="max-w-3xl mx-auto space-y-0">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            className="flex gap-6 items-start group"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-primary-foreground font-display text-sm font-bold group-hover:scale-110 transition-transform`}>
                {step.num}
              </div>
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
);

export default Index;
