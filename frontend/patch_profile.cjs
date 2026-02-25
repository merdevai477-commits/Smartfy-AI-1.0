const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'dashboard', 'AppSidebar.tsx');
let code = fs.readFileSync(filePath, 'utf8');

const newModal = `            <AnimatePresence>
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
                                                    className={\`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 \${isUploading ? 'opacity-50 blur-md' : ''}\`}
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
                                            <button 
                                                onClick={() => { setProfileOpen(false); router.push("/onboarding"); }} 
                                                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-[20px] bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all text-white text-sm font-semibold shadow-[0_8px_32px_rgba(255,255,255,0.02)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.06)] group"
                                            >
                                                <Edit3 className="h-5 w-5 text-violet-300 group-hover:text-violet-200 transition-colors" />
                                                {t("profile.editInfo", "Edit Information")}
                                            </button>
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
                                            {[
                                                { label: t("profile.name", "Name"), value: dbProfile?.name || displayName },
                                                { label: "Email", value: user?.primaryEmailAddress?.emailAddress || t("profile.notSpecified", "Not specified") },
                                                { label: t("profile.tone", "Preferred Tone"), value: dbProfile?.tone || t("profile.notSpecified", "Not specified") },
                                                { label: t("profile.marketingField", "Marketing Field"), value: dbProfile?.marketingTypes?.length ? dbProfile.marketingTypes.join(", ") : t("profile.notSpecified", "Not specified") },
                                                { label: t("profile.phone", "Phone Number"), value: dbProfile?.phone || t("profile.notSpecified", "Not specified") },
                                                { label: "Account Created", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t("profile.notSpecified", "Not specified") },
                                            ].map((item, i) => (
                                                <div key={i} className="flex flex-col p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-[20px] border border-white/[0.03] transition-colors relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <span className="text-[11px] font-semibold text-violet-300/50 uppercase tracking-widest mb-2">{item.label}</span>
                                                    <span className="text-[15px] font-medium text-white/90 truncate relative z-10">{item.value}</span>
                                                </div>
                                            ))}
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
                                                <div className={\`w-11 h-6 rounded-full relative transition-all border shadow-inner \${notifications ? 'bg-violet-500/80 border-violet-500/50' : 'bg-white/10 border-white/10'}\`}>
                                                    <div className={\`absolute top-[2px] w-4.5 h-4.5 bg-white rounded-full shadow-md transition-all \${notifications ? 'left-6 bg-white' : 'left-0.5 bg-white/70'}\`} />
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>`;

const startAnchor = `<AnimatePresence>
                {profileOpen && (`;

const endAnchor = `            </AnimatePresence>
        </Sidebar>`;

const startIndex = code.indexOf(startAnchor);
const endIndex = code.indexOf(endAnchor);

if (startIndex !== -1 && endIndex !== -1) {
    const replaced = code.slice(0, startIndex) + newModal + '\\n        </Sidebar>';
    fs.writeFileSync(filePath, replaced);
    console.log('Successfully replaced profile modal markup.');
} else {
    console.error('Anchors not found. startIndex:', startIndex, 'endIndex:', endIndex);
}
