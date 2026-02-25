import { useState, useRef, useEffect, KeyboardEvent, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import {
  Send,
  Paperclip,
  Settings,
  Share2,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Pen,
  Image,
  Video,
  Bot,
  PlusCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  createConversation,
  getConversation,
  streamMessage,
  listConversations,
  type Message as ApiMessage,
} from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  imageData?: string;
}

const modes = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "writer", label: "Writer", icon: Pen },
  { id: "image", label: "Image", icon: Image },
  { id: "agent", label: "Agent", icon: Bot },
];

// Removed models array as per new design

const suggestions = [
  { icon: Pen, text: "أكتب لي خطة محتوى للسوشيال ميديا لمدة أسبوع" },
  { icon: Bot, text: "أريد استراتيجية تسويقية لمنتج جديد" },
  { icon: Pen, text: "صغ لي إيميل تسويقي احترافي" },
  { icon: Sparkles, text: "اقترح لي أفكار فيديو تيك توك" },
];

const sampleResponses: Record<string, string> = {
  default:
    "I'd be happy to help with that! Here's what I can create for you:\n\n**Product Launch Email Campaign**\n\nSubject: 🚀 The Future of Marketing is Here\n\nHi [First Name],\n\nWe're thrilled to announce something that will transform how you approach marketing forever.\n\nIntroducing **Smartfy AI** — your AI-powered marketing team that works 24/7.\n\n✨ **What's new:**\n- AI-generated content that converts\n- Stunning visuals in seconds\n- Video production on autopilot\n- Smart campaign optimization\n\n[Get Started Free →]\n\nBest,\nThe Smartfy AI Team",
};

function toUiMessage(m: ApiMessage): Message {
  return {
    id: String(m.id),
    role: m.role === "assistant" ? "ai" : "user",
    content: m.content,
    timestamp: new Date(m.createdAt),
  };
}

export default function ChatPage() {
  const router = useRouter();
  const params = useParams<{ chatId?: string }>();
  const routeChatId = typeof params?.chatId === "string" ? params.chatId : undefined;
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("chat");
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [messageFeedback, setMessageFeedback] = useState<Record<string, 'like' | 'dislike' | null>>({});
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Read profile from localStorage (safe on client only)
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("smartfy_profile");
    if (stored) setUserProfile(JSON.parse(stored));
    setProfileLoaded(true);
  }, []);

  // Redirect new users to onboarding if no profile exists
  useEffect(() => {
    if (profileLoaded && !userProfile && isLoaded && isSignedIn) {
      router.replace("/onboarding");
    }
  }, [profileLoaded, userProfile, isLoaded, isSignedIn, router]);

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  };

  const toggleFeedback = (id: string, vote: 'like' | 'dislike') => {
    setMessageFeedback(prev => ({
      ...prev,
      [id]: prev[id] === vote ? null : vote,
    }));
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isCreatingConversation = useRef(false);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(routeChatId);

  const tokenQuery = useQuery({
    queryKey: ["chat-token"],
    queryFn: async () => {
      // Request a fresh token with skipCache to always get a new one
      const freshToken = await getToken({
        skipCache: true  // Always get fresh token
      });
      return freshToken;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 1 * 60 * 1000, // Refetch every 1 minute to keep token fresh
  });
  const token = tokenQuery.data ?? null;

  const { data: convData, isLoading: loadingConv } = useQuery({
    queryKey: ["conversation", currentChatId, token],
    queryFn: () => getConversation(token!, currentChatId!),
    enabled: !!currentChatId && !!token,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: conversations = [], refetch: refetchConversations } = useQuery({
    queryKey: ["conversations", token],
    queryFn: () => listConversations(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional client side check for 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("حجم الصورة يجب أن لا يتجاوز 10 ميجابايت");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Extract just the base64 part, split out the data url header
      const parts = base64String.split(',');
      if (parts.length === 2) {
        setSelectedImage(parts[1]);
        setImageMimeType(file.type);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImageMimeType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Only load messages from DB if we have a chatId AND no local messages yet
  // This prevents wiping freshly typed messages when navigating to a new conversation
  useEffect(() => {
    // Don't do anything if we're creating a conversation
    if (isCreatingConversation.current) {
      return;
    }

    if (!currentChatId) {
      // Only clear if navigating to the base /chat page (new chat clicked)
      setMessages([]);
      return;
    }

    // Don't load if we're in the middle of sending or already have messages
    if (sending || messages.length > 0) {
      return;
    }

    // Load from API only if the state is currently empty
    const apiMessages = convData?.messages ?? [];
    if (apiMessages.length > 0) {
      console.log('Loading messages from API:', apiMessages.length);
      setMessages(apiMessages.map(toUiMessage));
    }
  }, [currentChatId, convData?.messages, sending, messages.length]);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: isMobile ? "auto" : "smooth" });
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(async (text: string, imageDataParam?: string, imageMimeTypeParam?: string) => {
    console.log('🚀 sendMessage called with:', text.substring(0, 30));
    console.log('Current chatId:', currentChatId);
    console.log('Sending state:', sending);
    console.log('Token available:', !!token);

    const finalImageData = imageDataParam || selectedImage;
    const finalImageMimeType = imageMimeTypeParam || imageMimeType;

    if ((!text.trim() && !finalImageData) || !token || sending) {
      console.log('❌ sendMessage blocked - conditions not met');
      return; // Prevent multiple sends
    }
    const content = text.trim();
    setInput("");
    removeSelectedImage();
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    console.log('✅ sendMessage proceeding...');
    setSending(true);

    // 1. Add user message to UI IMMEDIATELY (before any async calls)
    const userMsgId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: "user" as const,
        content,
        timestamp: new Date(),
        imageData: finalImageData ?? undefined
      },
    ]);
    setIsTyping(true);

    let workingChatId = currentChatId;

    try {
      // 2. Create conversation if needed
      if (!workingChatId) {
        console.log('📝 Creating new conversation...');
        isCreatingConversation.current = true;
        const conv = await createConversation(token);
        if (!conv || !conv.id) {
          throw new Error("فشل في إنشاء المحادثة");
        }
        workingChatId = conv.id;
        setCurrentChatId(conv.id);
        console.log('✅ Conversation created:', workingChatId);
        // Navigate with replace to avoid re-triggering effects
        router.replace(`/chat/${conv.id}`);
        // Small delay to let navigation complete
        await new Promise(resolve => setTimeout(resolve, 100));
        isCreatingConversation.current = false;
        console.log('✅ Navigation complete, proceeding to send message...');
      }

      console.log('📤 About to call streamMessage with chatId:', workingChatId);
      const aiMsgId = (Date.now() + 1).toString();

      // 3. Stream the AI response
      await streamMessage(
        token,
        workingChatId,
        "user",  // correct role - backend reads this as the user message
        content,
        finalImageData ?? undefined,
        finalImageMimeType ?? undefined,
        (textChunk) => {
          setIsTyping(false);
          setMessages((prev) => {
            const existingMsgIndex = prev.findIndex(m => m.id === aiMsgId);
            if (existingMsgIndex >= 0) {
              const newMsgs = [...prev];
              newMsgs[existingMsgIndex] = {
                ...newMsgs[existingMsgIndex],
                content: newMsgs[existingMsgIndex].content + textChunk
              };
              return newMsgs;
            } else {
              return [...prev, {
                id: aiMsgId,
                role: "ai" as const,
                content: textChunk,
                timestamp: new Date()
              }];
            }
          });
        },
        (errorMsg) => {
          setIsTyping(false);
          setMessages((prev) => [...prev, {
            id: (Date.now() + 2).toString(),
            role: "ai" as const,
            content: `⚠️ ${errorMsg}`,
            timestamp: new Date()
          }]);
        },
        () => {
          setSending(false);
          setIsTyping(false);
        }
      );

    } catch (e: any) {
      console.error("Chat error:", e);
      isCreatingConversation.current = false;
      setIsTyping(false);
      setSending(false);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 3).toString(),
        role: "ai" as const,
        content: `حدث خطأ غير متوقع: ${e?.message || e}. يرجى المحاولة مرة أخرى.`,
        timestamp: new Date()
      }]);
    }
  }, [token, currentChatId, selectedImage, imageMimeType, sending, router]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  };

  // ─── STRICT AUTH GUARD ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoaded && !isSignedIn) router.replace("/");
  }, [isLoaded, isSignedIn, router]);

  // ─── GREETING on first load for onboarded users ─────────────────────────────
  useEffect(() => {
    if (!userProfile || messages.length > 0 || currentChatId) return;
    const toneGreetings: Record<string, string> = {
      professional: "مرحباً بك! أنا Smartfy AI، خبيرك في التسويق الرقمي. جاهز لمساعدتك بأسلوب مهني واحترافي.",
      friendly: "أهلاً وسهلاً! 😊 أنا Smartfy AI، صديقك في عالم التسويق! كيف أقدر أساعدك اليوم؟",
      creative: "مرحباً! 🎨 أنا Smartfy AI — جاهز نفكر ونبدع سوا في عالم التسويق!",
      formal: "تحية طيبة. أنا Smartfy AI — نظام ذكاء اصطناعي متخصص في التسويق الرقمي. كيف أستطيع خدمتك؟",
      fun: "هاي هاي! 🎉 أنا Smartfy AI وأنا هنا عشان نخلي التسويق ممتع!",
    };
    const toneLine = toneGreetings[userProfile.tone] ||
      `أهلاً ${userProfile.name}! 👋 أنا Smartfy AI — مساعدك الذكي في التسويق والمحتوى. بأمر إيه؟`;
    const greeting = `أهلاً ${userProfile.name}! 👋\n\n${toneLine}${userProfile.marketingTypes?.length
      ? `\n\nشايف إنك متخصص في: **${userProfile.marketingTypes.join("، ")}** — ممتاز! خليني أكون شريكك في النجاح. 🚀`
      : ""
      }`;
    setMessages([{ id: "greeting", role: "ai" as const, content: greeting, timestamp: new Date() }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);
  // ──────────────────────────────────────────────────────────────────────────────

  if (!isLoaded || !isSignedIn) return null;

  const isLoading = !!currentChatId && loadingConv;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] sm:h-[calc(100vh-4rem)]">

        <div className="flex-1 overflow-y-auto min-h-0 relative bg-[#0B0A0F] rounded-tl-3xl border-t border-l border-white/5 flex flex-col">
          {/* Subtle radial glow background inspired by Gamma */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/20 via-[#0B0A0F]/5 to-[#0B0A0F]/80 pointer-events-none" />

          {/* Top Header */}
          <div className="relative z-10 flex items-center justify-between p-4 sm:px-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 group cursor-default">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-violet-500/20 blur-md rounded-full group-hover:bg-violet-500/40 transition-colors" />
                  <Sparkles className="h-4 w-4 text-violet-400 relative z-10" />
                </div>
                <span className="text-white/90 font-semibold text-[15px] tracking-tight ml-1">Smartfy AI</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative overflow-y-auto custom-scrollbar p-4 sm:p-8 flex flex-col">
            <div className="max-w-3xl mx-auto space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                  <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                  className="flex flex-col items-center justify-center flex-1 py-6 sm:py-10"
                >
                  {/* Personalized Greeting */}
                  <h2 className="text-[36px] sm:text-[42px] font-bold mb-3 text-center tracking-tight mt-8 relative">
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                      {userProfile?.name
                        ? `أهلاً، ${userProfile.name.split(" ")[0]}! 👋`
                        : "أهلاً بك في Smartfy AI 👋"}
                    </span>
                  </h2>
                  <p className="text-gray-400/80 mb-16 text-[15px] sm:text-[16px] text-center max-w-[520px] leading-relaxed tracking-wide font-medium">
                    {userProfile?.marketingTypes?.length
                      ? `خبيرك الذكي في ${userProfile.marketingTypes.slice(0, 2).join(" و")} — جاهز يساعدك الآن 🚀`
                      : "خبيرك الذكي في التسويق وكتابة المحتوى — جاهز يساعدك الآن 🚀"}
                  </p>

                  <div className="grid md:grid-cols-3 gap-5 w-full max-w-4xl px-4 perspective-1000">
                    {/* Social Media Card */}
                    <motion.button
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, type: "spring", bounce: 0.2, damping: 20 }}
                      onClick={() => sendMessage("اكتب لي محتوى احترافي لوسائل التواصل الاجتماعي")}
                      disabled={sending}
                      className="group relative overflow-hidden rounded-[1.25rem] p-6 text-left transition-all duration-500 ease-out hover:-translate-y-1.5 bg-gradient-to-b from-[#1C162A]/90 to-[#0F0B18]/90 border border-white/[0.03] ring-1 ring-white/[0.02] hover:ring-violet-500/20 hover:border-violet-500/30 hover:shadow-[0_15px_40px_-10px_rgba(139,92,246,0.15),inset_0_1px_1px_rgba(255,255,255,0.05)] flex flex-col h-full min-h-[160px] backdrop-blur-3xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] w-fit mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                      </div>
                      <h3 className="text-[17px] font-semibold text-gray-100 mb-2 tracking-tight group-hover:text-white transition-colors">محتوى السوشيال ميديا</h3>
                      <p className="text-[13px] text-gray-400/80 leading-relaxed font-medium">بوستات، ريلز، استوريز — محتوى يحقق engagement حقيقي</p>
                    </motion.button>

                    {/* Marketing Strategy Card */}
                    <motion.button
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, type: "spring", bounce: 0.2, damping: 20 }}
                      onClick={() => sendMessage("ساعدني في بناء استراتيجية تسويقية فعالة")}
                      disabled={sending}
                      className="group relative overflow-hidden rounded-[1.25rem] p-6 text-left transition-all duration-500 ease-out hover:-translate-y-1.5 bg-gradient-to-b from-[#1C162A]/90 to-[#0F0B18]/90 border border-white/[0.03] ring-1 ring-white/[0.02] hover:ring-violet-500/20 hover:border-violet-500/30 hover:shadow-[0_15px_40px_-10px_rgba(139,92,246,0.15),inset_0_1px_1px_rgba(255,255,255,0.05)] flex flex-col h-full min-h-[160px] backdrop-blur-3xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] w-fit mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                      </div>
                      <h3 className="text-[17px] font-semibold text-gray-100 mb-2 tracking-tight group-hover:text-white transition-colors">استراتيجية التسويق</h3>
                      <p className="text-[13px] text-gray-400/80 leading-relaxed font-medium">خطط تسويقية مبنية على بيانات حقيقية لتحقيق نتائج ملموسة</p>
                    </motion.button>

                    {/* Ad Copy Card */}
                    <motion.button
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, type: "spring", bounce: 0.2, damping: 20 }}
                      onClick={() => sendMessage("اكتب لي نص إعلاني مقنع لمنتجي")}
                      disabled={sending}
                      className="group relative overflow-hidden rounded-[1.25rem] p-6 text-left transition-all duration-500 ease-out hover:-translate-y-1.5 bg-gradient-to-b from-[#1C162A]/90 to-[#0F0B18]/90 border border-white/[0.03] ring-1 ring-white/[0.02] hover:ring-violet-500/20 hover:border-violet-500/30 hover:shadow-[0_15px_40px_-10px_rgba(139,92,246,0.15),inset_0_1px_1px_rgba(255,255,255,0.05)] flex flex-col h-full min-h-[160px] backdrop-blur-3xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] w-fit mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                        <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                      </div>
                      <h3 className="text-[17px] font-semibold text-gray-100 mb-2 tracking-tight group-hover:text-white transition-colors">نصوص إعلانية</h3>
                      <p className="text-[13px] text-gray-400/80 leading-relaxed font-medium">إعلانات Facebook وGoogle تحول الزوار إلى عملاء فعليين</p>
                    </motion.button>
                  </div>

                  {/* Bottom Chips - Marketing focused */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-auto pt-16 pb-2 w-full max-w-4xl">
                    {[
                      "اكتب لي بوست إنستقرام",
                      "استراتيجية email marketing",
                      "أفكار محتوى لأسبوع كامل",
                      "كيف أزيد متابعيني؟",
                    ].map((chip, idx) => (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + (idx * 0.05), type: "spring", bounce: 0.3 }}
                        key={chip}
                        onClick={() => sendMessage(chip)}
                        className="px-5 py-2.5 rounded-full text-[13px] font-medium text-gray-400 bg-[#15141D] border border-white/[0.03] ring-1 ring-white/[0.01] hover:bg-[#1E1D2A] hover:text-white transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.02)] hover:-translate-y-0.5"
                      >
                        {chip}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

              ) : (
                <>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                      className={`flex gap-3 sm:gap-4 w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "ai" && (
                        <div className="relative group w-8 h-8 mt-2 flex-shrink-0">
                          <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`group relative max-w-[85%] sm:max-w-[75%] px-7 py-5 rounded-3xl ${msg.role === "user"
                          ? "bg-gradient-to-b from-[#1C162A] to-[#120D1A] text-white border border-white/[0.03] ring-1 ring-white/[0.02] shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.03)]"
                          : "bg-transparent text-gray-200"
                          }`}
                      >
                        {msg.role === "ai" ? (
                          <div className="space-y-4">
                            <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                            </div>
                            {/* Action buttons */}
                            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                              <button
                                onClick={() => copyMessage(msg.id, msg.content)}
                                className="text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg"
                                title="نسخ"
                              >
                                {copiedMessageId === msg.id ? (
                                  <svg className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                              <div className="flex-1" />
                              <button
                                onClick={() => toggleFeedback(msg.id, 'like')}
                                className={`transition-colors p-1.5 rounded-lg ${messageFeedback[msg.id] === 'like'
                                  ? 'text-green-400 bg-green-400/10'
                                  : 'text-gray-500 hover:text-green-400 hover:bg-white/5'
                                  }`}
                                title="إعجاب"
                              >
                                <ThumbsUp className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => toggleFeedback(msg.id, 'dislike')}
                                className={`transition-colors p-1.5 rounded-lg ${messageFeedback[msg.id] === 'dislike'
                                  ? 'text-red-400 bg-red-400/10'
                                  : 'text-gray-500 hover:text-red-400 hover:bg-white/5'
                                  }`}
                                title="عدم إعجاب"
                              >
                                <ThumbsDown className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {msg.imageData && (
                              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                                <img
                                  src={`data:image/jpeg;base64,${msg.imageData}`}
                                  alt="User upload"
                                  className="max-h-60 object-cover w-full scale-100 hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <p className="text-[15px] leading-relaxed font-medium">{msg.content}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="flex gap-3 sm:gap-4 w-full justify-start"
                    >
                      <div className="relative group w-8 h-8 mt-2 flex-shrink-0">
                        <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="px-6 py-5 flex gap-1.5 items-center h-14">
                        <span
                          className="w-2 h-2 rounded-full bg-violet-500/80 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-violet-500/80 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-violet-500/80 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </motion.div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area (Floating) */}
        <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-8 pointer-events-none">
          <div className="max-w-4xl mx-auto w-full pointer-events-auto">
            {selectedImage && (
              <div className="mb-4 relative inline-flex">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                  <img src={`data:${imageMimeType};base64,${selectedImage}`} alt="Upload preview" className="max-h-32 object-contain" />
                </div>
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-xl border-2 border-[#0B0A0F]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-x-8 -inset-y-4 bg-violet-600/10 rounded-full blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative bg-[#15141D]/90 border border-white/[0.04] ring-1 ring-white/[0.02] rounded-[2rem] p-2 flex items-center gap-2 transition-all duration-300 ease-out shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.03)] group-focus-within:border-white/10 group-focus-within:bg-[#1C1A27]/95 group-focus-within:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.05)] backdrop-blur-3xl">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    handleTextareaInput();
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  rows={1}
                  className="flex-1 bg-transparent text-[15.5px] font-medium text-gray-100 placeholder-gray-500/70 resize-none outline-none max-h-40 min-h-[44px] py-4 px-6 leading-relaxed"
                />

                <div className="flex items-center gap-1.5 pr-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-400 hover:text-white p-2.5 hover:bg-white/5 rounded-full transition-all flex-shrink-0"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={(!input.trim() && !selectedImage) || sending}
                    className={`p-3 rounded-full transition-all duration-300 ease-out flex-shrink-0 flex items-center justify-center ${input.trim() || selectedImage
                      ? "bg-violet-600 text-white hover:bg-violet-500 hover:scale-[1.05] active:scale-[0.95] shadow-[0_0_20px_rgba(139,92,246,0.4)] relative overflow-hidden"
                      : "bg-white/[0.03] text-gray-500/70 ring-1 ring-white/[0.02]"
                      }`}
                  >
                    {input.trim() || selectedImage ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        <Send className="h-[18px] w-[18px] ml-0.5 relative z-10" />
                      </>
                    ) : (
                      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 px-2">
              <p className="text-[11px] font-medium text-white/30">
                Smartfy AI 1.0 can make mistakes. Verify important information.
              </p>
              <p className="text-[11px] font-medium text-white/30 hidden sm:block">
                Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
