import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "SCAN", desc: "Agent scans the target codebase with Semgrep, nmap, and custom rules." },
  { num: "02", title: "IDENTIFY", desc: "Vulnerabilities are classified by severity with Chain-of-Thought reasoning." },
  { num: "03", title: "EXPLOIT", desc: "Agent attempts exploitation, pivoting strategies based on results." },
  { num: "04", title: "PATCH", desc: "Automated patches are generated, applied, and verified for each vulnerability." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
    <div className="container mx-auto px-4 relative">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          <span className="text-secondary">AGENTIC</span> WORKFLOW
        </h2>
        <p className="text-muted-foreground font-mono max-w-xl mx-auto">
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
            {/* Line & dot */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center text-primary font-display text-xs font-bold group-hover:bg-primary/10 group-hover:border-primary transition-all">
                {step.num}
              </div>
              {i < steps.length - 1 && <div className="w-px h-16 bg-gradient-to-b from-primary/30 to-transparent" />}
            </div>
            
            {/* Content */}
            <div className="pb-12">
              <h3 className="font-display text-lg font-bold tracking-wider text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground font-mono">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
