import { useState, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import AnimatedBackground from "@/components/AnimatedBackground";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

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

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
              <Shield className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-display text-sm font-medium">
              <span className="gradient-text">Red Team</span> <span className="text-muted-foreground">Cyber-Sentry</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-body">
            © 2026 Red Team Cyber-Sentry. Hackathon Project.
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Index;
