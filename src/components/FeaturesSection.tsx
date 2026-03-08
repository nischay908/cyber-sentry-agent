import { motion } from "framer-motion";
import { Search, Brain, ShieldCheck, Terminal, GitBranch, Zap } from "lucide-react";

const features = [
  { icon: Search, title: "Vulnerability Scanning", desc: "Autonomously scans codebases using Semgrep, nmap, and custom heuristics to identify security flaws.", gradient: "from-primary to-neon-pink" },
  { icon: Brain, title: "Chain-of-Thought Reasoning", desc: "Explains why it pivots between exploit attempts, creating transparent attack narratives.", gradient: "from-neon-pink to-secondary" },
  { icon: Terminal, title: "Log Interpretation", desc: "Parses raw security logs and determines the next optimal step in the penetration testing loop.", gradient: "from-accent to-neon-blue" },
  { icon: ShieldCheck, title: "Auto-Patching", desc: "Suggests and applies security patches automatically with rollback capabilities.", gradient: "from-neon-green to-accent" },
  { icon: GitBranch, title: "Agentic Loop", desc: "Continuously iterates: scan → exploit → analyze → patch → verify in an autonomous cycle.", gradient: "from-primary to-accent" },
  { icon: Zap, title: "Real-time Alerts", desc: "Instant notifications on critical vulnerabilities with severity scoring and context.", gradient: "from-secondary to-neon-pink" },
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
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
          <span className="gradient-text">Core Capabilities</span>
        </h2>
        <p className="text-muted-foreground font-body max-w-xl mx-auto text-lg">
          Autonomous penetration testing powered by advanced AI reasoning
        </p>
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

export default FeaturesSection;
