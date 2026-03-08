import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Globe, ChevronDown } from "lucide-react";

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
  "PHP", "Ruby", "Swift", "Kotlin", "SQL", "Shell/Bash", "HTML/CSS",
];

export type ScanMode = "code" | "url";

interface ScanFormProps {
  onStartScan: (data: { mode: ScanMode; content: string; language: string }) => void;
  isScanning: boolean;
}

const ScanForm = ({ onStartScan, isScanning }: ScanFormProps) => {
  const [mode, setMode] = useState<ScanMode>("code");
  const [code, setCode] = useState("");
  const [url, setUrl] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const handleSubmit = () => {
    const content = mode === "code" ? code : url;
    if (!content.trim()) return;
    onStartScan({ mode, content, language });
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Mode Toggle */}
      <div className="flex border-b border-border/30">
        <button
          onClick={() => setMode("code")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-display font-medium transition-all ${
            mode === "code"
              ? "text-primary-foreground bg-gradient-to-r from-primary to-neon-pink"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code className="w-4 h-4" />
          Paste Code
        </button>
        <button
          onClick={() => setMode("url")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-display font-medium transition-all ${
            mode === "url"
              ? "text-primary-foreground bg-gradient-to-r from-accent to-neon-blue"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Globe className="w-4 h-4" />
          Website URL
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Language Selector (for code mode) */}
        {mode === "code" && (
          <div className="relative">
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium font-body">Programming Language</label>
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm font-body text-foreground hover:border-primary/30 transition-all"
            >
              {language}
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showLangDropdown ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showLangDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute z-20 mt-1 w-full bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setShowLangDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-body hover:bg-muted/50 transition-colors ${
                        language === lang ? "text-primary bg-primary/5" : "text-foreground"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Input Area */}
        {mode === "code" ? (
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium font-body">Paste your code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Paste your ${language} code here for vulnerability scanning...\n\nconst query = "SELECT * FROM users WHERE id = " + userId;`}
              className="w-full h-48 px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium font-body">Website URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all"
            />
            <p className="text-xs text-muted-foreground mt-2 font-body">
              We'll scan the website for common vulnerabilities like XSS, CSRF, SQL injection, and more.
            </p>
          </div>
        )}

        {/* Scan Button */}
        <motion.button
          onClick={handleSubmit}
          disabled={isScanning || (mode === "code" ? !code.trim() : !url.trim())}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-primary-foreground font-display text-sm font-medium tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: mode === "code"
              ? "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))"
              : "linear-gradient(135deg, hsl(var(--neon-blue)), hsl(var(--accent)))",
          }}
          whileTap={{ scale: 0.98 }}
        >
          {isScanning ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              Scanning...
            </>
          ) : (
            <>🔍 Start Security Scan</>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default ScanForm;
