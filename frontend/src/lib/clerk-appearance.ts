import { dark } from "@clerk/themes";

const layout = {
  socialButtonsPlacement: "top" as const,
  socialButtonsVariant: "blockButton" as const,
  showOptionalFields: false,
  unsafe_disableDevelopmentModeWarnings: true,
};

export function getClerkAppearance(theme: string | undefined) {
  const isDark = theme === "dark";
  return {
    baseTheme: isDark ? dark : undefined,
    layout,
    variables: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      colorPrimary: "hsl(263, 70%, 58%)",
      colorBackground: "transparent",
      colorInputBackground: isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.04)",
      colorInputText: isDark ? "white" : "hsl(240, 10%, 10%)",
      colorText: isDark ? "white" : "hsl(240, 10%, 10%)",
      borderRadius: "1rem",
    },
    elements: {
      // ─── Card ─────────────────────────────────────────────────────────────
      card: {
        background: isDark ? "rgba(13, 12, 20, 0.97)" : "rgba(255, 255, 255, 0.97)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: isDark
          ? "0 30px 100px -15px rgba(124, 58, 237, 0.2), 0 0 1px rgba(255,255,255,0.05)"
          : "0 25px 50px -12px rgba(0, 0, 0, 0.12)",
        borderRadius: "1.5rem",
        padding: "2rem",
      },

      // ─── Hide ALL Clerk Branding ──────────────────────────────────────────
      footer: { display: "none" },
      footerPages: { display: "none" },
      footerAction: { display: "none" },
      footerActionLink: { display: "none" },
      // ──────────────────────────────────────────────────────────────────────

      // ─── Header ───────────────────────────────────────────────────────────
      header: { marginBottom: "1.25rem" },
      headerTitle: {
        fontFamily: "'Inter', sans-serif",
        fontWeight: "700",
        fontSize: "1.35rem",
        letterSpacing: "-0.02em",
        background: isDark ? "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.55) 100%)" : undefined,
        WebkitBackgroundClip: isDark ? "text" : undefined,
        WebkitTextFillColor: isDark ? "transparent" : "hsl(240, 10%, 10%)",
        marginBottom: "0.25rem",
      },
      headerSubtitle: {
        color: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.5)",
        fontSize: "0.875rem",
      },
      // ──────────────────────────────────────────────────────────────────────

      // ─── Social Buttons ───────────────────────────────────────────────────
      socialButtonsBlockButton: {
        background: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
        border: isDark ? "1px solid rgba(255, 255, 255, 0.07)" : "1px solid rgba(0, 0, 0, 0.08)",
        color: isDark ? "white" : "hsl(240, 10%, 10%)",
        borderRadius: "0.875rem",
        padding: "0.7rem",
        transition: "all 0.2s ease",
      },
      dividerLine: {
        background: isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.08)",
      },
      dividerText: {
        color: isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.35)",
        fontSize: "0.75rem",
      },
      // ──────────────────────────────────────────────────────────────────────

      // ─── Form Fields ──────────────────────────────────────────────────────
      formFieldLabel: {
        color: isDark ? "rgba(255, 255, 255, 0.55)" : "rgba(0, 0, 0, 0.6)",
        fontSize: "0.82rem",
        letterSpacing: "0.01em",
      },
      formFieldInput: {
        background: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)",
        border: isDark ? "1px solid rgba(255, 255, 255, 0.07)" : "1px solid rgba(0, 0, 0, 0.1)",
        color: isDark ? "white" : "hsl(240, 10%, 10%)",
        borderRadius: "0.875rem",
        padding: "0.75rem 1rem",
        transition: "all 0.2s ease",
      },
      // ──────────────────────────────────────────────────────────────────────

      // ─── Submit Button ────────────────────────────────────────────────────
      formButtonPrimary: {
        background: "linear-gradient(135deg, hsl(263, 70%, 60%), hsl(280, 70%, 50%))",
        boxShadow: "0 4px 20px rgba(124, 58, 237, 0.35)",
        border: "none",
        borderRadius: "0.875rem",
        fontWeight: "600",
        letterSpacing: "0.01em",
        transition: "all 0.25s ease",
      },
      // ──────────────────────────────────────────────────────────────────────

      // ─── User Button Popover ──────────────────────────────────────────────
      userButtonPopoverCard: isDark
        ? "bg-[rgba(13,12,20,0.98)] backdrop-blur-2xl border border-white/[0.06] rounded-xl shadow-2xl shadow-black/50"
        : "bg-white/98 backdrop-blur-2xl border border-black/10 rounded-xl shadow-2xl shadow-black/10",
      userButtonPopoverMain: "bg-transparent",
      userButtonPopoverActionButton: isDark
        ? "text-white/80 hover:bg-white/8 hover:text-white"
        : "text-foreground hover:bg-black/5",
      userButtonPopoverActionButtonText: "text-sm",
      userButtonPopoverFooter: "hidden",
      userButtonBox: "rounded-lg",
      // ──────────────────────────────────────────────────────────────────────
    },
  };
}
