import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, LogOut, Home, History, Zap, Bug, AlertTriangle, Activity, Scan, Sparkles } from "lucide-react";
import ScanForm, { type ScanMode } from "@/components/dashboard/ScanForm";
import ScanResults from "@/components/dashboard/ScanResults";
import ScanProgress from "@/components/dashboard/ScanProgress";
import { generateScanResults, type ScanResult, type Vulnerability } from "@/lib/scanEngine";

type DashboardView = "home" | "scanning" | "results";

/* Animated counter */
const useAnimatedCounter = (target: number, duration = 1200) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

const StatCard = ({ stat, index }: { stat: { label: string; value: number; icon: any; gradient: string; glow: string }; index: number }) => {
  const animatedValue = useAnimatedCounter(stat.value);
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl p-5 cursor-default"
      style={{
        background: "hsl(var(--card) / 0.5)",
        backdropFilter: "blur(20px)",
        border: "1px solid hsl(var(--border) / 0.3)",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      whileHover={{
        y: -4,
        boxShadow: `0 10px 40px ${stat.glow}`,
        borderColor: "hsl(var(--neon-purple) / 0.3)",
      }}
    >
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${stat.glow}, transparent 70%)` }}
      />
      <div className="relative z-10">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} mb-3`}>
          <stat.icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <p className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
          {animatedValue}
        </p>
        <p className="text-xs text-muted-foreground font-body font-medium">{stat.label}</p>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const [view, setView] = useState<DashboardView>("home");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode>("code");
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [showVerdict, setShowVerdict] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
            animate={{ boxShadow: ["0 0 20px hsl(270 95% 60% / 0.3)", "0 0 40px hsl(270 95% 60% / 0.5)", "0 0 20px hsl(270 95% 60% / 0.3)"] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Shield className="w-6 h-6 text-primary-foreground" />
          </motion.div>
          <motion.div
            className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const handleStartScan = async (data: { mode: ScanMode; content: string; language: string }) => {
    setIsScanning(true);
    setScanMode(data.mode);
    setView("scanning");
    try {
      const result = await generateScanResults(data.mode, data.content, data.language);
      setScanResult(result);
      setScanHistory(prev => [result, ...prev]);
      setShowVerdict(true);
    } catch {
      setView("home");
    } finally {
      setIsScanning(false);
    }
  };

  const handleNewScan = () => { setScanResult(null); setView("home"); };

  const totalScans = scanHistory.length;
  const totalVulns = scanHistory.reduce((acc, s) => acc + s.vulnerabilities.length, 0);
  const criticalVulns = scanHistory.reduce((acc, s) => acc + s.summary.critical + s.summary.high, 0);
  const patchedCount = scanHistory.reduce((acc, s) => acc + s.vulnerabilities.filter(v => v.fix).length, 0);

  const userInitial = user.user_metadata?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U";
  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "User";

  const stats = [
    { label: "Total Scans", value: totalScans, icon: Scan, gradient: "from-primary to-neon-pink", glow: "hsl(270 95% 60% / 0.15)" },
    { label: "Vulnerabilities", value: totalVulns, icon: Bug, gradient: "from-secondary to-neon-pink", glow: "hsl(330 90% 60% / 0.15)" },
    { label: "Critical / High", value: criticalVulns, icon: AlertTriangle, gradient: "from-destructive to-orange-500", glow: "hsl(0 84% 60% / 0.15)" },
    { label: "Auto-Patched", value: patchedCount, icon: Sparkles, gradient: "from-neon-green to-accent", glow: "hsl(150 80% 50% / 0.15)" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* ─── Animated Background ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          className="absolute -top-[15%] -right-[10%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(270 95% 60% / 0.12), transparent 65%)" }}
          animate={{ scale: [1, 1.15, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-[10%] -left-[10%] w-[450px] h-[450px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(330 90% 60% / 0.1), transparent 65%)" }}
          animate={{ scale: [1.1, 1, 1.1], x: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(200 95% 55% / 0.06), transparent 65%)" }}
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--neon-purple) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-purple) / 0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px opacity-10"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--neon-purple) / 0.5), hsl(var(--neon-pink) / 0.3), transparent)" }}
          animate={{ top: ["-2%", "102%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
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
            animate={{ y: [0, -(30 + Math.random() * 60), 0], opacity: [0, 0.5, 0] }}
            transition={{ duration: 4 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 3, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* ─── Premium Nav ─── */}
        <nav className="sticky top-0 z-30" style={{ background: "hsl(var(--background) / 0.7)", backdropFilter: "blur(20px)" }}>
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--neon-purple) / 0.2), hsl(var(--neon-pink) / 0.15), transparent)" }} />
          <div className="container mx-auto max-w-6xl flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2.5 group">
                <motion.div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Shield className="w-4.5 h-4.5 text-primary-foreground" />
                </motion.div>
                <span className="font-display font-bold text-sm gradient-text hidden sm:inline">VulnHunter</span>
              </Link>
              <div className="h-5 w-px bg-border/30" />
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-neon-green" />
                <span className="text-xs text-muted-foreground font-body font-medium">Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-body text-muted-foreground hover:text-foreground transition-all"
                  style={{ border: "1px solid hsl(var(--border) / 0.3)" }}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </motion.div>

              {/* User avatar */}
              <div className="flex items-center gap-2.5 pl-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-display font-bold text-primary-foreground"
                  style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple) / 0.8), hsl(var(--neon-pink) / 0.8))" }}
                >
                  {userInitial}
                </div>
                <motion.button
                  onClick={signOut}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-body text-muted-foreground hover:text-destructive transition-all"
                  style={{ border: "1px solid hsl(var(--border) / 0.3)" }}
                  whileHover={{ scale: 1.05, borderColor: "hsl(0 84% 60% / 0.3)" }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </div>
            </div>
          </div>
        </nav>

        {/* ─── Main Content ─── */}
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <AnimatePresence mode="wait">
            {view === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Welcome banner */}
                <motion.div
                  className="relative overflow-hidden rounded-3xl p-8 md:p-10"
                  style={{
                    background: "linear-gradient(135deg, hsl(270 40% 12% / 0.8), hsl(280 45% 18% / 0.6))",
                    border: "1px solid hsl(var(--neon-purple) / 0.15)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Inner glow */}
                  <div className="absolute top-0 right-0 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, hsl(270 95% 60% / 0.1), transparent 60%)" }} />
                  <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full" style={{ background: "radial-gradient(circle, hsl(330 90% 60% / 0.06), transparent 60%)" }} />

                  <div className="relative z-10">
                    <motion.div
                      className="flex items-center gap-2 mb-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div
                        className="w-2 h-2 rounded-full bg-neon-green"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-xs font-body text-neon-green tracking-wider uppercase font-medium">System Active</span>
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                      Welcome back, <span className="gradient-text">{displayName}</span>
                    </h1>
                    <p className="text-sm text-muted-foreground font-body max-w-md">
                      Your security command center. Run scans, track vulnerabilities, and let AI patch your code.
                    </p>
                  </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, i) => (
                    <StatCard key={stat.label} stat={stat} index={i} />
                  ))}
                </div>

                {/* Scan Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <ScanForm onStartScan={handleStartScan} isScanning={isScanning} />
                </motion.div>

                {/* Scan History */}
                {scanHistory.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
                        <History className="w-4 h-4 text-primary" />
                      </div>
                      Recent Scans
                    </h2>
                    <div className="space-y-2.5">
                      {scanHistory.slice(0, 5).map((scan, i) => (
                        <motion.button
                          key={scan.id}
                          onClick={() => { setScanResult(scan); setView("results"); }}
                          className="w-full flex items-center justify-between p-4 rounded-2xl text-left group transition-all duration-300"
                          style={{
                            background: "hsl(var(--card) / 0.4)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid hsl(var(--border) / 0.25)",
                          }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * i }}
                          whileHover={{
                            x: 4,
                            borderColor: "hsl(var(--neon-purple) / 0.3)",
                            boxShadow: "0 4px 20px hsl(270 95% 60% / 0.08)",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scan.mode === "code" ? "bg-primary/10" : "bg-accent/10"}`}>
                              <span className="text-lg">{scan.mode === "code" ? "📝" : "🌐"}</span>
                            </div>
                            <div>
                              <p className="text-sm font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                                {scan.mode === "code" ? `Code Scan (${scan.language})` : "URL Scan"}
                              </p>
                              <p className="text-xs text-muted-foreground font-body">{scan.timestamp.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {scan.summary.critical > 0 && (
                              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                {scan.summary.critical} CRIT
                              </span>
                            )}
                            {scan.summary.high > 0 && (
                              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                {scan.summary.high} HIGH
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground font-body">{scan.vulnerabilities.length} total</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {view === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <ScanProgress mode={scanMode} />
              </motion.div>
            )}

            {view === "results" && scanResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ScanResults result={scanResult} onAskAI={() => {}} onNewScan={handleNewScan} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
