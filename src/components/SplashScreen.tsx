import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 2600),
      setTimeout(() => onComplete(), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{ background: "hsl(230 25% 5%)" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Scanning grid lines */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`h-${i}`}
              className="absolute left-0 right-0 h-px"
              style={{ top: `${(i + 1) * 5}%`, background: "hsl(var(--neon-purple) / 0.5)" }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 0.5, 0.2] }}
              transition={{ delay: 0.1 + i * 0.03, duration: 0.8 }}
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 w-px"
              style={{ left: `${(i + 1) * 5}%`, background: "hsl(var(--neon-blue) / 0.5)" }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: [0, 0.5, 0.2] }}
              transition={{ delay: 0.2 + i * 0.03, duration: 0.8 }}
            />
          ))}
        </div>

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--neon-purple) / 0.25), transparent 70%)" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1.2], opacity: [0, 0.8, 0.4] }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--neon-pink) / 0.2), transparent 70%)" }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1], x: [0, 60, 30], y: [0, -40, -20] }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(var(--neon-blue) / 0.15), transparent 70%)" }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1], x: [0, -50, -25], y: [0, 30, 15] }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        />

        {/* Scanning sweep line */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] z-20"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--neon-purple)), hsl(var(--neon-pink)), hsl(var(--neon-purple)), transparent)" }}
          initial={{ top: "0%", opacity: 0 }}
          animate={{ top: ["0%", "100%", "0%"], opacity: [0, 0.8, 0] }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
        />

        <div className="relative z-10 text-center">
          {/* Shield Icon with dramatic entrance */}
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.35 }}
          >
            <div className="relative">
              {/* Outer ring pulse */}
              <motion.div
                className="absolute -inset-4 rounded-3xl"
                style={{ border: "2px solid hsl(var(--neon-purple) / 0.3)" }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -inset-8 rounded-3xl"
                style={{ border: "1px solid hsl(var(--neon-pink) / 0.2)" }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />

              <motion.div
                className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
                style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                animate={{
                  boxShadow: [
                    "0 0 20px hsl(270 95% 60% / 0.3), 0 0 60px hsl(270 95% 60% / 0.1)",
                    "0 0 40px hsl(270 95% 60% / 0.5), 0 0 100px hsl(270 95% 60% / 0.2)",
                    "0 0 20px hsl(270 95% 60% / 0.3), 0 0 60px hsl(270 95% 60% / 0.1)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-10 h-10 text-primary-foreground" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title with letter-by-letter animation */}
          {phase >= 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight overflow-hidden">
                {"VulnHunter".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className="gradient-text inline-block"
                    initial={{ y: 50, opacity: 0, rotateX: -90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4, type: "spring", bounce: 0.3 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>
            </motion.div>
          )}

          {/* Tagline */}
          {phase >= 2 && (
            <motion.p
              className="text-base md:text-lg font-display text-muted-foreground mt-3 tracking-widest uppercase"
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.2em" }}
              transition={{ duration: 0.8 }}
            >
              Autonomous Security Agent
            </motion.p>
          )}

          {/* Loading bar with status */}
          {phase >= 3 && (
            <motion.div className="mt-8 mx-auto w-72" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)), hsl(var(--neon-blue)))" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-neon-green"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.p
                  className="text-xs text-muted-foreground font-mono"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Initializing threat detection systems...
                </motion.p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Corner decorations */}
        {phase >= 1 && (
          <>
            <motion.div
              className="absolute top-6 left-6 text-xs font-mono text-muted-foreground/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              v2.0.0
            </motion.div>
            <motion.div
              className="absolute top-6 right-6 text-xs font-mono text-muted-foreground/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              SECURE
            </motion.div>
            <motion.div
              className="absolute bottom-6 left-6 text-xs font-mono text-muted-foreground/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              ◆ VULNHUNTER
            </motion.div>
            <motion.div
              className="absolute bottom-6 right-6 text-xs font-mono text-muted-foreground/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              AI-POWERED
            </motion.div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
