import { motion } from "framer-motion";

interface ScanProgressProps {
  mode: "code" | "url";
}

const steps = [
  { label: "Initializing scan engine", delay: 0 },
  { label: "Analyzing attack surface", delay: 0.6 },
  { label: "Running vulnerability checks", delay: 1.2 },
  { label: "Testing exploit vectors", delay: 1.8 },
  { label: "Generating report", delay: 2.4 },
];

const ScanProgress = ({ mode }: ScanProgressProps) => {
  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="text-center mb-8">
        <motion.div
          className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{
            background: mode === "code"
              ? "linear-gradient(135deg, hsl(var(--neon-purple) / 0.2), hsl(var(--neon-pink) / 0.2))"
              : "linear-gradient(135deg, hsl(var(--neon-blue) / 0.2), hsl(var(--accent) / 0.2))",
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-10 h-10 rounded-full border-3 border-t-transparent"
            style={{ borderColor: mode === "code" ? "hsl(var(--neon-purple))" : "hsl(var(--neon-blue))", borderTopColor: "transparent" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        <h2 className="font-display text-xl font-bold text-foreground">Scanning in Progress</h2>
        <p className="text-sm text-muted-foreground font-body mt-1">
          {mode === "code" ? "Analyzing code for vulnerabilities..." : "Scanning website for security issues..."}
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.delay }}
          >
            <motion.div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: step.delay + 0.3 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: mode === "code" ? "hsl(var(--neon-purple))" : "hsl(var(--neon-blue))" }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            </motion.div>
            <span className="text-sm font-body text-muted-foreground">{step.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: mode === "code"
                ? "linear-gradient(90deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))"
                : "linear-gradient(90deg, hsl(var(--neon-blue)), hsl(var(--accent)))",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "95%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScanProgress;
