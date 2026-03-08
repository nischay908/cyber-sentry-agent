import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, LogOut, Home, History } from "lucide-react";
import ScanForm, { type ScanMode } from "@/components/dashboard/ScanForm";
import ScanResults from "@/components/dashboard/ScanResults";
import ScanProgress from "@/components/dashboard/ScanProgress";
import { generateScanResults, type ScanResult, type Vulnerability } from "@/lib/scanEngine";

type DashboardView = "home" | "scanning" | "results";

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const [view, setView] = useState<DashboardView>("home");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode>("code");
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
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
      setView("results");
    } catch {
      setView("home");
    } finally {
      setIsScanning(false);
    }
  };

  const handleNewScan = () => {
    setScanResult(null);
    setView("home");
  };

  const totalScans = scanHistory.length;
  const totalVulns = scanHistory.reduce((acc, s) => acc + s.vulnerabilities.length, 0);
  const criticalVulns = scanHistory.reduce((acc, s) => acc + s.summary.critical + s.summary.high, 0);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(var(--neon-purple) / 0.3), transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, hsl(var(--neon-blue) / 0.3), transparent 70%)" }} />

      <div className="relative z-10">
        {/* Top Nav */}
        <nav className="border-b border-border/30 bg-background/60 backdrop-blur-2xl sticky top-0 z-30">
          <div className="container mx-auto max-w-6xl flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                  <Shield className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-sm gradient-text hidden sm:inline">Red Team</span>
              </Link>
              <div className="h-5 w-px bg-border/50 mx-1" />
              <span className="text-xs text-muted-foreground font-body">Dashboard</span>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/" className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Home className="w-4 h-4 text-muted-foreground" />
              </Link>
              <button onClick={signOut} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto max-w-6xl px-4 py-6">
          {view === "home" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Welcome */}
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">Welcome back</h1>
                <p className="text-muted-foreground text-sm font-body mt-1">{user.email}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Scans Run", value: totalScans, color: "from-primary to-neon-pink" },
                  { label: "Vulnerabilities", value: totalVulns, color: "from-secondary to-neon-pink" },
                  { label: "Critical/High", value: criticalVulns, color: "from-destructive to-orange-500" },
                ].map((stat) => (
                  <div key={stat.label} className="glass-card rounded-2xl p-5">
                    <p className="text-xs text-muted-foreground font-body mb-1">{stat.label}</p>
                    <p className={`text-3xl font-display font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Scan Form */}
              <ScanForm onStartScan={handleStartScan} isScanning={isScanning} />

              {/* Scan History */}
              {scanHistory.length > 0 && (
                <div>
                  <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
                    <History className="w-4 h-4 text-muted-foreground" />
                    Recent Scans
                  </h2>
                  <div className="space-y-2">
                    {scanHistory.slice(0, 5).map((scan) => (
                      <button
                        key={scan.id}
                        onClick={() => { setScanResult(scan); setView("results"); }}
                        className="w-full flex items-center justify-between p-4 glass-card rounded-xl hover:bg-muted/30 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${scan.mode === "code" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                            {scan.mode === "code" ? "📝" : "🌐"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground font-body">
                              {scan.mode === "code" ? `Code Scan (${scan.language})` : "URL Scan"}
                            </p>
                            <p className="text-xs text-muted-foreground">{scan.timestamp.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {scan.summary.critical > 0 && <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-red-500/10 text-red-400">{scan.summary.critical}C</span>}
                          {scan.summary.high > 0 && <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-orange-500/10 text-orange-400">{scan.summary.high}H</span>}
                          <span className="text-xs text-muted-foreground">{scan.vulnerabilities.length} total</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === "scanning" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ScanProgress mode={scanMode} />
            </motion.div>
          )}

          {view === "results" && scanResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ScanResults result={scanResult} onAskAI={() => {}} onNewScan={handleNewScan} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;