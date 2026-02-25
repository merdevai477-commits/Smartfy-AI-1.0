import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useMe } from "@/hooks/useMe";

export function ProtectedWithProfile({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useMe();
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!user?.preferredLanguage) return;
    if (i18n.language !== user.preferredLanguage) {
      i18n.changeLanguage(user.preferredLanguage);
      document.dir = user.preferredLanguage === "ar" ? "rtl" : "ltr";
    }
  }, [user?.preferredLanguage, i18n]);

  useEffect(() => {
    if (isLoading || !user) return;
    const needsOnboarding = !user.name?.trim();
    if (needsOnboarding && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (user && !user.name?.trim()) {
    return null;
  }

  return <>{children}</>;
}
