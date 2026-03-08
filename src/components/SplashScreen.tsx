import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => onComplete(), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(230 25% 7%), hsl(270 30% 12%), hsl(230 25% 7%))" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--neon-purple) / 0.3), transparent 70%)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--neon-pink) / 0.2), transparent 70%)" }}
          animate={{ scale: [1.2, 1, 1.2], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative z-10 text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <motion.div
                className="w-24 h-24 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                animate={{ boxShadow: ["0 0 30px hsl(270 95% 60% / 0.4)", "0 0 60px hsl(270 95% 60% / 0.6)", "0 0 30px hsl(270 95% 60% / 0.4)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-12 h-12 text-primary-foreground" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          {phase >= 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight">
                <span className="gradient-text">Red Team</span>
              </h1>
              <motion.p
                className="text-xl md:text-2xl font-display text-muted-foreground mt-2 tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Cyber-Sentry
              </motion.p>
            </motion.div>
          )}

          {/* Loading bar */}
          {phase >= 2 && (
            <motion.div className="mt-8 mx-auto w-64" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)), hsl(var(--neon-blue)))" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <motion.p
                className="text-sm text-muted-foreground mt-3 font-body"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Initializing security protocols...
              </motion.p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
