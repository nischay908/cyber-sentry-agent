import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 border-b border-border/30 bg-background/60 backdrop-blur-2xl"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-base tracking-tight">
            <span className="gradient-text">Red Team</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-body">
          {["Features", "How It Works"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-muted-foreground hover:text-foreground transition-colors relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300 rounded-full" />
            </a>
          ))}
          {user ? (
            <button onClick={signOut} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-all text-sm font-medium">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <Link to="/login" className="px-5 py-2 rounded-lg font-display text-sm font-medium text-primary-foreground transition-all hover:opacity-90 glow-purple" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}>
              Get Started
            </Link>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-2xl"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
        >
          <div className="flex flex-col gap-4 p-4 text-sm">
            {["Features", "How It Works"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
                {item}
              </a>
            ))}
            {user ? (
              <button onClick={() => { signOut(); setOpen(false); }} className="text-left text-muted-foreground hover:text-foreground">Sign Out</button>
            ) : (
              <Link to="/login" className="text-primary font-medium" onClick={() => setOpen(false)}>Get Started →</Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
