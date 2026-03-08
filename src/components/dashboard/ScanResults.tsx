import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Copy, ExternalLink, Download, FileCode, ChevronDown, ChevronUp, AlertTriangle, AlertCircle, Info, CheckCircle, XCircle, Bot } from "lucide-react";
import type { ScanResult, Vulnerability } from "@/lib/scanEngine";
import { useToast } from "@/hooks/use-toast";

const severityConfig = {
  critical: { color: "from-red-500 to-red-600", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", icon: XCircle },
  high: { color: "from-orange-500 to-red-500", bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", icon: AlertTriangle },
  medium: { color: "from-yellow-500 to-orange-500", bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30", icon: AlertCircle },
  low: { color: "from-blue-400 to-blue-500", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", icon: Info },
  info: { color: "from-gray-400 to-gray-500", bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/30", icon: CheckCircle },
};

interface ScanResultsProps {
  result: ScanResult;
  onAskAI: (vulnerability: Vulnerability) => void;
  onNewScan: () => void;
}

const ScanResults = ({ result, onAskAI, onNewScan }: ScanResultsProps) => {
  const [expandedVuln, setExpandedVuln] = useState<string | null>(null);
  const { toast } = useToast();

  const totalVulns = result.vulnerabilities.length;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const exportReport = () => {
    const report = `# Security Scan Report
## Red Team Cyber-Sentry
Generated: ${result.timestamp.toLocaleString()}
Scan Duration: ${result.scanDuration.toFixed(1)}s
Mode: ${result.mode === "code" ? `Code Analysis (${result.language})` : `URL Scan`}
Target: ${result.mode === "url" ? result.target : "Code snippet"}

## Summary
- Critical: ${result.summary.critical}
- High: ${result.summary.high}
- Medium: ${result.summary.medium}
- Low: ${result.summary.low}
- Info: ${result.summary.info}

## Vulnerabilities Found

${result.vulnerabilities.map((v, i) => `### ${i + 1}. ${v.title}
- **Severity**: ${v.severity.toUpperCase()}
- **Type**: ${v.type}
- **Description**: ${v.description}
- **Location**: ${v.location}
${v.cweId ? `- **CWE**: ${v.cweId}` : ""}
${v.fix ? `\n**Recommended Fix:**\n\`\`\`\n${v.fix}\n\`\`\`` : ""}
`).join("\n")}`;

    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security-report-${result.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Report Downloaded", description: "Markdown report saved successfully." });
  };

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <motion.div
        className="glass-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Scan Complete
            </h2>
            <p className="text-sm text-muted-foreground font-body mt-1">
              Found {totalVulns} {totalVulns === 1 ? "vulnerability" : "vulnerabilities"} in {result.scanDuration.toFixed(1)}s
              {result.language && <span> • {result.language}</span>}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={exportReport} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium glass-card hover:bg-muted/50 transition-all">
              <Download className="w-3.5 h-3.5" /> Export Report
            </button>
            <button onClick={onNewScan} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-primary-foreground glow-purple" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}>
              New Scan
            </button>
          </div>
        </div>

        {/* Severity Badges */}
        <div className="flex flex-wrap gap-3">
          {(["critical", "high", "medium", "low", "info"] as const).map((sev) => {
            const count = result.summary[sev];
            const config = severityConfig[sev];
            return (
              <div key={sev} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg} ${config.border} border`}>
                <config.icon className={`w-3.5 h-3.5 ${config.text}`} />
                <span className={`text-xs font-medium ${config.text}`}>{count} {sev}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Vulnerability Cards */}
      <div className="space-y-3">
        {result.vulnerabilities.map((vuln, i) => {
          const config = severityConfig[vuln.severity];
          const isExpanded = expandedVuln === vuln.id;

          return (
            <motion.div
              key={vuln.id}
              className={`glass-card rounded-2xl overflow-hidden border ${config.border}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedVuln(isExpanded ? null : vuln.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-muted/20 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${config.color}`}>
                  <config.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-sm font-semibold text-foreground">{vuln.title}</h3>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{vuln.type} • {vuln.location}</p>
                </div>
                <div className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${config.bg} ${config.text}`}>
                  {vuln.severity}
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-4 border-t border-border/30 pt-4">
                      <p className="text-sm text-muted-foreground font-body leading-relaxed">{vuln.description}</p>

                      {vuln.codeSnippet && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2 font-medium">Vulnerable Code:</p>
                          <div className="relative bg-muted/50 rounded-xl p-4 border border-border/30">
                            <pre className="text-xs font-mono text-destructive overflow-x-auto">{vuln.codeSnippet}</pre>
                            <button
                              onClick={() => copyToClipboard(vuln.codeSnippet!, "Code snippet")}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-muted/80 hover:bg-muted transition-colors"
                            >
                              <Copy className="w-3 h-3 text-muted-foreground" />
                            </button>
                          </div>
                        </div>
                      )}

                      {vuln.fix && (
                        <div>
                          <p className="text-xs text-neon-green mb-2 font-medium">✅ Recommended Fix:</p>
                          <div className="relative bg-neon-green/5 rounded-xl p-4 border border-neon-green/20">
                            <pre className="text-xs font-mono text-neon-green/90 overflow-x-auto whitespace-pre-wrap">{vuln.fix}</pre>
                            <button
                              onClick={() => copyToClipboard(vuln.fix!, "Fix code")}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-muted/80 hover:bg-muted transition-colors"
                            >
                              <Copy className="w-3 h-3 text-muted-foreground" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(vuln, null, 2), "Vulnerability details")}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium glass-card hover:bg-muted/50 transition-all"
                        >
                          <Copy className="w-3 h-3" /> Copy Details
                        </button>
                        {vuln.fix && (
                          <button
                            onClick={() => copyToClipboard(vuln.fix!, "Fix code")}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium glass-card hover:bg-muted/50 transition-all"
                          >
                            <FileCode className="w-3 h-3" /> Copy Fix
                          </button>
                        )}
                        {vuln.cweId && (
                          <a
                            href={`https://cwe.mitre.org/data/definitions/${vuln.cweId.replace("CWE-", "")}.html`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium glass-card hover:bg-muted/50 transition-all"
                          >
                            <ExternalLink className="w-3 h-3" /> View CWE
                          </a>
                        )}
                        <button
                          onClick={() => onAskAI(vuln)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-primary-foreground glow-purple"
                          style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                        >
                          <Bot className="w-3 h-3" /> Ask Sentry AI
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ScanResults;
