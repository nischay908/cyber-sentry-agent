import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large gradient blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30 animate-blob"
        style={{ background: "radial-gradient(circle, hsl(var(--neon-purple) / 0.4), transparent 70%)" }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full opacity-25 animate-blob"
        style={{ background: "radial-gradient(circle, hsl(var(--neon-pink) / 0.4), transparent 70%)", animationDelay: "2s" }}
        animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] rounded-full opacity-20 animate-blob"
        style={{ background: "radial-gradient(circle, hsl(var(--neon-blue) / 0.4), transparent 70%)", animationDelay: "4s" }}
        animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--neon-purple) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-purple) / 0.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: i % 3 === 0 ? "hsl(var(--neon-purple))" : i % 3 === 1 ? "hsl(var(--neon-pink))" : "hsl(var(--neon-blue))",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
