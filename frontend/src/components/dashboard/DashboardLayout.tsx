import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { Sun, Moon, Sparkles } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-white/[0.03] bg-background/10 backdrop-blur-3xl sticky top-0 z-10 px-4 shadow-[0_1px_1px_rgba(0,0,0,0.5),inset_0_-1px_0_rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1 opacity-70 hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <button
                            onClick={() => router.push("/#pricing")}
                            className="group relative px-6 py-2.5 rounded-full text-[13px] font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 opacity-90 group-hover:opacity-100 transition-opacity bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]" />
                            <div className="absolute inset-[1px] rounded-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                            <div className="absolute inset-0 mix-blend-overlay opacity-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                            <span className="relative flex items-center gap-2 drop-shadow-md">
                                <Sparkles className="h-3.5 w-3.5 text-fuchsia-200 animate-pulse" />
                                Upgrade
                            </span>
                        </button>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
