import { motion } from "framer-motion";
import { Search, Brain, ShieldCheck, Terminal, GitBranch, Zap } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Vulnerability Scanning",
    desc: "Autonomously scans codebases using Semgrep, nmap, and custom heuristics to identify security flaws.",
    accent: "primary",
  },
  {
    icon: Brain,
    title: "Chain-of-Thought Reasoning",
    desc: "Explains why it pivots between exploit attempts, creating transparent attack narratives.",
    accent: "secondary",
  },
  {
    icon: Terminal,
    title: "Log Interpretation",
    desc: "Parses raw security logs and determines the next optimal step in the penetration testing loop.",
    accent: "primary",
  },
  {
    icon: ShieldCheck,
    title: "Auto-Patching",
    desc: "Suggests and applies security patches automatically with rollback capabilities.",
    accent: "secondary",
  },
  {
    icon: GitBranch,
    title: "Agentic Loop",
    desc: "Continuously iterates: scan → exploit → analyze → patch → verify in an autonomous cycle.",
    accent: "primary",
  },
  {
    icon: Zap,
    title: "Real-time Alerts",
    desc: "Instant notifications on critical vulnerabilities with severity scoring and context.",
    accent: "secondary",
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-24 relative">
    <div className="container mx-auto px-4">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          <span className="text-primary">CORE</span> CAPABILITIES
        </h2>
        <p className="text-muted-foreground font-mono max-w-xl mx-auto">
          Autonomous penetration testing powered by advanced AI reasoning
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="group relative p-6 border border-border/50 rounded-sm bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className={`w-10 h-10 flex items-center justify-center rounded-sm mb-4 ${f.accent === "primary" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="font-display text-sm font-semibold tracking-wider mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground font-mono leading-relaxed">{f.desc}</p>
            
            {/* Hover glow */}
            <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ boxShadow: `inset 0 0 30px ${f.accent === "primary" ? "hsl(350 100% 50% / 0.05)" : "hsl(190 100% 50% / 0.05)"}` }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
