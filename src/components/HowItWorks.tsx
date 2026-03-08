import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Scan", desc: "Agent scans the target codebase with Semgrep, nmap, and custom rules.", color: "from-primary to-neon-pink" },
  { num: "02", title: "Identify", desc: "Vulnerabilities are classified by severity with Chain-of-Thought reasoning.", color: "from-neon-pink to-secondary" },
  { num: "03", title: "Exploit", desc: "Agent attempts exploitation, pivoting strategies based on results.", color: "from-accent to-neon-blue" },
  { num: "04", title: "Patch", desc: "Automated patches are generated, applied, and verified for each vulnerability.", color: "from-neon-green to-accent" },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 relative">
    <div className="container mx-auto px-4 relative">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
          <span className="gradient-text-alt">Agentic Workflow</span>
        </h2>
        <p className="text-muted-foreground font-body max-w-xl mx-auto text-lg">
          A continuous autonomous loop of detection, analysis, and remediation
        </p>
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
              {i < steps.length - 1 && (
                <div className="w-0.5 h-16 bg-gradient-to-b from-border to-transparent" />
              )}
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

export default HowItWorks;
