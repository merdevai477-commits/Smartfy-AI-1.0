import { useTranslation } from "react-i18next";

const brands = ["TechCorp", "GrowthLab", "MediaPro", "ScaleAI", "DataFlow", "NexGen", "CloudSync", "BrandForge"];

export default function LogosSection() {
  const { t } = useTranslation();
  return (
    <section className="relative py-16 border-y border-border/30">
      <p className="text-center text-sm text-muted-foreground mb-8 tracking-widest uppercase">
        {t("logos.trusted")}
      </p>
      <div className="overflow-hidden">
        <div className="flex animate-marquee">
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-8 lg:mx-12 text-xl font-bold text-muted-foreground/30 select-none"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
