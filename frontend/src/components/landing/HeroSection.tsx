import { useEffect, useState, useCallback } from "react";
import { Play, Star, Sparkles, Video, Image, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const router = useRouter();
  const { t } = useTranslation();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [convoIndex, setConvoIndex] = useState(0);
  const [phase, setPhase] = useState<"typing-user" | "typing-ai" | "done">("typing-user");
  const [displayedUserChars, setDisplayedUserChars] = useState(0);
  const [displayedAiLines, setDisplayedAiLines] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const conversations = [
    {
      user: t("hero.conversations.0.user", "Write a compelling product launch email"),
      aiLines: [
        t("hero.conversations.0.ai1", "Here's a high-converting launch email:"),
        "",
        `**${t("hero.conversations.0.subject", "Subject: The Future is Here 🚀")}**`,
        "",
        t("hero.conversations.0.body", "\"We're thrilled to announce our latest AI tool...\""),
      ],
      type: "text" as const,
      icon: FileText,
    },
    {
      user: t("hero.conversations.1.user", "Create a cinematic product video"),
      aiLines: [
        t("hero.conversations.1.ai1", "Generating your video now... 🎬"),
      ],
      type: "video" as const,
      icon: Video,
      preview: { label: "ProductLaunch_v1.mp4", duration: "0:32", status: "Ready" },
    },
    {
      user: t("hero.conversations.2.user", "Design a stunning Instagram carousel"),
      aiLines: [
        t("hero.conversations.2.ai1", "Creating your carousel images... 🎨"),
      ],
      type: "image" as const,
      icon: Image,
      preview: { count: 4, label: "Instagram Carousel" },
    },
  ];

  const currentConvo = conversations[convoIndex];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // User typing effect
  useEffect(() => {
    if (phase !== "typing-user") return;
    if (displayedUserChars >= currentConvo.user.length) {
      const t = setTimeout(() => setPhase("typing-ai"), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDisplayedUserChars(c => c + 1), 28);
    return () => clearTimeout(t);
  }, [phase, displayedUserChars, currentConvo.user.length]);

  // AI lines reveal
  useEffect(() => {
    if (phase !== "typing-ai") return;
    if (displayedAiLines >= currentConvo.aiLines.length) {
      const t = setTimeout(() => {
        setShowPreview(true);
        setPhase("done");
      }, 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDisplayedAiLines(l => l + 1), 350);
    return () => clearTimeout(t);
  }, [phase, displayedAiLines, currentConvo.aiLines.length]);

  // Cycle conversations
  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => {
      setConvoIndex(i => (i + 1) % conversations.length);
      setPhase("typing-user");
      setDisplayedUserChars(0);
      setDisplayedAiLines(0);
      setShowPreview(false);
    }, 3500);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, hsl(263 70% 58% / 0.06), transparent 40%)`,
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-float-slow" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-secondary/20 blur-[120px] animate-float-delay-1" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px] animate-float-delay-2" />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-40" />

      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-8"
        >
          🚀 {t("hero.badge")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold heading-tight leading-[1.05] mb-6"
        >
          {t("hero.title")}
          <br />
          <span className="gradient-text">{t("hero.titleHighlight")}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <button
            onClick={() => router.push("/chat")}
            className="gradient-bg text-primary-foreground font-semibold px-8 py-3.5 rounded-full glow hover:opacity-90 active:scale-95 transition-all text-base"
          >
            {t("hero.cta")}
          </button>
          <button className="flex items-center gap-2 text-foreground font-medium px-8 py-3.5 rounded-full border border-border hover:border-primary/40 transition-all active:scale-95">
            <Play className="h-4 w-4" />
            {t("hero.secondaryCta")}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center justify-center gap-3 text-sm text-muted-foreground"
        >
          <div className="flex -space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-background gradient-bg opacity-80"
                style={{ filter: `hue-rotate(${i * 30}deg)` }}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span>Trusted by 2,000+ marketers</span>
        </motion.div>

        {/* Chat mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 max-w-3xl mx-auto"
          style={{ perspective: "1000px" }}
        >
          <div className="glass rounded-2xl p-6 shadow-2xl shadow-primary/5 min-h-[220px]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive/70" />
              <div className="w-3 h-3 rounded-full bg-accent/70" />
              <div className="w-3 h-3 rounded-full bg-primary/70" />
              <span className="ml-3 text-xs text-muted-foreground">Smartfy AI Chat</span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-primary font-medium">Live</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={convoIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {/* User message */}
                <div className="flex justify-end">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-muted rounded-xl px-4 py-2.5 text-sm max-w-xs text-right"
                  >
                    {currentConvo.user.slice(0, displayedUserChars)}
                    {phase === "typing-user" && (
                      <span className="inline-block w-0.5 h-4 bg-foreground ml-0.5 animate-pulse align-middle" />
                    )}
                  </motion.div>
                </div>

                {/* AI response */}
                {phase !== "typing-user" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-7 h-7 rounded-full gradient-bg flex-shrink-0 flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 space-y-2">
                      {/* Typing dots */}
                      {phase === "typing-ai" && displayedAiLines === 0 && (
                        <div className="flex gap-1 items-center py-2">
                          <span className="w-2 h-2 rounded-full gradient-bg animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 rounded-full gradient-bg animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 rounded-full gradient-bg animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      )}

                      {/* AI text lines */}
                      {displayedAiLines > 0 && (
                        <div className="bg-card/50 rounded-xl px-4 py-2.5 text-sm text-left text-muted-foreground max-w-sm">
                          {currentConvo.aiLines.slice(0, displayedAiLines).map((line, i) =>
                            line === "" ? (
                              <br key={i} />
                            ) : line.startsWith("**") ? (
                              <span key={i} className="text-foreground font-medium block">
                                {line.replace(/\*\*/g, "")}
                              </span>
                            ) : (
                              <span key={i} className="block">{line}</span>
                            )
                          )}
                        </div>
                      )}

                      {/* Video preview card */}
                      {showPreview && currentConvo.type === "video" && currentConvo.preview && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="glass rounded-xl overflow-hidden max-w-sm"
                        >
                          <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                              <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
                            </div>
                            <span className="absolute bottom-2 right-2 text-xs bg-background/80 px-2 py-0.5 rounded text-foreground">{currentConvo.preview.duration}</span>
                          </div>
                          <div className="px-3 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Video className="h-3.5 w-3.5 text-primary" />
                              <span className="text-xs text-foreground">{currentConvo.preview.label}</span>
                            </div>
                            <span className="text-xs text-primary font-medium">{currentConvo.preview.status}</span>
                          </div>
                        </motion.div>
                      )}

                      {/* Image preview card */}
                      {showPreview && currentConvo.type === "image" && currentConvo.preview && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="grid grid-cols-2 gap-2 max-w-sm"
                        >
                          {Array.from({ length: currentConvo.preview.count }).map((_, i) => (
                            <div
                              key={i}
                              className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 flex items-center justify-center glass"
                              style={{ animationDelay: `${i * 100}ms` }}
                            >
                              <Image className="h-5 w-5 text-primary/50" />
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
