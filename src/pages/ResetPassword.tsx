import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSuccess(true);
      toast({ title: "Password updated!", description: "You can now sign in with your new password." });
      setTimeout(() => navigate("/dashboard"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(230 25% 4%) 0%, hsl(260 40% 10%) 35%, hsl(280 45% 16%) 55%, hsl(230 25% 4%) 100%)" }} />
        <motion.div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, hsl(270 60% 20% / 0.4), transparent)" }} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute -top-[15%] -right-[10%] w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, hsl(270 95% 60% / 0.18), transparent 65%)" }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.2 }}
      >
        <div className="absolute -inset-[1px] rounded-3xl opacity-40" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple) / 0.5), hsl(var(--neon-pink) / 0.3), hsl(var(--neon-blue) / 0.2))" }} />

        <div
          className="relative rounded-3xl px-8 py-10 md:px-10 md:py-12"
          style={{ background: "hsl(230 25% 8% / 0.85)", backdropFilter: "blur(30px)", border: "1px solid hsl(var(--border) / 0.4)" }}
        >
          {/* Logo */}
          <motion.div className="flex flex-col items-center mb-8" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <motion.div
              className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
              animate={{ boxShadow: ["0 0 20px hsl(270 95% 60% / 0.3)", "0 0 40px hsl(270 95% 60% / 0.5)", "0 0 20px hsl(270 95% 60% / 0.3)"] }}
              transition={{ boxShadow: { duration: 2.5, repeat: Infinity } }}
            >
              {success ? <Check className="w-7 h-7 text-primary-foreground" /> : <Lock className="w-7 h-7 text-primary-foreground" />}
            </motion.div>
            <span className="font-display font-bold text-lg gradient-text">Reset Password</span>
            <p className="text-xs text-muted-foreground font-body mt-1 text-center">
              {success ? "Password updated successfully!" : isRecovery ? "Enter your new password below" : "Check your email for the reset link"}
            </p>
          </motion.div>

          {isRecovery && !success ? (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-body text-muted-foreground mb-1.5 font-medium">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    required
                    className="w-full pl-11 pr-11 py-3 rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all duration-300"
                    style={{ background: "hsl(var(--muted) / 0.2)", border: "1px solid hsl(var(--border) / 0.4)" }}
                    onFocus={(e) => { e.target.style.borderColor = "hsl(270 95% 60% / 0.5)"; e.target.style.boxShadow = "0 0 15px hsl(270 95% 60% / 0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "hsl(var(--border) / 0.4)"; e.target.style.boxShadow = "none"; }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-body text-muted-foreground mb-1.5 font-medium">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all duration-300"
                    style={{ background: "hsl(var(--muted) / 0.2)", border: "1px solid hsl(var(--border) / 0.4)" }}
                    onFocus={(e) => { e.target.style.borderColor = "hsl(270 95% 60% / 0.5)"; e.target.style.boxShadow = "0 0 15px hsl(270 95% 60% / 0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "hsl(var(--border) / 0.4)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 text-primary-foreground font-display text-sm font-semibold tracking-wide rounded-xl transition-all duration-300 disabled:opacity-50 mt-6"
                style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))", boxShadow: "0 0 25px hsl(270 95% 60% / 0.25)" }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px hsl(270 95% 60% / 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <motion.div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                ) : "Update Password"}
              </motion.button>
            </form>
          ) : !success ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground font-body">If you received a reset email, click the link in it to set a new password.</p>
            </div>
          ) : null}

          {success && (
            <motion.div className="text-center py-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-neon-green" />
              </div>
              <p className="text-sm text-muted-foreground font-body">Redirecting to dashboard...</p>
            </motion.div>
          )}
        </div>

        <motion.div className="mt-5 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-body text-muted-foreground/50 hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
