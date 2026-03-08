import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2400;
    const interval = 30;
    const step = 100 / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current += step + Math.random() * 0.5;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(onComplete, 600);
      }
      setProgress(Math.min(Math.floor(current), 100));
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Brand mark */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h1 className="font-serif text-2xl tracking-[0.3em] text-foreground">
            STUDIO <span className="text-muted-foreground">&</span> FORM
          </h1>
        </motion.div>

        {/* Progress counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <span className="font-sans text-7xl font-extralight tracking-tight text-foreground tabular-nums">
            {progress}<span className="text-muted-foreground text-4xl ml-1">%</span>
          </span>

          {/* Progress bar */}
          <div className="w-48 h-px bg-border relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-foreground"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <motion.p
            className="font-sans text-[10px] tracking-[0.4em] uppercase text-muted-foreground"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading experience
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Preloader;
