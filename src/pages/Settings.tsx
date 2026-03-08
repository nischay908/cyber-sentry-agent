import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Bell, Palette, Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { user, loading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const handleChangePassword = async () => {
    if (newPassword.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords don't match"); return; }
    setChangingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else { toast.success("Password updated!"); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
    setChangingPw(false);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div className="absolute -top-[15%] -right-[10%] w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, hsl(270 95% 60% / 0.12), transparent 65%)" }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 15, repeat: Infinity }} />
      </div>

      <div className="relative z-10">
        <nav className="sticky top-0 z-30" style={{ background: "hsl(var(--background) / 0.7)", backdropFilter: "blur(20px)" }}>
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--neon-purple) / 0.2), transparent)" }} />
          <div className="container mx-auto max-w-4xl flex items-center h-16 px-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>
        </nav>

        <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-display font-bold mb-2">Settings</h1>
            <p className="text-sm text-muted-foreground font-body">Manage your account preferences</p>
          </motion.div>

          {/* Change Password */}
          <motion.div
            className="rounded-2xl p-6"
            style={{ background: "hsl(var(--card) / 0.5)", backdropFilter: "blur(20px)", border: "1px solid hsl(var(--border) / 0.3)" }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> Change Password
            </h2>
            <div className="space-y-4 max-w-md">
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-muted/20 rounded-xl px-4 py-2.5 text-sm font-body text-foreground border border-border/30 focus:border-primary outline-none transition-colors pr-10"
                  placeholder="New password"
                />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <input
                type={showPw ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-muted/20 rounded-xl px-4 py-2.5 text-sm font-body text-foreground border border-border/30 focus:border-primary outline-none transition-colors"
                placeholder="Confirm new password"
              />
              <motion.button
                onClick={handleChangePassword}
                disabled={changingPw || !newPassword}
                className="px-6 py-2.5 rounded-xl text-sm font-display font-semibold text-primary-foreground disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {changingPw ? "Updating..." : "Update Password"}
              </motion.button>
            </div>
          </motion.div>

          {/* Account Info */}
          <motion.div
            className="rounded-2xl p-6"
            style={{ background: "hsl(var(--card) / 0.5)", backdropFilter: "blur(20px)", border: "1px solid hsl(var(--border) / 0.3)" }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" /> Account Info
            </h2>
            <div className="space-y-3 text-sm font-body">
              <div className="flex items-center justify-between py-2 border-b border-border/20">
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/20">
                <span className="text-muted-foreground">Member since</span>
                <span className="text-foreground">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">User ID</span>
                <span className="text-foreground text-xs font-mono">{user.id.slice(0, 12)}...</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
