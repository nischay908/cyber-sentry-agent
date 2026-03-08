import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <Shield className="w-6 h-6 text-primary group-hover:drop-shadow-[0_0_8px_hsl(350,100%,50%)] transition-all" />
          <span className="font-display font-bold text-sm tracking-widest">
            <span className="text-primary">RED</span> <span className="text-secondary">SENTRY</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-mono">
          {["Features", "How It Works", "Threat Intel"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-muted-foreground hover:text-foreground transition-colors relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          <Link to="/login" className="px-4 py-2 border border-primary/50 text-primary hover:bg-primary/10 rounded-sm transition-all hover:shadow-[0_0_15px_hsl(350,100%,50%/0.3)] font-display text-xs tracking-wider">
            ACCESS TERMINAL
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
        >
          <div className="flex flex-col gap-4 p-4 text-sm font-mono">
            {["Features", "How It Works", "Threat Intel"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
                {item}
              </a>
            ))}
            <Link to="/login" className="text-primary" onClick={() => setOpen(false)}>ACCESS TERMINAL →</Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
