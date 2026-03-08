import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();

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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(var(--neon-purple) / 0.3), transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, hsl(var(--neon-blue) / 0.3), transparent 70%)" }} />

      <div className="relative z-10 p-6 md:p-8">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text">Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-1 font-body">Welcome back, {user.email}</p>
            </div>
            <button
              onClick={signOut}
              className="px-5 py-2.5 rounded-xl text-sm font-medium glass-card hover:bg-muted/50 transition-all font-body"
            >
              Sign Out
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Scans Completed", value: "0", color: "from-primary to-neon-pink" },
              { label: "Vulnerabilities Found", value: "0", color: "from-secondary to-neon-pink" },
              { label: "Patches Applied", value: "0", color: "from-accent to-neon-blue" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-6">
                <p className="text-xs text-muted-foreground font-body mb-2">{stat.label}</p>
                <p className={`text-4xl font-display font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Main Card */}
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple) / 0.2), hsl(var(--neon-pink) / 0.2))" }}>
              <span className="text-2xl">🛡️</span>
            </div>
            <h2 className="font-display text-xl font-bold mb-2 text-foreground">Ready to Scan</h2>
            <p className="text-sm text-muted-foreground font-body max-w-md mx-auto">
              Your Red Team Cyber-Sentry agent is initialized and ready. Start a vulnerability scan to begin autonomous threat detection.
            </p>
            <button
              className="mt-6 px-6 py-3 rounded-xl text-primary-foreground font-display text-sm font-medium glow-purple hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
            >
              Start New Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
