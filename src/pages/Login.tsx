import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Eye, EyeOff, ArrowRight, ArrowLeft, Mail, Lock, User, Fingerprint, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [showPass, setShowPass] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast({ title: "Error", description: "Please enter your email", variant: "destructive" }); return; }
    setLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetSent(true);
      toast({ title: "Reset email sent!", description: "Check your inbox for the password reset link." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        const { error } = await signUp(email, password, displayName);
        if (error) throw error;
        toast({ title: "Account created!", description: "Welcome to VulnHunter!" });
        navigate("/dashboard");
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: "Welcome back!", description: "Successfully signed in." });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden flex items-center justify-center">
      {/* ─── Animated Background ─── */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, hsl(230 25% 4%) 0%, hsl(260 40% 10%) 35%, hsl(280 45% 16%) 55%, hsl(230 25% 4%) 100%)",
          }}
        />

        {/* Pulsing mesh */}
        <motion.div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, hsl(270 60% 20% / 0.4), transparent)" }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Orbs */}
        <motion.div
          className="absolute -top-[15%] -right-[10%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(270 95% 60% / 0.18), transparent 65%)" }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-[20%] -left-[15%] w-[550px] h-[550px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(330 90% 60% / 0.15), transparent 65%)" }}
          animate={{ scale: [1.1, 1, 1.1], x: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[20%] left-[15%] w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(200 95% 55% / 0.1), transparent 65%)" }}
          animate={{ y: [0, -50, 0], x: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--neon-purple) / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-purple) / 0.6) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px opacity-20"
          style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--neon-purple) / 0.6) 30%, hsl(var(--neon-pink) / 0.4) 70%, transparent 100%)" }}
          animate={{ top: ["-5%", "105%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        {/* Particles */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 1 + Math.random() * 2,
              height: 1 + Math.random() * 2,
              background: i % 3 === 0 ? "hsl(var(--neon-purple))" : i % 3 === 1 ? "hsl(var(--neon-pink))" : "hsl(var(--neon-blue))",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -(40 + Math.random() * 80), 0], opacity: [0, 0.7, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 3 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 4, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ─── Floating Login Card ─── */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.2 }}
      >
        {/* Card glow ring */}
        <div
          className="absolute -inset-[1px] rounded-3xl opacity-40"
          style={{
            background: "linear-gradient(135deg, hsl(var(--neon-purple) / 0.5), hsl(var(--neon-pink) / 0.3), hsl(var(--neon-blue) / 0.2))",
          }}
        />
        <div
          className="absolute -inset-8 rounded-3xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, hsl(270 95% 60% / 0.08), transparent 70%)",
          }}
        />

        <div
          className="relative rounded-3xl px-8 py-10 md:px-10 md:py-12"
          style={{
            background: "hsl(230 25% 8% / 0.85)",
            backdropFilter: "blur(30px)",
            border: "1px solid hsl(var(--border) / 0.4)",
          }}
        >
          {/* Logo + brand */}
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative mb-4">
              <motion.div
                className="absolute inset-0 m-auto w-20 h-20 rounded-full"
                style={{ border: "1px dashed hsl(var(--neon-purple) / 0.15)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                animate={{
                  boxShadow: [
                    "0 0 20px hsl(270 95% 60% / 0.3)",
                    "0 0 40px hsl(270 95% 60% / 0.5)",
                    "0 0 20px hsl(270 95% 60% / 0.3)",
                  ],
                }}
                transition={{ boxShadow: { duration: 2.5, repeat: Infinity } }}
              >
                <Shield className="w-7 h-7 text-primary-foreground" />
              </motion.div>
            </div>
            <span className="font-display font-bold text-lg gradient-text">VulnHunter</span>
          </motion.div>

          {/* Toggle tabs */}
          <motion.div
            className="flex items-center rounded-xl p-1 mb-8"
            style={{ background: "hsl(var(--muted) / 0.3)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-display font-semibold transition-all duration-300 ${
                !isSignup
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={
                !isSignup
                  ? { background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }
                  : {}
              }
            >
              <Fingerprint className="w-4 h-4" />
              Sign In
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-display font-semibold transition-all duration-300 ${
                isSignup
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={
                isSignup
                  ? { background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }
                  : {}
              }
            >
              <Sparkles className="w-4 h-4" />
              Create Account
            </button>
          </motion.div>

          {/* Form */}
          {forgotMode ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {resetSent ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-2xl bg-neon-green/20 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-neon-green" />
                  </div>
                  <p className="text-sm font-body text-foreground font-medium mb-1">Check your email</p>
                  <p className="text-xs text-muted-foreground font-body">We sent a reset link to <span className="text-primary">{email}</span></p>
                  <button onClick={() => { setForgotMode(false); setResetSent(false); }} className="mt-4 text-xs font-body text-primary hover:text-primary/80 transition-colors">
                    ← Back to sign in
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-xs text-muted-foreground font-body">Enter your email and we'll send you a link to reset your password.</p>
                  <div>
                    <label className="block text-xs font-body text-muted-foreground mb-1.5 font-medium">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@gmail.com"
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
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 text-primary-foreground font-display text-sm font-semibold tracking-wide rounded-xl transition-all duration-300 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))", boxShadow: "0 0 25px hsl(270 95% 60% / 0.25)" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <motion.div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                    ) : "Send Reset Link"}
                  </motion.button>
                  <button type="button" onClick={() => setForgotMode(false)} className="w-full text-center text-xs font-body text-muted-foreground hover:text-foreground transition-colors mt-2">
                    ← Back to sign in
                  </button>
                </form>
              )}
            </motion.div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {isSignup && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <label className="block text-xs font-body text-muted-foreground mb-1.5 font-medium">
                    Display Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all duration-300"
                      style={{
                        background: "hsl(var(--muted) / 0.2)",
                        border: "1px solid hsl(var(--border) / 0.4)",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "hsl(270 95% 60% / 0.5)";
                        e.target.style.boxShadow = "0 0 15px hsl(270 95% 60% / 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "hsl(var(--border) / 0.4)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-body text-muted-foreground mb-1.5 font-medium">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all duration-300"
                  style={{
                    background: "hsl(var(--muted) / 0.2)",
                    border: "1px solid hsl(var(--border) / 0.4)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "hsl(270 95% 60% / 0.5)";
                    e.target.style.boxShadow = "0 0 15px hsl(270 95% 60% / 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "hsl(var(--border) / 0.4)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-body text-muted-foreground font-medium">
                  Password
                </label>
                {!isSignup && (
                  <button type="button" onClick={() => setForgotMode(true)} className="text-[11px] font-body text-primary hover:text-primary/80 transition-colors">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all duration-300"
                  style={{
                    background: "hsl(var(--muted) / 0.2)",
                    border: "1px solid hsl(var(--border) / 0.4)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "hsl(270 95% 60% / 0.5)";
                    e.target.style.boxShadow = "0 0 15px hsl(270 95% 60% / 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "hsl(var(--border) / 0.4)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 text-primary-foreground font-display text-sm font-semibold tracking-wide rounded-xl transition-all duration-300 disabled:opacity-50 mt-6"
              style={{
                background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))",
                boxShadow: "0 0 25px hsl(270 95% 60% / 0.25)",
              }}
              whileHover={{ scale: 1.02, boxShadow: "0 0 40px hsl(270 95% 60% / 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  {isSignup ? "Create Account" : "Sign In"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Terms */}
          <p className="mt-5 text-center text-[11px] text-muted-foreground/50 font-body">
            By continuing, you agree to our{" "}
            <span className="text-primary/70 cursor-pointer hover:underline">Terms & Conditions</span>
          </p>
        </div>

        {/* Back to home link */}
        <motion.div
          className="mt-5 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-body text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
