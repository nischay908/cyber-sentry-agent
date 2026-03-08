import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Sparkles, User } from "lucide-react";
import type { Vulnerability } from "@/lib/scanEngine";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vulnerability-chat`;

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialVulnerability?: Vulnerability | null;
}

const AIChatPanel = ({ isOpen, onClose, initialVulnerability }: AIChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Auto-ask about vulnerability when opened with one
  useEffect(() => {
    if (isOpen && initialVulnerability && !hasInitialized) {
      setHasInitialized(true);
      const question = `Explain this vulnerability in simple terms and tell me exactly how to fix it:\n\n**${initialVulnerability.title}** (${initialVulnerability.severity.toUpperCase()})\nType: ${initialVulnerability.type}\nDescription: ${initialVulnerability.description}${initialVulnerability.codeSnippet ? `\n\nVulnerable code:\n\`\`\`\n${initialVulnerability.codeSnippet}\n\`\`\`` : ""}`;
      sendMessage(question);
    }
  }, [isOpen, initialVulnerability, hasInitialized]);

  // Reset when panel closes
  useEffect(() => {
    if (!isOpen) {
      setHasInitialized(false);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

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
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
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
      upsertAssistant(`⚠️ ${e.message || "Something went wrong. Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
  };

  const quickQuestions = [
    "What are the top 5 most common web vulnerabilities?",
    "How do I prevent SQL injection attacks?",
    "Explain XSS in simple terms",
    "What security headers should every website have?",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 bottom-0 w-full md:w-[440px] z-50 flex flex-col bg-background border-l border-border/30 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}>
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold">Sentry AI</h3>
                <p className="text-xs text-muted-foreground">Cybersecurity Assistant</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple) / 0.2), hsl(var(--neon-pink) / 0.2))" }}>
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">Ask Sentry AI</h3>
                <p className="text-sm text-muted-foreground font-body mb-6">
                  Ask about vulnerabilities, security best practices, or get help fixing issues.
                </p>
                <div className="space-y-2">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="w-full text-left px-4 py-3 rounded-xl text-xs font-body glass-card hover:bg-muted/50 transition-all text-muted-foreground hover:text-foreground"
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${
                  msg.role === "user" ? "bg-muted" : ""
                }`} style={msg.role === "assistant" ? { background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" } : undefined}>
                  {msg.role === "user" ? <User className="w-4 h-4 text-muted-foreground" /> : <Bot className="w-4 h-4 text-primary-foreground" />}
                </div>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-body ${
                  msg.role === "user"
                    ? "bg-primary/10 text-foreground"
                    : "glass-card text-foreground"
                }`}>
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

            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}>
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="glass-card rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border/30">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about vulnerabilities..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 rounded-xl text-primary-foreground disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatPanel;
