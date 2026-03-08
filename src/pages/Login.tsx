import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, ArrowRight, ArrowLeft, Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import loginIllustration from "@/assets/login-illustration.png";

const LoginPage = () => {
  const [showPass, setShowPass] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    <div className="min-h-screen flex bg-background">
      {/* ─── Left: Illustration Panel ─── */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{
          background: "linear-gradient(160deg, hsl(270 40% 12%), hsl(260 50% 18%), hsl(280 45% 15%))",
        }}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Glow orbs */}
        <div
          className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsl(var(--neon-purple)), transparent 70%)" }}
        />
        <div
          className="absolute bottom-[10%] right-[15%] w-[250px] h-[250px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, hsl(var(--neon-pink)), transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col items-center px-12">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5 mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
            >
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">VulnHunter</span>
          </motion.div>

          {/* Illustration */}
          <motion.img
            src={loginIllustration}
            alt="Cybersecurity illustration"
            className="w-full max-w-md rounded-2xl"
            style={{
              filter: "drop-shadow(0 0 40px hsl(270 95% 60% / 0.2))",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            loading="lazy"
          />

          {/* Tagline */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Secure Your Code
            </h2>
            <p className="text-sm text-muted-foreground font-body max-w-xs">
              AI-powered vulnerability detection and automated patching for modern applications.
            </p>
          </motion.div>
        </div>

        {/* Bottom footer */}
        <motion.div
          className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6 text-[11px] text-muted-foreground font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span>© 2026 VulnHunter</span>
          <span>Privacy</span>
          <span>Terms of Service</span>
        </motion.div>
      </motion.div>

      {/* ─── Right: Login Form ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--neon-purple)) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <motion.div
          className="relative z-10 w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Back to home */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          {/* Heading */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              {isSignup ? (
                <span className="gradient-text">Create Account</span>
              ) : (
                <span className="gradient-text">Welcome Back...</span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              {isSignup
                ? "Join the VulnHunter security network"
                : "Please enter your email and password"}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label className="block text-xs font-body text-muted-foreground mb-1.5 font-medium">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="w-full pl-11 pr-4 py-3.5 bg-muted/30 border border-border/50 rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-body text-muted-foreground mb-1.5 font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-muted/30 border border-border/50 rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-body text-muted-foreground font-medium">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] font-body text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3.5 bg-muted/30 border border-border/50 rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
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
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 text-primary-foreground font-display text-sm font-semibold tracking-wide rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 glow-purple"
              style={{
                background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </form>

          {/* Toggle signup/login */}
          <div className="mt-6 text-center">
            <span className="text-sm font-body text-muted-foreground">
              {isSignup ? "Already have an account? " : "Don't have an account? "}
            </span>
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm font-body font-semibold gradient-text hover:opacity-80 transition-opacity"
            >
              {isSignup ? "Sign In" : "Create Account"}
            </button>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-[11px] text-muted-foreground font-body">
            By logging in, you agree to our{" "}
            <span className="text-primary cursor-pointer hover:underline">Terms & Conditions</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
