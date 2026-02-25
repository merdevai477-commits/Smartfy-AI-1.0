import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Sparkles, Globe, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { updateMe } from "@/lib/api";

const languages: Record<string, { native: string; flag: string }> = {
  en: { native: "English", flag: "us" },
  ar: { native: "العربية", flag: "sa" },
  fr: { native: "Français", flag: "fr" },
  es: { native: "Español", flag: "es" },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { getToken } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.dir = lang === "ar" ? "rtl" : "ltr";
    setLangOpen(false);
    getToken().then((token) => {
      if (token) updateMe(token, { preferredLanguage: lang }).catch(() => { });
    });
  };

  const navLinks = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.howItWorks"), href: "#how-it-works" },
    { label: t("nav.pricing"), href: "#pricing" },
    { label: t("nav.faq"), href: "#faq" },
    { label: "Chat", href: "/chat" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/")) {
      router.push(href);
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      // استخدام offset أكبر قليلاً لضمان ظهور جميع الأقسام بشكل كامل
      const rect = el.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // استخدام offset 56px لضمان ظهور القسم بشكل كامل
      const targetY = rect.top + scrollTop - 56;

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: "smooth"
      });
    }
  };

  // Get current flag code safely
  const currentFlag = languages[i18n.language]?.flag || "us";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-border" : "bg-transparent"
          }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="h-6 w-6 text-primary absolute blur-sm opacity-50" />
              <Sparkles className="h-6 w-6 text-primary relative z-10" />
            </div>
            <span className="text-lg font-bold gradient-text tracking-tight">Smartfy AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.href)}
                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hover:glow-text"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label={
                mounted ? (theme === "dark" ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"
              }
            >
              {mounted && (theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              ))}
            </button>
            {/* 3D Glass Language Switcher */}
            <div className="relative z-50">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 transition-all text-sm text-foreground"
              >
                <img
                  src={`https://flagcdn.com/w20/${currentFlag}.png`}
                  alt="Flag"
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="uppercase">{i18n.language}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-40 bg-[#0a0a0f]/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1"
                  >
                    {Object.entries(languages).map(([code, { native, flag }]) => (
                      <button
                        key={code}
                        onClick={() => changeLanguage(code)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-white/10 transition-colors ${i18n.language === code ? "text-primary bg-primary/10" : "text-white/80"}`}
                      >
                        <img src={`https://flagcdn.com/w20/${flag}.png`} alt={native} className="w-4 h-4 rounded-full" />
                        {native}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-4 w-[1px] bg-white/10 mx-1" />

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                  {t("nav.login")}
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="gradient-bg text-sm font-medium text-white px-5 py-2 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                  {t("nav.signup")}
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => router.push("/chat")}
                className="gradient-bg text-sm font-medium text-white px-5 py-2 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                AI Dashboard
              </button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.href)}
                className="text-2xl font-bold text-white hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}

            <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
              {Object.entries(languages).map(([code, { flag }]) => (
                <button
                  key={code}
                  onClick={() => changeLanguage(code)}
                  className={`p-2 rounded-full transition-all ${i18n.language === code ? "bg-primary scale-110 shadow-lg" : "hover:bg-white/10"}`}
                >
                  <img src={`https://flagcdn.com/w40/${flag}.png`} alt={code} className="w-6 h-6 rounded-full" />
                </button>
              ))}
            </div>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="gradient-bg text-lg font-bold text-white px-8 py-3 rounded-full shadow-xl shadow-primary/30 w-[200px]">
                  {t("nav.signup")}
                </button>
              </SignInButton>
              <button className="text-muted-foreground hover:text-white">
                {t("nav.login")}
              </button>
            </SignedOut>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
