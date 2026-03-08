import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowLeft, Save, User, Github, Linkedin, Sparkles, Check, X, Code, Globe, Lock, Cpu, Cloud, Database, Smartphone, Brain, Gamepad2, Rocket, Zap, Eye, Wifi } from "lucide-react";
import { toast } from "sonner";

const INTEREST_OPTIONS = [
  { id: "web-security", label: "Web Security", icon: Lock, color: "from-red-500 to-orange-500" },
  { id: "penetration-testing", label: "Pen Testing", icon: Shield, color: "from-purple-500 to-pink-500" },
  { id: "cloud-security", label: "Cloud Security", icon: Cloud, color: "from-blue-500 to-cyan-500" },
  { id: "malware-analysis", label: "Malware Analysis", icon: Eye, color: "from-red-600 to-red-400" },
  { id: "network-security", label: "Network Security", icon: Wifi, color: "from-green-500 to-emerald-500" },
  { id: "ai-ml", label: "AI / ML", icon: Brain, color: "from-violet-500 to-purple-500" },
  { id: "blockchain", label: "Blockchain", icon: Database, color: "from-amber-500 to-yellow-500" },
  { id: "mobile-security", label: "Mobile Security", icon: Smartphone, color: "from-pink-500 to-rose-500" },
  { id: "devops", label: "DevOps / CI-CD", icon: Rocket, color: "from-orange-500 to-amber-500" },
  { id: "iot-security", label: "IoT Security", icon: Cpu, color: "from-teal-500 to-green-500" },
  { id: "bug-bounty", label: "Bug Bounty", icon: Zap, color: "from-yellow-500 to-orange-500" },
  { id: "game-hacking", label: "Game Hacking", icon: Gamepad2, color: "from-indigo-500 to-blue-500" },
  { id: "fullstack-dev", label: "Full-Stack Dev", icon: Code, color: "from-cyan-500 to-blue-500" },
  { id: "osint", label: "OSINT", icon: Globe, color: "from-emerald-500 to-teal-500" },
  { id: "cryptography", label: "Cryptography", icon: Lock, color: "from-slate-500 to-zinc-400" },
];

const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Beginner", desc: "Just getting started" },
  { id: "intermediate", label: "Intermediate", desc: "Solid foundation" },
  { id: "advanced", label: "Advanced", desc: "Deep expertise" },
  { id: "expert", label: "Expert", desc: "Industry leader" },
];

const Profile = () => {
  const { user, loading } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("intermediate");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [profileRes, interestsRes] = await Promise.all([
        supabase.from("profiles").select("display_name, avatar_url").eq("user_id", user.id).maybeSingle(),
        supabase.from("user_interests").select("*").eq("user_id", user.id).maybeSingle(),
      ]);
      if (profileRes.data?.display_name) setDisplayName(profileRes.data.display_name);
      if (interestsRes.data) {
        setBio(interestsRes.data.bio || "");
        setGithubUrl(interestsRes.data.github_url || "");
        setLinkedinUrl(interestsRes.data.linkedin_url || "");
        setSelectedInterests((interestsRes.data.interests as string[]) || []);
        setExperienceLevel(interestsRes.data.experience_level || "intermediate");
      }
      setLoaded(true);
    };
    load();
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from("profiles").update({ display_name: displayName }).eq("user_id", user.id);
      
      const { data: existing } = await supabase.from("user_interests").select("id").eq("user_id", user.id).maybeSingle();
      
      const payload = {
        user_id: user.id,
        interests: selectedInterests,
        bio,
        github_url: githubUrl || null,
        linkedin_url: linkedinUrl || null,
        experience_level: experienceLevel,
      };

      if (existing) {
        await supabase.from("user_interests").update(payload).eq("user_id", user.id);
      } else {
        await supabase.from("user_interests").insert(payload);
      }
      toast.success("Profile saved successfully!");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const userInitial = (displayName || user.email || "U")[0]?.toUpperCase();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div className="absolute -top-[15%] -right-[10%] w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, hsl(270 95% 60% / 0.12), transparent 65%)" }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 15, repeat: Infinity }} />
        <motion.div className="absolute -bottom-[10%] -left-[10%] w-[450px] h-[450px] rounded-full" style={{ background: "radial-gradient(circle, hsl(330 90% 60% / 0.1), transparent 65%)" }} animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 18, repeat: Infinity }} />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <nav className="sticky top-0 z-30" style={{ background: "hsl(var(--background) / 0.7)", backdropFilter: "blur(20px)" }}>
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--neon-purple) / 0.2), transparent)" }} />
          <div className="container mx-auto max-w-4xl flex items-center justify-between h-16 px-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <motion.button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-display font-semibold text-primary-foreground"
              style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Profile"}
            </motion.button>
          </div>
        </nav>

        <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
          {/* Profile Header */}
          <motion.div
            className="relative overflow-hidden rounded-3xl p-8"
            style={{ background: "linear-gradient(135deg, hsl(270 40% 12% / 0.8), hsl(280 45% 18% / 0.6))", border: "1px solid hsl(var(--neon-purple) / 0.15)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-display font-bold text-primary-foreground" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}>
                {userInitial}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-3 w-full">
                <div>
                  <label className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1 block">Display Name</label>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-transparent border-b border-border/40 focus:border-primary text-2xl font-display font-bold text-foreground outline-none w-full sm:max-w-sm pb-1 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <p className="text-sm text-muted-foreground font-body">{user.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            className="rounded-2xl p-6"
            style={{ background: "hsl(var(--card) / 0.5)", backdropFilter: "blur(20px)", border: "1px solid hsl(var(--border) / 0.3)" }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> About You
            </h2>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-muted/20 rounded-xl p-4 text-sm font-body text-foreground placeholder:text-muted-foreground border border-border/30 focus:border-primary outline-none transition-colors resize-none"
              placeholder="Tell us about yourself... What drives your interest in security?"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-xs text-muted-foreground font-body flex items-center gap-1.5 mb-1.5"><Github className="w-3.5 h-3.5" /> GitHub URL</label>
                <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="w-full bg-muted/20 rounded-xl px-4 py-2.5 text-sm font-body text-foreground border border-border/30 focus:border-primary outline-none transition-colors" placeholder="https://github.com/username" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-body flex items-center gap-1.5 mb-1.5"><Linkedin className="w-3.5 h-3.5" /> LinkedIn URL</label>
                <input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="w-full bg-muted/20 rounded-xl px-4 py-2.5 text-sm font-body text-foreground border border-border/30 focus:border-primary outline-none transition-colors" placeholder="https://linkedin.com/in/username" />
              </div>
            </div>
          </motion.div>

          {/* Experience Level */}
          <motion.div
            className="rounded-2xl p-6"
            style={{ background: "hsl(var(--card) / 0.5)", backdropFilter: "blur(20px)", border: "1px solid hsl(var(--border) / 0.3)" }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          >
            <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Experience Level
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {EXPERIENCE_LEVELS.map((level) => (
                <motion.button
                  key={level.id}
                  onClick={() => setExperienceLevel(level.id)}
                  className="relative p-4 rounded-xl text-left transition-all"
                  style={{
                    background: experienceLevel === level.id ? "hsl(var(--primary) / 0.15)" : "hsl(var(--muted) / 0.2)",
                    border: `1px solid ${experienceLevel === level.id ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border) / 0.3)"}`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {experienceLevel === level.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <p className="font-display font-semibold text-sm text-foreground">{level.label}</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{level.desc}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Interests */}
          <motion.div
            className="rounded-2xl p-6"
            style={{ background: "hsl(var(--card) / 0.5)", backdropFilter: "blur(20px)", border: "1px solid hsl(var(--border) / 0.3)" }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            <h2 className="font-display font-bold text-lg mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" /> Your Interests
            </h2>
            <p className="text-sm text-muted-foreground font-body mb-5">Select topics you're passionate about. Sentry AI will personalize recommendations based on these.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {INTEREST_OPTIONS.map((interest) => {
                const selected = selectedInterests.includes(interest.id);
                return (
                  <motion.button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className="relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                    style={{
                      background: selected ? "hsl(var(--primary) / 0.12)" : "hsl(var(--muted) / 0.15)",
                      border: `1px solid ${selected ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border) / 0.25)"}`,
                    }}
                    whileHover={{ scale: 1.04, borderColor: "hsl(var(--primary) / 0.3)" }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {selected && (
                      <motion.div
                        className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                      >
                        <Check className="w-2.5 h-2.5 text-primary-foreground" />
                      </motion.div>
                    )}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${interest.color}`}>
                      <interest.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-body font-medium text-foreground text-center leading-tight">{interest.label}</span>
                  </motion.button>
                );
              })}
            </div>
            {selectedInterests.length > 0 && (
              <p className="text-xs text-muted-foreground font-body mt-4">{selectedInterests.length} interest{selectedInterests.length !== 1 ? "s" : ""} selected</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
