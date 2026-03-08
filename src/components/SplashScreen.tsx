import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const duration = 2600;
    const interval = 30;
    const step = 100 / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current += step + Math.random() * 0.8;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => setExiting(true), 400);
        setTimeout(() => onComplete(), 1000);
      }
      setProgress(Math.min(Math.floor(current), 100));
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(230 25% 7%), hsl(270 30% 12%), hsl(230 25% 7%))" }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
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

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="mb-10"
            >
              <motion.div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                animate={{
                  boxShadow: [
                    "0 0 30px hsl(270 95% 60% / 0.4)",
                    "0 0 60px hsl(270 95% 60% / 0.6)",
                    "0 0 30px hsl(270 95% 60% / 0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-10 h-10 text-primary-foreground" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="gradient-text">VulnHunter</span>
            </motion.h1>

            <motion.p
              className="text-base md:text-lg font-display text-muted-foreground tracking-wide mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Autonomous Security Agent
            </motion.p>

            {/* Percentage counter */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <span className="font-display text-6xl md:text-7xl font-bold tracking-tight tabular-nums gradient-text">
                {progress}
                <span className="text-3xl md:text-4xl text-muted-foreground ml-1">%</span>
              </span>

              {/* Progress bar */}
              <div className="mt-6 w-56 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)), hsl(var(--neon-blue)))",
                    width: `${progress}%`,
                  }}
                />
              </div>

              <motion.p
                className="text-[11px] text-muted-foreground mt-4 font-body tracking-[0.25em] uppercase"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Initializing security protocols
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
