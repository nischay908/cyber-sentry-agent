import { useState, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
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
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-display text-xs tracking-widest text-muted-foreground">
              <span className="text-primary">RED TEAM</span> CYBER-SENTRY
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            © 2026 Red Team Cyber-Sentry. Hackathon Project.
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Index;
