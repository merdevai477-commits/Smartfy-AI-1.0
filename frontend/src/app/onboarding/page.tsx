"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Sparkles, ChevronRight, Check, User, Phone, Briefcase, Mic } from "lucide-react";

const TONES = [
  { id: "professional", label: "مهني", emoji: "💼" },
  { id: "friendly", label: "ودود", emoji: "😊" },
  { id: "creative", label: "إبداعي", emoji: "🎨" },
  { id: "formal", label: "رسمي", emoji: "🏛️" },
  { id: "fun", label: "مرح", emoji: "🎉" },
];

const MARKETING_TYPES = [
  { id: "social", label: "السوشيال ميديا", emoji: "📱" },
  { id: "email", label: "Email Marketing", emoji: "📧" },
  { id: "seo", label: "SEO", emoji: "🔍" },
  { id: "ads", label: "الإعلانات المدفوعة", emoji: "💰" },
  { id: "content", label: "المحتوى", emoji: "✍️" },
  { id: "video", label: "الفيديو", emoji: "🎬" },
  { id: "influencer", label: "المؤثرين", emoji: "⭐" },
  { id: "ecommerce", label: "التجارة الإلكترونية", emoji: "🛒" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(user?.firstName || "");
  const [tone, setTone] = useState<string | null>(null);
  const [marketingTypes, setMarketingTypes] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleMarketing = (id: string) => {
    setMarketingTypes((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const validateStep = () => {
    if (step === 0 && !name.trim()) {
      setErrors({ name: "الاسم مطلوب" });
      return false;
    }
    if (step === 3 && !agreed) {
      setErrors({ terms: "يجب الموافقة على الشروط والأحكام" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    // Save profile to localStorage for now
    const profile = { name, tone, marketingTypes, phone };
    localStorage.setItem("smartfy_profile", JSON.stringify(profile));
    // Small delay for UX
    await new Promise((r) => setTimeout(r, 800));
    router.push("/chat");
  };

  const steps = [
    { title: "ما اسمك؟", subtitle: "سنستخدمه لإضفاء طابع شخصي على محادثاتك ✨" },
    { title: "كيف تريد أن يتكلم معك المساعد؟", subtitle: "اختياري — يمكنك تغييره لاحقاً" },
    { title: "ما مجال تسويقك؟", subtitle: "اختياري — يمكن اختيار أكثر من واحد" },
    { title: "تقريباً انتهينا!", subtitle: "رقم جوالك والموافقة على الشروط" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0A0F] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="relative">
            <Sparkles className="h-7 w-7 text-violet-400 absolute blur-sm opacity-60" />
            <Sparkles className="h-7 w-7 text-violet-400 relative z-10" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Smartfy AI</span>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? "bg-violet-500 w-8" : "bg-white/10 w-4"
                }`}
            />
          ))}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-[#13121A] border border-white/[0.05] rounded-3xl p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          >
            {/* Step header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                {steps[step].title}
              </h1>
              <p className="text-gray-400 text-sm">{steps[step].subtitle}</p>
            </div>

            {/* Step 0: Name */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors({}); }}
                    placeholder="أدخل اسمك الكامل"
                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-2xl pl-11 pr-4 py-4 text-white placeholder-gray-500 text-[15px] outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all"
                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                    autoFocus
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-sm flex items-center gap-1">⚠ {errors.name}</p>
                )}
              </div>
            )}

            {/* Step 1: Tone */}
            {step === 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id === tone ? null : t.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 ${tone === t.id
                        ? "border-violet-500/60 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                        : "border-white/[0.05] bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                      }`}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="text-[13px] font-medium text-white">{t.label}</span>
                    {tone === t.id && (
                      <span className="w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Marketing types */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-3">
                {MARKETING_TYPES.map((m) => {
                  const selected = marketingTypes.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleMarketing(m.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200 text-left ${selected
                          ? "border-violet-500/60 bg-violet-500/10"
                          : "border-white/[0.05] bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                        }`}
                    >
                      <span className="text-lg">{m.emoji}</span>
                      <span className="text-[13px] font-medium text-white flex-1">{m.label}</span>
                      {selected && (
                        <span className="w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5 text-white" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 3: Phone + Terms */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="رقم الجوال (اختياري)"
                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-2xl pl-11 pr-4 py-4 text-white placeholder-gray-500 text-[15px] outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all"
                    dir="ltr"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div
                    onClick={() => { setAgreed(!agreed); setErrors({}); }}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex-shrink-0 flex items-center justify-center transition-all ${agreed
                        ? "bg-violet-500 border-violet-500"
                        : "border-white/20 bg-white/5 group-hover:border-violet-500/50"
                      }`}
                  >
                    {agreed && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-400 leading-relaxed">
                    أوافق على{" "}
                    <span className="text-violet-400 underline underline-offset-2">شروط الخدمة</span>
                    {" "}و{" "}
                    <span className="text-violet-400 underline underline-offset-2">سياسة الخصوصية</span>
                    {" "}الخاصة بـ Smartfy AI
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-400 text-sm">⚠ {errors.terms}</p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => step > 0 ? setStep(step - 1) : null}
                className={`text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5 ${step === 0 ? "invisible" : ""}`}
              >
                رجوع
              </button>

              <button
                onClick={step === 3 ? handleSubmit : handleNext}
                disabled={submitting}
                className="group relative flex items-center gap-2 px-6 py-3 rounded-2xl text-[14px] font-semibold text-white overflow-hidden disabled:opacity-70 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600" />
                <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                <span className="relative">
                  {submitting ? "جاري الحفظ..." : step === 3 ? "ابدأ الآن 🚀" : "التالي"}
                </span>
                {!submitting && step < 3 && (
                  <ChevronRight className="h-4 w-4 relative" />
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Skip link for optional steps */}
        {step > 0 && step < 3 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setStep(step + 1)}
            className="w-full text-center mt-4 text-sm text-gray-500 hover:text-gray-300 transition-colors py-2"
          >
            تخطي هذه الخطوة
          </motion.button>
        )}
      </div>
    </div>
  );
}
