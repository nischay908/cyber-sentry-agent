import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MatrixRain = () => {
  const columns = 30;
  const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";
  
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-neon-green text-xs font-mono leading-none"
          style={{ left: `${(i / columns) * 100}%` }}
          initial={{ y: -200 }}
          animate={{ y: "100vh" }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "linear",
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j} style={{ opacity: 1 - j * 0.05 }}>
              {chars[Math.floor(Math.random() * chars.length)]}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => onComplete(), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MatrixRain />
        
        {/* Scan line */}
        <div className="absolute inset-0 scan-overlay" />

        <div className="relative z-10 text-center">
          {/* Shield logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={phase >= 0 ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="mb-8"
          >
            <div className="relative mx-auto w-28 h-28">
              <motion.svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
              >
                <motion.path
                  d="M50 5 L90 25 L90 55 Q90 80 50 95 Q10 80 10 55 L10 25 Z"
                  fill="none"
                  stroke="hsl(350 100% 50%)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                />
                <motion.path
                  d="M50 15 L80 30 L80 52 Q80 72 50 85 Q20 72 20 52 L20 30 Z"
                  fill="hsl(350 100% 50% / 0.1)"
                  stroke="hsl(190 100% 50%)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, fillOpacity: 0 }}
                  animate={{ pathLength: 1, fillOpacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.6 }}
                />
                {/* Crosshair */}
                <motion.line x1="50" y1="30" x2="50" y2="70" stroke="hsl(350 100% 50%)" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 0.5 }} />
                <motion.line x1="30" y1="50" x2="70" y2="50" stroke="hsl(350 100% 50%)" strokeWidth="1.5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.2, duration: 0.5 }} />
                <motion.circle cx="50" cy="50" r="8" fill="none" stroke="hsl(190 100% 50%)" strokeWidth="1"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4, duration: 0.3 }} />
              </motion.svg>
              
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ boxShadow: ["0 0 20px hsl(350 100% 50% / 0.3)", "0 0 60px hsl(350 100% 50% / 0.6)", "0 0 20px hsl(350 100% 50% / 0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Title */}
          {phase >= 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-wider">
                <span className="text-primary neon-text">RED TEAM</span>
              </h1>
              <motion.h2
                className="text-xl md:text-2xl font-display text-secondary mt-2 cyan-text-glow tracking-[0.3em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                CYBER-SENTRY
              </motion.h2>
            </motion.div>
          )}

          {/* Loading bar */}
          {phase >= 2 && (
            <motion.div
              className="mt-8 mx-auto w-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1 }}
                />
              </div>
              <motion.p
                className="text-xs text-muted-foreground mt-2 font-mono"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                INITIALIZING SECURITY PROTOCOLS...
              </motion.p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
