import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    MessageSquarePlus,
    LayoutDashboard,
    Settings,
    HelpCircle,
    History,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: History, label: "History", href: "/history" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="h-full w-[260px] bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    Smartfy AI
                </span>
            </div>

            {/* New Chat Button */}
            <div className="px-4 mb-6">
                <Link
                    href="/chat"
                    className="flex items-center gap-2 w-full gradient-bg text-primary-foreground font-medium px-4 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-primary/25 group"
                >
                    <MessageSquarePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>New Chat</span>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-2 space-y-1">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-white/10 text-white shadow-sm border border-white/5"
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                            )}
                        >
                            <link.icon className={cn("w-5 h-5", isActive ? "text-primary" : "opacity-70")} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Area (Optional Credits or Version) */}
            <div className="p-4 border-t border-white/5">
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 border border-white/5">
                    <h4 className="text-sm font-medium text-white mb-1">Pro Plan</h4>
                    <p className="text-xs text-muted-foreground mb-3">You have 50 credits left</p>
                    <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[70%] rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
