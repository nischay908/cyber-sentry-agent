import { useState, useCallback, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import AnimatedBackground from "@/components/AnimatedBackground";
import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash on very first visit of the session
    if (sessionStorage.getItem("splashShown")) return false;
    sessionStorage.setItem("splashShown", "true");
    return true;
  });

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    sessionStorage.setItem("splashShown", "true");
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <AnimatedBackground />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center glass-card rounded-3xl p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at center, hsl(var(--neon-purple) / 0.2), transparent 70%)" }} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                <span className="gradient-text">Ready to Secure Your Code?</span>
              </h2>
              <p className="text-muted-foreground font-body mb-8 max-w-lg mx-auto">
                Start scanning for vulnerabilities in seconds. Our AI-powered agent finds threats before attackers do.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-primary-foreground font-display text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 glow-purple"
                style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-bold">
                <span className="gradient-text">Red Team</span> <span className="text-muted-foreground">Cyber-Sentry</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm font-body text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
              <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              © 2026 Red Team Cyber-Sentry. Hackathon Project.
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default Index;
