import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, RefreshCw, Zap, Brain, Lightbulb, Newspaper, Rocket } from "lucide-react";
import ReactMarkdown from "react-markdown";

const PersonalizedFeed = () => {
  const { user, loading } = useAuth();
  const [interests, setInterests] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("intermediate");
  const [feedContent, setFeedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInterests, setHasInterests] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase.from("user_interests").select("interests, experience_level").eq("user_id", user.id).maybeSingle();
      if (data && (data.interests as string[])?.length > 0) {
        setInterests(data.interests as string[]);
        setExperienceLevel(data.experience_level || "intermediate");
        setHasInterests(true);
      } else {
        setHasInterests(false);
      }
    };
    load();
  }, [user]);

  useEffect(() => {
    if (hasInterests === true && interests.length > 0 && !feedContent) {
      generateFeed();
    }
  }, [hasInterests, interests]);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const generateFeed = async () => {
    setIsLoading(true);
    setFeedContent("");

    const messages = [{
      role: "user" as const,
      content: `My interests: ${interests.join(", ")}. My experience level: ${experienceLevel}. 
      
Please provide me a personalized security briefing with:

1. **🔥 Trending Now** - 3-4 latest developments/news in my interest areas (be specific and current for March 2026)
2. **💡 Crazy Ideas** - 3 wild but feasible project ideas I could build based on my interests (make them exciting and unique)
3. **🎯 Skill Challenge** - A practical challenge I can try today matched to my level
4. **📚 Deep Dive Recommendation** - One topic I should explore next with a learning path
5. **⚡ Quick Tips** - 3 pro tips related to my interests

Make it energetic, specific, and actionable. Use emojis. Be the coolest security mentor ever.`
    }];

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/personalized-feed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages }),
      });

      if (!resp.ok || !resp.body) throw new Error("Failed to get feed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let content = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) { content += delta; setFeedContent(content); }
          } catch {}
        }
      }
    } catch (e) {
      setFeedContent("Failed to load your personalized feed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div className="absolute -top-[15%] -right-[10%] w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, hsl(270 95% 60% / 0.12), transparent 65%)" }} animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 15, repeat: Infinity }} />
        <motion.div className="absolute -bottom-[10%] -left-[10%] w-[450px] h-[450px] rounded-full" style={{ background: "radial-gradient(circle, hsl(330 90% 60% / 0.1), transparent 65%)" }} animate={{ scale: [1.1, 1, 1.1] }} transition={{ duration: 18, repeat: Infinity }} />
      </div>

      <div className="relative z-10">
        <nav className="sticky top-0 z-30" style={{ background: "hsl(var(--background) / 0.7)", backdropFilter: "blur(20px)" }}>
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--neon-purple) / 0.2), transparent)" }} />
          <div className="container mx-auto max-w-4xl flex items-center justify-between h-16 px-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            {hasInterests && (
              <motion.button
                onClick={generateFeed}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-display font-semibold text-primary-foreground"
                style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                Refresh Feed
              </motion.button>
            )}
          </div>
        </nav>

        <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}>
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">Your AI Feed</h1>
                <p className="text-xs text-muted-foreground font-body">Personalized by Sentry AI based on your interests</p>
              </div>
            </div>
          </motion.div>

          {hasInterests === false && (
            <motion.div
              className="rounded-2xl p-8 text-center"
              style={{ background: "hsl(var(--card) / 0.5)", backdropFilter: "blur(20px)", border: "1px solid hsl(var(--border) / 0.3)" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
              <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-display font-bold text-lg mb-2">Set Up Your Interests First</h2>
              <p className="text-sm text-muted-foreground font-body mb-5">Head to your profile and select your interests so Sentry AI can personalize your feed.</p>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-display font-semibold text-primary-foreground"
                style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple)), hsl(var(--neon-pink)))" }}
              >
                <Sparkles className="w-4 h-4" /> Set Up Profile
              </Link>
            </motion.div>
          )}

          {hasInterests && (
            <motion.div
              className="rounded-2xl p-6 md:p-8"
              style={{ background: "hsl(var(--card) / 0.5)", backdropFilter: "blur(20px)", border: "1px solid hsl(var(--border) / 0.3)" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            >
              {isLoading && !feedContent && (
                <div className="flex flex-col items-center py-12">
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "linear-gradient(135deg, hsl(var(--neon-purple) / 0.2), hsl(var(--neon-pink) / 0.2))" }}
                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Rocket className="w-8 h-8 text-primary" />
                  </motion.div>
                  <p className="text-sm text-muted-foreground font-body">Sentry AI is curating your feed...</p>
                </div>
              )}

              {feedContent && (
                <div className="prose prose-sm prose-invert max-w-none font-body
                  prose-headings:font-display prose-headings:text-foreground
                  prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-strong:text-foreground
                  prose-li:text-muted-foreground
                  prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                ">
                  <ReactMarkdown>{feedContent}</ReactMarkdown>
                </div>
              )}
            </motion.div>
          )}

          {/* Interest tags */}
          {hasInterests && interests.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            >
              {interests.map((i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-body font-medium bg-primary/10 text-primary border border-primary/20">
                  {i.replace(/-/g, " ")}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedFeed;
