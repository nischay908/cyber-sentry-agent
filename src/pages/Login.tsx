import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, ArrowRight, Github } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [showPass, setShowPass] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--neon-cyan)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-cyan)) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
      
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[120px]" />

      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Card */}
        <div className="border border-border/50 rounded-sm bg-card/80 backdrop-blur-xl overflow-hidden">
          {/* Header */}
          <div className="border-b border-border/50 p-6 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <Shield className="w-6 h-6 text-primary group-hover:drop-shadow-[0_0_8px_hsl(350,100%,50%)]" />
              <span className="font-display font-bold text-sm tracking-widest">
                <span className="text-primary">RED</span> <span className="text-secondary">SENTRY</span>
              </span>
            </Link>
            <h1 className="font-display text-xl font-bold tracking-wider">
              {isSignup ? "CREATE ACCOUNT" : "ACCESS TERMINAL"}
            </h1>
            <p className="text-sm text-muted-foreground font-mono mt-1">
              {isSignup ? "Join the Red Team" : "Authenticate to proceed"}
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {isSignup && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <label className="block text-xs font-mono text-muted-foreground mb-1.5 tracking-wider">CALLSIGN</label>
                <input
                  type="text"
                  placeholder="Agent codename"
                  className="w-full px-4 py-2.5 bg-muted/50 border border-border/50 rounded-sm text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_10px_hsl(350,100%,50%/0.1)] transition-all"
                />
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5 tracking-wider">EMAIL IDENTIFIER</label>
              <input
                type="email"
                placeholder="agent@redteam.sec"
                className="w-full px-4 py-2.5 bg-muted/50 border border-border/50 rounded-sm text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_10px_hsl(350,100%,50%/0.1)] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5 tracking-wider">PASSPHRASE</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-muted/50 border border-border/50 rounded-sm text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:shadow-[0_0_10px_hsl(350,100%,50%/0.1)] transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-display text-sm tracking-wider rounded-sm hover:shadow-[0_0_25px_hsl(350,100%,50%/0.4)] transition-all duration-300"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {isSignup ? "REGISTER" : "AUTHENTICATE"}
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-3 text-muted-foreground font-mono">OR</span>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-6 py-2.5 border border-border/50 text-foreground font-mono text-sm rounded-sm hover:border-muted-foreground/50 hover:bg-muted/30 transition-all">
              <Github className="w-4 h-4" />
              Continue with GitHub
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-border/50 p-4 text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-xs font-mono text-muted-foreground hover:text-secondary transition-colors"
            >
              {isSignup ? "Already have access? " : "Need an account? "}
              <span className="text-secondary">{isSignup ? "Sign in" : "Register"}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
