import { MousePointerClick, Settings2, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    { num: "01", icon: MousePointerClick, title: t("howItWorks.steps.1.title"), desc: t("howItWorks.steps.1.desc") },
    { num: "02", icon: Settings2, title: t("howItWorks.steps.2.title"), desc: t("howItWorks.steps.2.desc") },
    { num: "03", icon: Rocket, title: t("howItWorks.steps.3.title"), desc: t("howItWorks.steps.3.desc") },
  ];

  return (
    <section id="how-it-works" className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold heading-tight mb-4">
            {t("howItWorks.title")} <span className="gradient-text">{t("howItWorks.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground">{t("howItWorks.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px gradient-bg opacity-30" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="text-5xl font-bold gradient-text mb-4">{step.num}</div>
              <div className="w-14 h-14 rounded-2xl glass mx-auto mb-4 flex items-center justify-center">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
