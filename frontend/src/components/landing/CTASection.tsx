import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function CTASection() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-[0.07]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px]" />

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold heading-tight mb-4">
          {t("cta.title")} <span className="gradient-text">{t("cta.titleHighlight")}</span>
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{t("cta.subtitle")}</p>
        <button onClick={() => router.push("/chat")} className="gradient-bg text-primary-foreground font-semibold px-10 py-4 rounded-full glow hover:opacity-90 active:scale-95 transition-all text-base animate-pulse-glow">
          {t("cta.button")}
        </button>
        <p className="text-xs text-muted-foreground mt-4">{t("cta.note")}</p>
      </motion.div>
    </section>
  );
}
