import { motion } from "framer-motion";
import { Shield, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass-card"
            variants={fadeUp}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-neon-green"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-body text-muted-foreground tracking-wide">Autonomous Threat Detection Active</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] mb-6"
            variants={fadeUp}
          >
            <span className="gradient-text">VulnHunter</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body leading-relaxed"
            variants={fadeUp}
          >
            An autonomous AI agent that identifies vulnerabilities, executes penetration tests,
            and applies patches — powered by{" "}
            <span className="text-accent font-medium">Chain-of-Thought reasoning</span>.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={fadeUp}
          >
            <Link
              to="/login"
              className="group flex items-center gap-2 px-8 py-3.5 rounded-xl text-primary-foreground font-display text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 glow-purple"
              style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
            >
              <Shield className="w-4 h-4" />
              Launch VulnHunter
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl glass-card text-foreground font-display text-sm font-medium tracking-wide hover:bg-muted/50 transition-all"
            >
              <Zap className="w-4 h-4 text-accent" />
              Explore Capabilities
            </a>
          </motion.div>

          {/* Terminal preview */}
          <motion.div
            className="mt-16 max-w-2xl mx-auto"
            variants={fadeUp}
          >
            <motion.div
              className="rounded-2xl overflow-hidden glass-card glow-purple"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
                <div className="w-3 h-3 rounded-full bg-destructive/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-neon-green/70" />
                <span className="ml-2 text-xs text-muted-foreground font-body">vulnhunter@agent:~</span>
              </div>
              <div className="p-5 text-sm font-mono space-y-1.5 text-left">
                <TerminalLine delay={0.6} color="text-neon-green">$ vulnhunter scan --target ./codebase --mode aggressive</TerminalLine>
                <TerminalLine delay={1.0} color="text-muted-foreground">[INFO] Initializing Semgrep engine...</TerminalLine>
                <TerminalLine delay={1.4} color="text-muted-foreground">[INFO] Running nmap port scan on 192.168.1.0/24</TerminalLine>
                <TerminalLine delay={1.8} color="text-secondary">[VULN] SQL Injection found in /api/users — severity: CRITICAL</TerminalLine>
                <TerminalLine delay={2.2} color="text-accent">[COT] Previous XSS attempt failed → pivoting to SQLi vector</TerminalLine>
                <TerminalLine delay={2.6} color="text-neon-green">[PATCH] Auto-applying parameterized query fix...</TerminalLine>
                <TerminalLine delay={3.0} color="text-neon-green">✓ Vulnerability patched successfully</TerminalLine>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const TerminalLine = ({ children, delay, color }: { children: React.ReactNode; delay: number; color: string }) => (
  <motion.div
    className={color}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default HeroSection;
