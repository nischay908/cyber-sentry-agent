import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold gradient-text">Dashboard</h1>
          <button onClick={signOut} className="px-4 py-2 rounded-xl text-sm font-medium glass-card hover:bg-muted/50 transition-all">
            Sign Out
          </button>
        </div>
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-muted-foreground font-body">Welcome, <span className="text-foreground font-medium">{user.email}</span></p>
          <p className="text-sm text-muted-foreground mt-2">Your Red Team Cyber-Sentry dashboard is ready.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
