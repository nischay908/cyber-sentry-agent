import { motion } from "framer-motion";
import { Shield, Crosshair, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--neon-cyan)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-cyan)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/30 rounded-full mb-8 bg-primary/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary tracking-wider">AUTONOMOUS THREAT DETECTION ACTIVE</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <span className="text-primary neon-text">RED TEAM</span>
            <br />
            <span className="text-foreground">CYBER-</span>
            <span className="text-secondary cyan-text-glow">SENTRY</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-mono leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            An autonomous AI agent that identifies vulnerabilities, executes penetration tests,
            and applies patches — powered by <span className="text-secondary">Chain-of-Thought reasoning</span>.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Link
              to="/login"
              className="group flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-display text-sm tracking-wider rounded-sm hover:shadow-[0_0_30px_hsl(350,100%,50%/0.4)] transition-all duration-300"
            >
              <Shield className="w-4 h-4" />
              LAUNCH SENTRY
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-3 border border-border text-foreground font-display text-sm tracking-wider rounded-sm hover:border-secondary/50 hover:text-secondary transition-all"
            >
              <Crosshair className="w-4 h-4" />
              EXPLORE CAPABILITIES
            </a>
          </motion.div>

          {/* Terminal preview */}
          <motion.div
            className="mt-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <div className="border border-border/50 rounded-sm bg-terminal-bg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
                <div className="w-3 h-3 rounded-full bg-primary/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-neon-green/60" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">sentry@redteam:~</span>
              </div>
              <div className="p-4 text-sm font-mono space-y-1 text-left">
                <TerminalLine delay={1.5} color="text-neon-green">$ sentry scan --target ./codebase --mode aggressive</TerminalLine>
                <TerminalLine delay={2.0} color="text-muted-foreground">[INFO] Initializing Semgrep engine...</TerminalLine>
                <TerminalLine delay={2.5} color="text-muted-foreground">[INFO] Running nmap port scan on 192.168.1.0/24</TerminalLine>
                <TerminalLine delay={3.0} color="text-primary">[VULN] SQL Injection found in /api/users — severity: CRITICAL</TerminalLine>
                <TerminalLine delay={3.5} color="text-secondary">[COT] Previous XSS attempt failed → pivoting to SQLi vector</TerminalLine>
                <TerminalLine delay={4.0} color="text-neon-green">[PATCH] Auto-applying parameterized query fix...</TerminalLine>
                <TerminalLine delay={4.5} color="text-neon-green">✓ Vulnerability patched successfully</TerminalLine>
              </div>
            </div>
          </motion.div>
        </div>
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
