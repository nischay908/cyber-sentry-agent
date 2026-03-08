import { motion } from "framer-motion";

const GeometricScene = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Large concrete cube - main form */}
      <motion.div
        className="absolute animate-float-slow"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        style={{ top: "18%", left: "20%" }}
      >
        <div className="w-36 h-36 md:w-48 md:h-48 relative" style={{ perspective: "600px" }}>
          {/* Front face */}
          <div
            className="absolute inset-0 rounded-sm"
            style={{
              background: "linear-gradient(145deg, hsl(0 0% 82%), hsl(0 0% 72%))",
              transform: "rotateX(5deg) rotateY(-15deg)",
              boxShadow: "20px 20px 60px hsl(0 0% 70% / 0.3), -5px -5px 20px hsl(0 0% 95% / 0.2)",
            }}
          />
          {/* Top face */}
          <div
            className="absolute w-full h-8 md:h-10 top-0 left-0 rounded-t-sm"
            style={{
              background: "linear-gradient(180deg, hsl(0 0% 88%), hsl(0 0% 80%))",
              transform: "rotateX(5deg) rotateY(-15deg) translateY(-8px)",
            }}
          />
        </div>
      </motion.div>

      {/* Tall vertical slab */}
      <motion.div
        className="absolute animate-float-medium"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        style={{ top: "25%", right: "18%" }}
      >
        <div
          className="w-16 md:w-20 h-52 md:h-64 rounded-sm"
          style={{
            background: "linear-gradient(160deg, hsl(0 0% 78%), hsl(0 0% 65%))",
            transform: "rotateY(10deg)",
            boxShadow: "15px 25px 50px hsl(0 0% 60% / 0.25)",
          }}
        />
      </motion.div>

      {/* Small floating cube */}
      <motion.div
        className="absolute"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        style={{ bottom: "30%", left: "35%" }}
      >
        <motion.div
          animate={{ y: [-5, 5, -5], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="w-14 h-14 md:w-18 md:h-18 rounded-sm"
            style={{
              background: "linear-gradient(135deg, hsl(0 0% 85%), hsl(0 0% 75%))",
              transform: "rotateX(10deg) rotateY(25deg)",
              boxShadow: "10px 15px 40px hsl(0 0% 65% / 0.3)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Monstera leaf */}
      <motion.div
        className="absolute animate-float-leaf"
        initial={{ opacity: 0, x: 30, rotate: -20 }}
        animate={{ opacity: 1, x: 0, rotate: -5 }}
        transition={{ duration: 1.4, delay: 1.8 }}
        style={{ bottom: "20%", right: "25%" }}
      >
        <svg width="140" height="180" viewBox="0 0 140 180" fill="none" className="md:w-[180px] md:h-[230px]">
          {/* Stem */}
          <path
            d="M70 180 C70 140, 65 100, 70 60"
            stroke="hsl(150 40% 35%)"
            strokeWidth="3"
            fill="none"
          />
          {/* Main leaf shape with holes */}
          <path
            d="M70 60 C40 50, 15 30, 20 10 C25 0, 45 5, 55 15 C58 8, 65 2, 75 5 C85 2, 92 8, 95 15 C105 5, 125 0, 128 10 C133 30, 108 50, 70 60Z"
            fill="hsl(150 50% 38%)"
          />
          {/* Leaf detail - lighter areas */}
          <path
            d="M70 55 C55 48, 35 35, 38 18 C50 25, 60 35, 70 50Z"
            fill="hsl(150 45% 44%)"
            opacity="0.6"
          />
          <path
            d="M70 55 C85 48, 105 35, 102 18 C90 25, 80 35, 70 50Z"
            fill="hsl(150 45% 44%)"
            opacity="0.6"
          />
          {/* Fenestrations (holes) */}
          <ellipse cx="48" cy="30" rx="6" ry="8" fill="hsl(var(--warm-beige))" transform="rotate(-10 48 30)" />
          <ellipse cx="92" cy="30" rx="6" ry="8" fill="hsl(var(--warm-beige))" transform="rotate(10 92 30)" />
          <ellipse cx="65" cy="22" rx="4" ry="5" fill="hsl(var(--warm-beige))" />
        </svg>
      </motion.div>

      {/* Sphere accent */}
      <motion.div
        className="absolute"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 2 }}
        style={{ top: "15%", right: "40%" }}
      >
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="w-10 h-10 md:w-14 md:h-14 rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 35%, hsl(0 0% 92%), hsl(0 0% 75%))",
              boxShadow: "8px 8px 25px hsl(0 0% 70% / 0.3)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Ground shadow */}
      <motion.div
        className="absolute bottom-[12%] left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, scaleX: 0.5 }}
        animate={{ opacity: 0.15, scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      >
        <div
          className="w-72 md:w-96 h-4 rounded-full"
          style={{ background: "radial-gradient(ellipse, hsl(0 0% 50%), transparent 70%)" }}
        />
      </motion.div>
    </div>
  );
};

export default GeometricScene;
