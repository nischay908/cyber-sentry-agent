import { useState, useCallback } from "react";
import Preloader from "@/components/Preloader";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GeometricScene from "@/components/GeometricScene";

const navItems = ["Home", "Projects", "Philosophy", "About"];

const Index = () => {
  const [loading, setLoading] = useState(true);

  const handleComplete = useCallback(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <Preloader onComplete={handleComplete} />;
  }

  return (
    <motion.div
      className="h-screen w-screen flex overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ─── Left Half: White ─── */}
      <div className="relative w-full lg:w-1/2 h-full bg-background flex flex-col justify-between px-8 md:px-16 py-10">
        {/* Navigation */}
        <motion.nav
          className="flex gap-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {navItems.map((item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {item}
              </motion.span>
            </a>
          ))}
        </motion.nav>

        {/* Hero text */}
        <div className="flex-1 flex flex-col justify-center max-w-md">
          <motion.h1
            className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-foreground mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            The{" "}
            <span className="italic font-light">Subtlety</span>
            <br />
            of Design.
          </motion.h1>

          <motion.p
            className="font-sans text-sm leading-relaxed text-muted-foreground max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            Architecture that exists in harmony. We define space
            with light and balance.
          </motion.p>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.2em] uppercase text-foreground hover:text-muted-foreground transition-colors duration-300 group"
            >
              <span>Explore Projects</span>
              <span className="w-8 h-px bg-foreground group-hover:w-12 transition-all duration-300" />
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <span className="font-serif text-sm tracking-[0.15em] text-foreground">
            STUDIO <span className="text-muted-foreground">&</span> FORM
          </span>
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            © 2026
          </span>
        </motion.div>
      </div>

      {/* ─── Center divider ─── */}
      <motion.div
        className="hidden lg:block center-divider flex-shrink-0"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: "top" }}
      />

      {/* ─── Right Half: Beige with 3D scene ─── */}
      <motion.div
        className="hidden lg:block w-1/2 h-full"
        style={{ background: "hsl(var(--warm-beige))" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <GeometricScene />
      </motion.div>
    </motion.div>
  );
};

export default Index;
