"use client";

import { useState, useEffect, useRef } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar";
import {
    MessageSquarePlus,
    Settings,
    History,
    Sparkles,
    LogOut,
    MessageSquare,
    Sun,
    Moon,
    Bell,
    BellOff,
    Globe,
    X,
    ChevronRight,
    Edit3,
    Camera,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useClerk, useAuth, useUser } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listConversations, migrateTitles, fetchMe, updateMe } from "@/lib/api";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

/** Generate a deterministic user ID: first name + 3 special chars based on clerkId hash */
function generateUserId(name: string, clerkId: string): string {
    const specials = ["#", "!", "@", "$", "%", "^", "&", "*"];
    const chars = clerkId.slice(-3).split("").map((c, i) => specials[c.charCodeAt(0) % specials.length]);
    return (name?.split(" ")[0] || "User") + chars.join("");
}

const ALL_LANGUAGES = [
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷" },
    { code: "pt", label: "Português", flag: "🇵🇹" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
];

export function AppSidebar() {
    const { t, i18n } = useTranslation();
    const pathname = usePathname();
    const params = useParams<{ chatId?: string }>();
    const router = useRouter();
    const { signOut } = useClerk();
    const { getToken, userId } = useAuth();
    const { user } = useUser();
    const { theme, setTheme } = useTheme();

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [selectedLang, setSelectedLang] = useState(i18n.language?.substring(0, 2) || "en");
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Sync state language with i18n
    useEffect(() => {
        if (i18n.language) {
            setSelectedLang(i18n.language.substring(0, 2));
        }
    }, [i18n.language]);

    // Close settings on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
                setSettingsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const tokenQuery = useQuery({
        queryKey: ["sidebar-token"],
        queryFn: async () => await getToken({ skipCache: true }),
        staleTime: 2 * 60 * 1000,
        refetchInterval: 1 * 60 * 1000,
    });
    const token = tokenQuery.data ?? null;

    const queryClient = useQueryClient();
    const migrationRan = useRef(false);

    const { data: conversations = [], isLoading } = useQuery({
        queryKey: ["conversations", token],
        queryFn: () => listConversations(token!),
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
    });

    // Fetch user profile from Backend
    const { data: dbProfile, refetch: refetchProfile } = useQuery({
        queryKey: ["user-profile", token],
        queryFn: () => fetchMe(token!),
        enabled: !!token && profileOpen, // Only fetch if token exists and profile modal is open
        staleTime: 5 * 60 * 1000,
    });

    // Run title migration once on first load with a valid token
    useEffect(() => {
        if (!token || migrationRan.current) return;
        migrationRan.current = true;
        migrateTitles(token).then(({ updated }) => {
            if (updated > 0) {
                // Refresh conversation list so updated titles appear
                queryClient.invalidateQueries({ queryKey: ["conversations"] });
            }
        }).catch(() => {
            // Silently ignore migration errors
        });
    }, [token, queryClient]);

    // Derived values
    const displayName = dbProfile?.name || user?.fullName || user?.firstName || "المستخدم";
    const initials = displayName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
    const autoUserId = userId ? generateUserId(displayName, userId) : null;
    const avatarUrl = user?.imageUrl;

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setSelectedLang(langCode);
        setLangDropdownOpen(false);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsUploading(true);
        try {
            await user.setProfileImage({ file });
            toast.success("Profile image updated successfully");
            if (token) refetchProfile();
        } catch (error) {
            console.error("Failed to upload image:", error);
            toast.error(t("profile.uploadError", "Failed to update profile image. Please try again."));
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // --- Profile Editing State ---
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        tone: "",
        phone: "",
        marketingTypes: [] as string[],
    });

    // Sync form with profile data when modal opens or profile changes
    useEffect(() => {
        if (dbProfile && profileOpen && !isEditingProfile) {
            setEditForm({
                name: dbProfile.name || displayName || "",
                tone: dbProfile.tone || "",
                phone: dbProfile.phone || "",
                marketingTypes: dbProfile.marketingTypes || [],
            });
        }
    }, [dbProfile, profileOpen, displayName, isEditingProfile]);

    const handleSaveProfile = async () => {
        if (!token) return;
        setIsSavingProfile(true);
        try {
            await updateMe(token, {
                name: editForm.name,
                tone: editForm.tone,
                phone: editForm.phone,
                marketingTypes: editForm.marketingTypes.length > 0 ? editForm.marketingTypes : undefined,
            });
            toast.success(t("profile.updateSuccess", "Profile updated successfully"));
            setIsEditingProfile(false);
            refetchProfile();
        } catch (error) {
            console.error("Failed to save profile:", error);
            toast.error(t("profile.updateError", "Failed to update profile."));
        } finally {
            setIsSavingProfile(false);
        }
    };

    const toggleEditMode = () => {
        if (isEditingProfile) {
            // Cancel edit mode
            setIsEditingProfile(false);
            if (dbProfile) {
                setEditForm({
                    name: dbProfile.name || displayName || "",
                    tone: dbProfile.tone || "",
                    phone: dbProfile.phone || "",
                    marketingTypes: dbProfile.marketingTypes || [],
                });
            }
        } else {
            setIsEditingProfile(true);
        }
    };

    return (
        <>
            <Sidebar collapsible="icon" className="glass border-r border-white/5 bg-background/40 backdrop-blur-xl">
                <SidebarContent>
                    {/* ─── Logo ──────────────────────────────────────────────── */}
                    <SidebarGroup>
                        <div className="px-2 py-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                <Sparkles className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent group-data-[collapsible=icon]:hidden">
                                Smartfy AI
                            </span>
                        </div>
                    </SidebarGroup>

                    {/* ─── New Chat ───────────────────────────────────────────── */}
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="New Chat"
                                    className="gradient-bg text-primary-foreground hover:opacity-90 transition-all shadow-md group-data-[collapsible=icon]:p-2 glow"
                                >
                                    <Link href="/chat">
                                        <MessageSquarePlus className="w-5 h-5 mr-2 group-data-[collapsible=icon]:mr-0" />
                                        <span className="group-data-[collapsible=icon]:hidden font-medium">New Chat</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>

                    {/* ─── Recent Chats ───────────────────────────────────────── */}
                    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                        <SidebarGroupLabel className="text-white/50 flex items-center gap-2">
                            <History className="w-4 h-4" />
                            المحادثات الأخيرة
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {isLoading ? (
                                    <div className="px-4 py-3 text-xs text-white/40">جاري التحميل...</div>
                                ) : conversations.length === 0 ? (
                                    <div className="px-4 py-3 text-xs text-white/40">لا توجد محادثات سابقة</div>
                                ) : (
                                    conversations.map((conv) => {
                                        const isActive = params?.chatId === (conv as any).id || params?.chatId === (conv as any)._id;
                                        const convId = (conv as any).id || (conv as any)._id;
                                        const convTitle = (conv as any).title || "محادثة جديدة";
                                        return (
                                            <SidebarMenuItem key={convId}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={isActive}
                                                    tooltip={convTitle}
                                                    className={`hover:bg-white/10 transition-colors ${isActive ? "bg-white/10 text-white" : "text-white/70"}`}
                                                >
                                                    <Link href={`/chat/${convId}`}>
                                                        <MessageSquare className={`w-4 h-4 ${isActive ? "text-primary" : "text-white/50"}`} />
                                                        <span className="truncate text-[13px]">{convTitle}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/* ─── Footer: Profile + Settings ─────────────────────────────── */}
                <SidebarFooter className="pb-3">
                    {/* Profile Avatar */}
                    <button
                        onClick={() => {
                            setProfileOpen(true);
                            if (token) refetchProfile();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center"
                    >
                        {/* Avatar */}
                        <div className="relative w-9 h-9 rounded-full shrink-0 ring-2 ring-violet-500/30 overflow-hidden">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold">
                                    {initials}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 text-left group-data-[collapsible=icon]:hidden">
                            <p className="text-[13px] font-semibold text-white truncate">{displayName}</p>
                            {autoUserId && (
                                <p className="text-[11px] text-white/30 font-mono truncate">{autoUserId}</p>
                            )}
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-white/30 group-data-[collapsible=icon]:hidden shrink-0" />
                    </button>

                    <div className="h-px bg-white/5 my-1" />

                    {/* Settings Button with popup */}
                    <div className="relative" ref={settingsRef}>
                        <AnimatePresence>
                            {settingsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.18, ease: "easeOut" }}
                                    className="absolute bottom-full mb-2 left-0 right-0 bg-[#16141f]/95 backdrop-blur-2xl border border-white/[0.06] rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] p-2 z-50"
                                >
                                    <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider px-3 py-1.5">الإعدادات</p>

                                    {/* Theme */}
                                    <button
                                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
                                            <span className="text-[13px] text-white/80">المظهر</span>
                                        </div>
                                        <span className="text-[12px] text-white/40 bg-white/5 px-2 py-0.5 rounded-lg">
                                            {theme === "dark" ? "داكن" : "فاتح"}
                                        </span>
                                    </button>

                                    {/* Notifications */}
                                    <button
                                        onClick={() => setNotifications(!notifications)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            {notifications ? <Bell className="h-4 w-4 text-green-400" /> : <BellOff className="h-4 w-4 text-white/40" />}
                                            <span className="text-[13px] text-white/80">الإشعارات</span>
                                        </div>
                                        <div className={`w-8 h-4.5 rounded-full relative transition-all ${notifications ? "bg-violet-500" : "bg-white/10"}`}>
                                            <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-all ${notifications ? "left-4" : "left-0.5"}`} />
                                        </div>
                                    </button>

                                    {/* Language Dropdown */}
                                    <div>
                                        <button
                                            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Globe className="h-4 w-4 text-blue-400" />
                                                <span className="text-[13px] text-white/80">اللغة</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[12px] text-white/40">
                                                    {ALL_LANGUAGES.find(l => l.code === selectedLang)?.flag} {ALL_LANGUAGES.find(l => l.code === selectedLang)?.label}
                                                </span>
                                                <ChevronRight
                                                    className={`h-3.5 w-3.5 text-white/30 transition-transform duration-200 ${langDropdownOpen ? "rotate-90" : ""}`}
                                                />
                                            </div>
                                        </button>
                                        <AnimatePresence>
                                            {langDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="overflow-hidden px-2 pb-1"
                                                >
                                                    <div className="grid grid-cols-2 gap-1 pt-1">
                                                        {ALL_LANGUAGES.map((lang) => (
                                                            <button
                                                                key={lang.code}
                                                                onClick={() => { setSelectedLang(lang.code); setLangDropdownOpen(false); }}
                                                                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] transition-all ${selectedLang === lang.code
                                                                    ? "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30"
                                                                    : "bg-white/[0.03] text-white/50 hover:bg-white/10 hover:text-white/80"
                                                                    }`}
                                                            >
                                                                <span>{lang.flag}</span>
                                                                <span className="flex-1 text-left">{lang.label}</span>
                                                                {selectedLang === lang.code && (
                                                                    <svg className="h-3 w-3 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="h-px bg-white/5 my-1" />

                                    {/* Sign out */}
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400/80 hover:text-red-400 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span className="text-[13px]">تسجيل الخروج</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center ${settingsOpen ? "bg-white/5 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                        >
                            <Settings className="h-4.5 w-4.5 shrink-0" />
                            <span className="text-[13px] group-data-[collapsible=icon]:hidden">الإعدادات</span>
                        </button>
                    </div>
                </SidebarFooter>
            </Sidebar>

            {/* ─── Profile Modal ──────────────────────────────────────────── */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
            />
            <AnimatePresence>
                {profileOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/40"
                        onClick={(e) => e.target === e.currentTarget && setProfileOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="w-full max-w-5xl max-h-[90vh] h-auto flex flex-col bg-[#0f0e13]/80 backdrop-blur-[40px] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 md:px-8 border-b border-white/[0.05]">
                                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                                    <Sparkles className="h-6 w-6 text-violet-400" />
                                    {t("profile.title", "Profile Overview")}
                                </h2>
                                <button
                                    onClick={() => setProfileOpen(false)}
                                    className="p-2.5 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col lg:flex-row gap-8 min-h-0">

                                {/* Left Column: Avatar & Quick Actions */}
                                <div className="w-full lg:w-[35%] flex flex-col gap-6">
                                    {/* Avatar Card */}
                                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[28px] p-6 flex flex-col items-center relative overflow-hidden backdrop-blur-2xl shadow-inner">
                                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-fuchsia-600/5 pointer-events-none" />

                                        <div className="relative w-40 h-40 rounded-3xl overflow-hidden group shadow-[0_10px_40px_rgba(139,92,246,0.2)] ring-1 ring-white/20 mb-5 bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30">
                                            {avatarUrl ? (
                                                <img
                                                    src={avatarUrl}
                                                    alt={displayName}
                                                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isUploading ? 'opacity-50 blur-md' : ''}`}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/80 text-6xl font-bold bg-gradient-to-br from-violet-600/50 to-fuchsia-600/50">
                                                    {initials}
                                                </div>
                                            )}

                                            {isUploading && (
                                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                </div>
                                            )}

                                            {/* Beautiful Glass Overlay for Image Upload */}
                                            <div className="absolute inset-x-2 bottom-2 p-2 flex justify-center items-center z-10 overflow-hidden rounded-2xl border border-white/20 shadow-lg">
                                                <div className="absolute inset-0 bg-black/40 backdrop-blur-xl -z-10" />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={isUploading}
                                                    className="text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 transition-all px-3 py-1.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer z-20 w-full"
                                                >
                                                    <Camera className="w-3.5 h-3.5" />
                                                    {t("profile.uploadImage", "Change Picture")}
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white text-center tracking-tight">{displayName}</h3>
                                        {autoUserId && (
                                            <p className="text-[13px] text-violet-300/80 font-mono tracking-wider mt-2 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">{autoUserId}</p>
                                        )}

                                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

                                        {/* Liquid Glassmorphism Buttons */}
                                        <div className="flex flex-col gap-3 w-full relative z-10">
                                            {isEditingProfile ? (
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={isSavingProfile}
                                                    className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-[20px] bg-green-500/20 hover:bg-green-500/30 backdrop-blur-md border border-green-500/30 transition-all text-green-300 text-sm font-semibold shadow-[0_8px_32px_rgba(34,197,94,0.12)] group ${isSavingProfile ? 'opacity-70 cursor-not-allowed' : ''}`}
                                                >
                                                    {isSavingProfile ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5 group-hover:scale-110 transition-transform" />}
                                                    {t("profile.saveChanges", "Save Changes")}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={toggleEditMode}
                                                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-[20px] bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all text-white text-sm font-semibold shadow-[0_8px_32px_rgba(255,255,255,0.02)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.06)] group"
                                                >
                                                    <Edit3 className="h-5 w-5 text-violet-300 group-hover:text-violet-200 transition-colors" />
                                                    {t("profile.editInfo", "Edit Information")}
                                                </button>
                                            )}

                                            <button
                                                onClick={() => signOut()}
                                                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-[20px] bg-red-500/10 hover:bg-red-500/20 backdrop-blur-md border border-red-500/20 hover:border-red-500/40 transition-all text-red-400 text-sm font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_32px_rgba(239,68,68,0.15)] group"
                                            >
                                                <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                {t("profile.logout", "Log Out")}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Plan / Subscription Feature */}
                                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[28px] p-6 flex flex-col backdrop-blur-2xl shadow-inner">
                                        <h4 className="text-[13px] font-semibold text-white/50 mb-4 flex items-center gap-2 uppercase tracking-widest">
                                            <Sparkles className="h-4 w-4 text-amber-400" />
                                            Subscription
                                        </h4>
                                        <div className="flex items-center justify-between border border-white/[0.08] bg-white/[0.02] p-4 rounded-2xl shadow-sm">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-lg font-bold text-white">{dbProfile?.plan || "Free"} Plan</span>
                                                <span className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md w-fit tracking-wide">ACTIVE</span>
                                            </div>
                                            <button className="text-xs font-semibold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/10 text-white transition-all shadow-sm">
                                                Upgrade
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Details Grid */}
                                <div className="w-full lg:w-[65%] flex flex-col gap-6">

                                    {/* Personal Details Panel */}
                                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[28px] p-8 backdrop-blur-2xl shadow-inner">
                                        <h4 className="text-[13px] font-semibold text-white/50 mb-6 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                            Personal Details
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {/* Name */}
                                            <div className="flex flex-col p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-[20px] border border-white/[0.03] transition-colors relative overflow-hidden group">
                                                <span className="text-[11px] font-semibold text-violet-300/50 uppercase tracking-widest mb-2">{t("profile.name", "Name")}</span>
                                                {isEditingProfile ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                        className="bg-black/20 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/50 w-full transition-all"
                                                    />
                                                ) : (
                                                    <span className="text-[15px] font-medium text-white/90 truncate relative z-10">{dbProfile?.name || displayName}</span>
                                                )}
                                            </div>

                                            {/* Email (Readonly) */}
                                            <div className="flex flex-col p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-[20px] border border-white/[0.03] transition-colors relative overflow-hidden group">
                                                <span className="text-[11px] font-semibold text-violet-300/50 uppercase tracking-widest mb-2">Email</span>
                                                <span className="text-[15px] font-medium text-white/90 truncate relative z-10">{user?.primaryEmailAddress?.emailAddress || t("profile.notSpecified", "Not specified")}</span>
                                            </div>

                                            {/* Preferred Tone */}
                                            <div className="flex flex-col p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-[20px] border border-white/[0.03] transition-colors relative overflow-hidden group">
                                                <span className="text-[11px] font-semibold text-violet-300/50 uppercase tracking-widest mb-2">{t("profile.tone", "Preferred Tone")}</span>
                                                {isEditingProfile ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.tone}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, tone: e.target.value }))}
                                                        placeholder={t("profile.tonePlaceholder", "e.g. Professional, Friendly")}
                                                        className="bg-black/20 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/50 w-full transition-all"
                                                    />
                                                ) : (
                                                    <span className="text-[15px] font-medium text-white/90 truncate relative z-10">{dbProfile?.tone || t("profile.notSpecified", "Not specified")}</span>
                                                )}
                                            </div>

                                            {/* Marketing Field */}
                                            <div className="flex flex-col p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-[20px] border border-white/[0.03] transition-colors relative overflow-hidden group">
                                                <span className="text-[11px] font-semibold text-violet-300/50 uppercase tracking-widest mb-2">{t("profile.marketingField", "Marketing Field")}</span>
                                                {isEditingProfile ? (
                                                    <input
                                                        type="text"
                                                        value={editForm.marketingTypes.join(", ")}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, marketingTypes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                                                        placeholder={t("profile.marketingPlaceholder", "e.g. SEO, Content")}
                                                        className="bg-black/20 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/50 w-full transition-all"
                                                    />
                                                ) : (
                                                    <span className="text-[15px] font-medium text-white/90 truncate relative z-10">{dbProfile?.marketingTypes?.length ? dbProfile.marketingTypes.join(", ") : t("profile.notSpecified", "Not specified")}</span>
                                                )}
                                            </div>

                                            {/* Phone Number */}
                                            <div className="flex flex-col p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-[20px] border border-white/[0.03] transition-colors relative overflow-hidden group">
                                                <span className="text-[11px] font-semibold text-violet-300/50 uppercase tracking-widest mb-2">{t("profile.phone", "Phone Number")}</span>
                                                {isEditingProfile ? (
                                                    <input
                                                        type="tel"
                                                        value={editForm.phone}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                                        className="bg-black/20 border border-white/10 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/50 w-full transition-all"
                                                    />
                                                ) : (
                                                    <span className="text-[15px] font-medium text-white/90 truncate relative z-10">{dbProfile?.phone || t("profile.notSpecified", "Not specified")}</span>
                                                )}
                                            </div>

                                            {/* Account Created (Readonly) */}
                                            <div className="flex flex-col p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-[20px] border border-white/[0.03] transition-colors relative overflow-hidden group">
                                                <span className="text-[11px] font-semibold text-violet-300/50 uppercase tracking-widest mb-2">{t("profile.accountCreated", "Account Created")}</span>
                                                <span className="text-[15px] font-medium text-white/90 truncate relative z-10">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t("profile.notSpecified", "Not specified")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Preferences Panel */}
                                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[28px] p-8 backdrop-blur-2xl shadow-inner">
                                        <h4 className="text-[13px] font-semibold text-white/50 mb-6 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                            Quick Settings
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.06] rounded-[20px] border border-white/[0.03] transition-colors shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-white/5 rounded-2xl text-white/70 shadow-inner">
                                                        {theme === "dark" ? <Moon className="h-5 w-5 text-indigo-300" /> : <Sun className="h-5 w-5 text-amber-300" />}
                                                    </div>
                                                    <span className="text-[14px] font-semibold text-white/90">Appearance</span>
                                                </div>
                                                <span className="text-xs font-medium text-white/40 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">{theme === "dark" ? "Dark" : "Light"}</span>
                                            </button>

                                            <button onClick={() => setNotifications(!notifications)} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.06] rounded-[20px] border border-white/[0.03] transition-colors shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-white/5 rounded-2xl text-white/70 shadow-inner">
                                                        {notifications ? <Bell className="h-5 w-5 text-green-400" /> : <BellOff className="h-5 w-5 text-white/40" />}
                                                    </div>
                                                    <span className="text-[14px] font-semibold text-white/90">Notifications</span>
                                                </div>
                                                <div className={`w-11 h-6 rounded-full relative transition-all border shadow-inner ${notifications ? 'bg-violet-500/80 border-violet-500/50' : 'bg-white/10 border-white/10'}`}>
                                                    <div className={`absolute top-[2px] w-4.5 h-4.5 bg-white rounded-full shadow-md transition-all ${notifications ? 'left-6 bg-white' : 'left-0.5 bg-white/70'}`} />
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
