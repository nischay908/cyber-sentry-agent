import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Copy, ExternalLink, Download, FileCode, ChevronDown, ChevronUp,
  AlertTriangle, AlertCircle, Info, CheckCircle, XCircle, Bot, Send,
  Code, FileCheck, Bug, Sparkles, User, ArrowLeft, X, FileText, Clipboard, Monitor,
} from "lucide-react";
import type { ScanResult, Vulnerability } from "@/lib/scanEngine";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

const severityConfig = {
  critical: { color: "from-red-500 to-red-600", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", icon: XCircle },
  high: { color: "from-orange-500 to-red-500", bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", icon: AlertTriangle },
  medium: { color: "from-yellow-500 to-orange-500", bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30", icon: AlertCircle },
  low: { color: "from-blue-400 to-blue-500", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", icon: Info },
  info: { color: "from-gray-400 to-gray-500", bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/30", icon: CheckCircle },
};

type ResultTab = "vulnerabilities" | "original" | "corrected" | "ai-agent";

type ChatMessage = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vulnerability-chat`;

interface ScanResultsProps {
  result: ScanResult;
  onAskAI: (vulnerability: Vulnerability) => void;
  onNewScan: () => void;
}

const ScanResults = ({ result, onAskAI, onNewScan }: ScanResultsProps) => {
  const [expandedVuln, setExpandedVuln] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ResultTab>("vulnerabilities");
  const { toast } = useToast();

  // AI Chat state (inline)
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (activeTab === "ai-agent" && chatInputRef.current) {
      setTimeout(() => chatInputRef.current?.focus(), 200);
    }
  }, [activeTab]);

  const totalVulns = result.vulnerabilities.length;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const exportReport = () => {
    const report = `# Security Scan Report\n## Red Team Cyber-Sentry\nGenerated: ${result.timestamp.toLocaleString()}\nScan Duration: ${result.scanDuration.toFixed(1)}s\nMode: ${result.mode === "code" ? `Code Analysis (${result.language})` : `URL Scan`}\n\n## Summary\n- Critical: ${result.summary.critical}\n- High: ${result.summary.high}\n- Medium: ${result.summary.medium}\n- Low: ${result.summary.low}\n- Info: ${result.summary.info}\n\n## Vulnerabilities\n${result.vulnerabilities.map((v, i) => `### ${i + 1}. ${v.title}\n- Severity: ${v.severity.toUpperCase()}\n- Type: ${v.type}\n- Description: ${v.description}\n${v.fix ? `\n**Fix:**\n\`\`\`\n${v.fix}\n\`\`\`` : ""}\n`).join("\n")}`;
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security-report-${result.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Report Downloaded", description: "Markdown report saved." });
  };

  // Build corrected code from fixes
  const getCorrectedCode = () => {
    if (result.mode === "url") return "// URL scans don't produce corrected code.";
    let corrected = result.target || "";
    result.vulnerabilities.forEach((v) => {
      if (v.codeSnippet && v.fix) {
        corrected = corrected.replace(v.codeSnippet, v.fix);
      }
    });
    if (corrected === result.target) {
      // If no direct replacement was possible, show all fixes concatenated
      return result.vulnerabilities
        .filter((v) => v.fix)
        .map((v) => `// Fix for: ${v.title}\n${v.fix}`)
        .join("\n\n") || "// No automatic fixes available.";
    }
    return corrected;
  };

  // AI Chat logic
  const sendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChatInput("");
    setIsChatLoading(true);

    // Build context about this scan
    const scanContext = result.vulnerabilities
      .map((v) => `- ${v.title} (${v.severity}): ${v.description}`)
      .join("\n");

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const contextMessages: ChatMessage[] = [
        {
          role: "user",
          content: `Context: I just scanned ${result.mode === "code" ? `${result.language} code` : "a website URL"} and found these vulnerabilities:\n${scanContext}\n\nNow answer my question:`,
        },
        ...newMessages,
      ];

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: contextMessages }),
      });

      if (!resp.ok || !resp.body) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to connect to AI");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      upsertAssistant(`⚠️ ${e.message || "Something went wrong."}`);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    sendChatMessage(chatInput.trim());
  };

  const quickQuestions = [
    "Explain all the vulnerabilities found in simple terms",
    "What's the most critical issue and how do I fix it?",
    "Give me a step-by-step remediation plan",
    "Are there any security best practices I'm missing?",
  ];

  const tabs: { id: ResultTab; label: string; icon: React.ElementType; gradient: string }[] = [
    { id: "vulnerabilities", label: "Vulnerabilities", icon: Bug, gradient: "from-red-500 to-orange-500" },
    { id: "original", label: "Original Code", icon: Code, gradient: "from-primary to-neon-pink" },
    { id: "corrected", label: "Corrected Code", icon: FileCheck, gradient: "from-neon-green to-emerald-500" },
    { id: "ai-agent", label: "Sentry AI", icon: Bot, gradient: "from-primary to-neon-pink" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <motion.div className="glass-card rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
            <button onClick={() => setShowExportPopup(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-primary-foreground glow-purple" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}>
              <Download className="w-3.5 h-3.5" /> Export & Share
            </button>
            <button onClick={onNewScan} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium glass-card hover:bg-muted/50 transition-all">
              <ArrowLeft className="w-3.5 h-3.5" /> New Scan
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

      {/* Tab Navigation */}
      <motion.div className="glass-card rounded-2xl overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex border-b border-border/30 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3.5 text-xs sm:text-sm font-display font-medium transition-all relative ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tab.gradient}`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Vulnerabilities Tab */}
            {activeTab === "vulnerabilities" && (
              <motion.div key="vuln" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                {result.vulnerabilities.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-neon-green mx-auto mb-3" />
                    <h3 className="font-display text-lg font-bold">No Vulnerabilities Found</h3>
                    <p className="text-sm text-muted-foreground mt-1">Your code looks secure! 🎉</p>
                  </div>
                ) : (
                  result.vulnerabilities.map((vuln, i) => {
                    const config = severityConfig[vuln.severity];
                    const isExpanded = expandedVuln === vuln.id;
                    return (
                      <motion.div
                        key={vuln.id}
                        className={`glass-card rounded-xl overflow-hidden border ${config.border}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <button
                          onClick={() => setExpandedVuln(isExpanded ? null : vuln.id)}
                          className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/20 transition-colors"
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${config.color}`}>
                            <config.icon className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display text-sm font-semibold text-foreground">{vuln.title}</h3>
                            <p className="text-xs text-muted-foreground font-body">{vuln.type} • {vuln.location}</p>
                          </div>
                          <div className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase ${config.bg} ${config.text}`}>
                            {vuln.severity}
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="px-4 pb-4 space-y-3 border-t border-border/30 pt-3">
                                <p className="text-sm text-muted-foreground font-body leading-relaxed">{vuln.description}</p>
                                {vuln.codeSnippet && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1.5 font-medium">Vulnerable Code:</p>
                                    <div className="relative bg-muted/50 rounded-xl p-3 border border-border/30">
                                      <pre className="text-xs font-mono text-destructive overflow-x-auto">{vuln.codeSnippet}</pre>
                                      <button onClick={() => copyToClipboard(vuln.codeSnippet!, "Code")} className="absolute top-2 right-2 p-1 rounded-lg bg-muted/80 hover:bg-muted transition-colors">
                                        <Copy className="w-3 h-3 text-muted-foreground" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                                {vuln.fix && (
                                  <div>
                                    <p className="text-xs text-neon-green mb-1.5 font-medium">✅ Recommended Fix:</p>
                                    <div className="relative bg-neon-green/5 rounded-xl p-3 border border-neon-green/20">
                                      <pre className="text-xs font-mono text-neon-green/90 overflow-x-auto whitespace-pre-wrap">{vuln.fix}</pre>
                                      <button onClick={() => copyToClipboard(vuln.fix!, "Fix")} className="absolute top-2 right-2 p-1 rounded-lg bg-muted/80 hover:bg-muted transition-colors">
                                        <Copy className="w-3 h-3 text-muted-foreground" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-2 pt-1">
                                  <button onClick={() => copyToClipboard(JSON.stringify(vuln, null, 2), "Details")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass-card hover:bg-muted/50 transition-all">
                                    <Copy className="w-3 h-3" /> Copy Details
                                  </button>
                                  {vuln.cweId && (
                                    <a href={`https://cwe.mitre.org/data/definitions/${vuln.cweId.replace("CWE-", "")}.html`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass-card hover:bg-muted/50 transition-all">
                                      <ExternalLink className="w-3 h-3" /> View CWE
                                    </a>
                                  )}
                                  <button
                                    onClick={() => {
                                      setActiveTab("ai-agent");
                                      sendChatMessage(`Explain this vulnerability in detail and how to fix it:\n\n**${vuln.title}** (${vuln.severity.toUpperCase()})\n${vuln.description}${vuln.codeSnippet ? `\n\nCode:\n\`\`\`\n${vuln.codeSnippet}\n\`\`\`` : ""}`);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary-foreground glow-purple"
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
                  })
                )}
              </motion.div>
            )}

            {/* Original Code Tab */}
            {activeTab === "original" && (
              <motion.div key="original" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground font-body font-medium">
                    {result.mode === "code" ? `Original ${result.language} Code` : "Scanned URL"}
                  </p>
                  <button
                    onClick={() => copyToClipboard(result.target || "", "Original code")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass-card hover:bg-muted/50 transition-all"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <div className="relative bg-muted/30 rounded-xl p-4 border border-border/30 max-h-[500px] overflow-auto">
                  <pre className="text-sm font-mono text-foreground/80 whitespace-pre-wrap">{result.target || "No source available"}</pre>
                </div>
                {result.vulnerabilities.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.vulnerabilities.map((v) => {
                      const cfg = severityConfig[v.severity];
                      return (
                        <span key={v.id} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${cfg.bg} ${cfg.text} ${cfg.border} border`}>
                          <cfg.icon className="w-3 h-3" />
                          {v.title} — Line {v.location}
                        </span>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Corrected Code Tab */}
            {activeTab === "corrected" && (
              <motion.div key="corrected" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-body font-medium" style={{ color: "hsl(var(--neon-green))" }}>
                    ✅ Corrected {result.language || ""} Code
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(getCorrectedCode(), "Corrected code")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass-card hover:bg-muted/50 transition-all"
                    >
                      <Copy className="w-3 h-3" /> Copy Code
                    </button>
                    <button
                      onClick={() => {
                        const code = getCorrectedCode();
                        const blob = new Blob([code], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `corrected-code.${result.language?.toLowerCase() === "python" ? "py" : result.language?.toLowerCase() === "javascript" ? "js" : result.language?.toLowerCase() === "typescript" ? "ts" : "txt"}`;
                        a.click();
                        URL.revokeObjectURL(url);
                        toast({ title: "Downloaded!", description: "Corrected code file saved." });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium glass-card hover:bg-muted/50 transition-all"
                    >
                      <Download className="w-3 h-3" /> Download
                    </button>
                  </div>
                </div>
                <div className="relative bg-neon-green/5 rounded-xl p-4 border border-neon-green/20 max-h-[500px] overflow-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap" style={{ color: "hsl(var(--neon-green) / 0.9)" }}>{getCorrectedCode()}</pre>
                </div>
                <p className="text-xs text-muted-foreground mt-3 font-body">
                  💡 This code has all detected vulnerabilities patched with the recommended fixes.
                </p>
              </motion.div>
            )}

            {/* AI Agent Tab */}
            {activeTab === "ai-agent" && (
              <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col" style={{ minHeight: "400px" }}>
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
                  {messages.length === 0 && (
                    <div className="text-center py-6">
                      <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple) / 0.2), hsl(var(--neon-pink) / 0.2))" }}>
                        <Sparkles className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="font-display text-base font-bold mb-1">Ask Sentry AI</h3>
                      <p className="text-xs text-muted-foreground font-body mb-4">
                        Ask about the vulnerabilities found in your scan. I'll explain in simple terms and help you fix them.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {quickQuestions.map((q) => (
                          <button
                            key={q}
                            onClick={() => sendChatMessage(q)}
                            className="text-left px-3 py-2.5 rounded-xl text-xs font-body glass-card hover:bg-muted/50 transition-all text-muted-foreground hover:text-foreground"
                          >
                            💬 {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-muted" : ""}`}
                        style={msg.role === "assistant" ? { background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" } : undefined}
                      >
                        {msg.role === "user" ? <User className="w-3.5 h-3.5 text-muted-foreground" /> : <Bot className="w-3.5 h-3.5 text-primary-foreground" />}
                      </div>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-body ${msg.role === "user" ? "bg-primary/10 text-foreground" : "glass-card text-foreground"}`}>
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm prose-invert max-w-none [&_pre]:bg-muted/50 [&_pre]:rounded-lg [&_pre]:p-3 [&_code]:text-accent [&_strong]:text-foreground [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_a]:text-accent">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {isChatLoading && messages[messages.length - 1]?.role !== "assistant" && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}>
                        <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                      <div className="glass-card rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleChatSubmit} className="flex gap-2 pt-3 border-t border-border/30">
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about your scan results..."
                    disabled={isChatLoading}
                    className="flex-1 px-4 py-2.5 bg-muted/50 border border-border/50 rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="p-2.5 rounded-xl text-primary-foreground disabled:opacity-50 transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ScanResults;