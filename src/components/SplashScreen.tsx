import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";

const SCAN_LINES = [
  { text: "Connecting to secure network...", color: "text-muted-foreground" },
  { text: "Loading vulnerability database...", color: "text-muted-foreground" },
  { text: "Initializing AI engine...", color: "text-accent" },
  { text: "Calibrating threat detection...", color: "text-neon-green" },
  { text: "System ready.", color: "text-neon-green" },
];

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [ringPhase, setRingPhase] = useState(0);

  useEffect(() => {
    const duration = 3200;
    const interval = 25;
    const step = 100 / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current += step + Math.random() * 0.6;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => setExiting(true), 500);
        setTimeout(() => onComplete(), 1200);
      }
      setProgress(Math.min(Math.floor(current), 100));
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Show scan lines progressively
  useEffect(() => {
    const thresholds = [10, 30, 50, 75, 95];
    const idx = thresholds.filter((t) => progress >= t).length;
    setVisibleLines(idx);
  }, [progress]);

  // Animate ring phases
  useEffect(() => {
    const t1 = setTimeout(() => setRingPhase(1), 300);
    const t2 = setTimeout(() => setRingPhase(2), 800);
    const t3 = setTimeout(() => setRingPhase(3), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(230 25% 5%), hsl(260 35% 10%), hsl(230 25% 5%))" }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ─── Animated background elements ─── */}

          {/* Pulsing gradient orbs */}
          <motion.div
            className="absolute w-[700px] h-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--neon-purple) / 0.25), transparent 65%)" }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--neon-pink) / 0.2), transparent 65%)" }}
            animate={{ scale: [1.3, 1, 1.3], x: [0, 80, 0], y: [0, -50, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--neon-blue) / 0.15), transparent 65%)" }}
            animate={{ scale: [1, 1.2, 1], x: [0, -60, 0], y: [30, -30, 30] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--neon-purple) / 0.8) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-purple) / 0.8) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Floating particles */}
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 1 + Math.random() * 3,
                height: 1 + Math.random() * 3,
                background:
                  i % 3 === 0
                    ? "hsl(var(--neon-purple))"
                    : i % 3 === 1
                    ? "hsl(var(--neon-pink))"
                    : "hsl(var(--neon-blue))",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -(60 + Math.random() * 100), 0],
                x: [0, (Math.random() - 0.5) * 60, 0],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Scanning horizontal lines */}
          <motion.div
            className="absolute left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--neon-purple) / 0.4), transparent)" }}
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--neon-blue) / 0.3), transparent)" }}
            animate={{ top: ["100%", "0%", "100%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />

          {/* ─── Center content ─── */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Rotating rings around logo */}
            <div className="relative mb-10">
              {/* Outer ring */}
              {ringPhase >= 1 && (
                <motion.div
                  className="absolute inset-0 m-auto w-36 h-36 rounded-full border border-dashed"
                  style={{ borderColor: "hsl(var(--neon-purple) / 0.3)" }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 360 }}
                  transition={{ opacity: { duration: 0.5 }, scale: { duration: 0.5 }, rotate: { duration: 20, repeat: Infinity, ease: "linear" } }}
                />
              )}
              {/* Middle ring */}
              {ringPhase >= 2 && (
                <motion.div
                  className="absolute inset-0 m-auto w-28 h-28 rounded-full border"
                  style={{ borderColor: "hsl(var(--neon-pink) / 0.25)" }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: -360 }}
                  transition={{ opacity: { duration: 0.5 }, scale: { duration: 0.5 }, rotate: { duration: 15, repeat: Infinity, ease: "linear" } }}
                >
                  {/* Dot on ring */}
                  <div
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                    style={{ background: "hsl(var(--neon-pink))", boxShadow: "0 0 8px hsl(var(--neon-pink))" }}
                  />
                </motion.div>
              )}
              {/* Inner ring */}
              {ringPhase >= 3 && (
                <motion.div
                  className="absolute inset-0 m-auto w-[88px] h-[88px] rounded-full"
                  style={{ border: "1px solid hsl(var(--neon-blue) / 0.3)" }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 360 }}
                  transition={{ opacity: { duration: 0.5 }, scale: { duration: 0.5 }, rotate: { duration: 10, repeat: Infinity, ease: "linear" } }}
                >
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ background: "hsl(var(--neon-blue))", boxShadow: "0 0 6px hsl(var(--neon-blue))" }}
                  />
                </motion.div>
              )}

              {/* Shield logo */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.35 }}
                className="relative z-10"
              >
                <motion.div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                  animate={{
                    boxShadow: [
                      "0 0 30px hsl(270 95% 60% / 0.4), 0 0 60px hsl(270 95% 60% / 0.1)",
                      "0 0 50px hsl(270 95% 60% / 0.6), 0 0 100px hsl(270 95% 60% / 0.2)",
                      "0 0 30px hsl(270 95% 60% / 0.4), 0 0 60px hsl(270 95% 60% / 0.1)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Shield className="w-10 h-10 text-primary-foreground" />
                </motion.div>
              </motion.div>
            </div>

            {/* Title with letter reveal */}
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <span className="gradient-text">VulnHunter</span>
            </motion.h1>

            <motion.p
              className="text-sm md:text-base font-display text-muted-foreground tracking-[0.3em] uppercase mb-14"
              initial={{ opacity: 0, letterSpacing: "0.6em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              Autonomous Security Agent
            </motion.p>

            {/* Percentage counter - large */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="relative">
                <span className="font-display text-8xl md:text-9xl font-bold tracking-tighter tabular-nums gradient-text">
                  {progress}
                </span>
                <span className="absolute -right-10 top-4 text-3xl text-muted-foreground font-display">%</span>
              </div>

              {/* Progress bar */}
              <div className="mt-4 w-72 h-1.5 bg-muted/50 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    background: "linear-gradient(90deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)), hsl(var(--neon-blue)))",
                    width: `${progress}%`,
                  }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: "linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.3) 50%, transparent 100%)" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>

              {/* Scan log lines */}
              <div className="mt-6 space-y-1 min-h-[100px] w-72">
                {SCAN_LINES.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={i}
                    className={`text-[11px] font-mono ${line.color} flex items-center gap-2`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-muted-foreground/50">›</span>
                    {line.text}
                  </motion.div>
                ))}
                {progress < 100 && (
                  <motion.span
                    className="inline-block w-1.5 h-3.5 bg-neon-green ml-3"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-8 left-8 text-[10px] font-mono text-muted-foreground/30 space-y-1">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              SYS.VERSION: 2.6.0
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
              NODE: ACTIVE
            </motion.div>
          </div>
          <div className="absolute top-8 right-8 text-[10px] font-mono text-muted-foreground/30 text-right space-y-1">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
              PROTOCOL: SECURE
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }}>
              STATUS: ONLINE
            </motion.div>
          </div>
          <div className="absolute bottom-8 left-8 text-[10px] font-mono text-muted-foreground/30">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
              © 2026 VULNHUNTER
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
