import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const currencies: Record<string, { symbol: string; rate: number; label: string; flagCode: string }> = {
  USD: { symbol: "$", rate: 1, label: "USD", flagCode: "us" },
  EGP: { symbol: "E£", rate: 50, label: "EGP", flagCode: "eg" },
  GBP: { symbol: "£", rate: 0.8, label: "GBP", flagCode: "gb" },
  KWD: { symbol: "KD", rate: 0.31, label: "KWD", flagCode: "kw" },
  SAR: { symbol: "SAR", rate: 3.75, label: "SAR", flagCode: "sa" },
  AED: { symbol: "AED", rate: 3.67, label: "AED", flagCode: "ae" },
};

export default function PricingSection() {
  const { t } = useTranslation();
  const [yearly, setYearly] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [isOpen, setIsOpen] = useState(false);

  const plans = [
    {
      name: t("pricing.plans.starter.name"),
      monthly: 29, yearly: 23,
      desc: t("pricing.plans.starter.desc"),
      features: t("pricing.features.starter", { returnObjects: true }) as string[],
      cta: t("pricing.cta.start"), popular: false, badge: null,
    },
    {
      name: t("pricing.plans.pro.name"),
      monthly: 79, yearly: 63,
      desc: t("pricing.plans.pro.desc"),
      features: t("pricing.features.pro", { returnObjects: true }) as string[],
      cta: t("pricing.cta.start"), popular: true, badge: t("pricing.plans.pro.badge"),
    },
    {
      name: t("pricing.plans.enterprise.name"),
      monthly: 199, yearly: 159,
      desc: t("pricing.plans.enterprise.desc"),
      features: t("pricing.features.enterprise", { returnObjects: true }) as string[],
      cta: t("pricing.cta.contact"), popular: false, badge: t("pricing.plans.enterprise.badge"),
    },
  ];

  const formatPrice = (price: number) => {
    const value = price * currencies[currency].rate;
    return value < 10 ? value.toFixed(2) : Math.round(value).toLocaleString();
  };

  return (
    <section id="pricing" className="py-24 lg:py-32 relative overflow-visible z-20">
      {/* Background blobs for "Liquid" feel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full opacity-20 pointer-events-none z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-4">
            {t("pricing.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold heading-tight mb-4">
            {t("pricing.title")} <span className="gradient-text">{t("pricing.titleHighlight")}</span>{t("pricing.titleSuffix")}
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">{t("pricing.subtitle")}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">

            {/* 3D Billing Toggle */}
            <div
              className="flex items-center gap-4 bg-white/5 backdrop-blur-xl rounded-2xl p-1.5 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-b-4 border-b-white/5 transition-all hover:scale-[1.02]"
              onClick={() => setYearly(!yearly)}
            >
              <button
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${!yearly ? "bg-white/10 shadow-inner text-white" : "text-muted-foreground hover:bg-white/5"}`}
                onClick={(e) => { e.stopPropagation(); setYearly(false); }}
              >
                {t("pricing.monthly")}
              </button>
              <button
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${yearly ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted-foreground hover:bg-white/5"}`}
                onClick={(e) => { e.stopPropagation(); setYearly(true); }}
              >
                {t("pricing.yearly")} <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white">{t("pricing.save")}</span>
              </button>
            </div>

            {/* 3D Currency Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 border-b-4 border-b-white/5 rounded-2xl px-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-white font-medium min-w-[140px] justify-between transition-colors hover:bg-white/10 hover:border-white/20"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={`https://flagcdn.com/w40/${currencies[currency].flagCode}.png`}
                    alt={currency}
                    className="w-5 h-5 rounded-full object-cover shadow-sm ring-1 ring-white/20"
                  />
                  <span>{currency}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </motion.button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-3 w-[180px] bg-[#1a1a2e]/95 backdrop-blur-2xl border border-white/10 border-b-4 border-b-black/20 rounded-2xl shadow-2xl overflow-hidden z-50 p-1"
                  >
                    {Object.keys(currencies).map((c) => (
                      <button
                        key={c}
                        onClick={() => { setCurrency(c); setIsOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${currency === c
                          ? "bg-primary/20 text-white font-semibold"
                          : "text-white/70 hover:bg-white/10 hover:translate-x-1 hover:text-white"
                          }`}
                      >
                        <img
                          src={`https://flagcdn.com/w40/${currencies[c].flagCode}.png`}
                          alt={c}
                          className="w-5 h-5 rounded-full object-cover shadow-sm"
                        />
                        <div className="flex flex-col leading-none">
                          <span className="text-xs font-semibold">{c}</span>
                          <span className="text-[10px] opacity-60">{currencies[c].label}</span>
                        </div>
                        {currency === c && <Check className="ml-auto w-3 h-3 text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group relative h-[500px] w-full overflow-hidden rounded-3xl transition-all duration-500
                ${plan.popular
                  ? "bg-white/10 border-primary/50 shadow-[0_0_50px_-12px_hsl(var(--primary)/0.3)] scale-105 z-10"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"}
                backdrop-blur-2xl border flex flex-col`}
            >
              {/* Internal Sheer Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              {/* Main Content */}
              <div className="relative z-20 p-8 flex flex-col items-start h-full">
                {plan.badge && (
                  <div className="absolute top-4 right-4 gradient-bg text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    {plan.badge}
                  </div>
                )}

                <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? "text-white" : "text-foreground"}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-black ${plan.popular ? "text-white" : "text-foreground"}`}>
                    {currencies[currency].symbol}{formatPrice(yearly ? plan.yearly : plan.monthly)}
                  </span>
                  <span className="text-muted-foreground text-sm font-medium">/mo</span>
                </div>
                <p className="text-muted-foreground text-sm mb-8 line-clamp-2">{plan.desc}</p>

                <div className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent mb-8" />

                <ul className="space-y-4 w-full">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? "bg-primary text-white shadow-lg shadow-primary/40" : "bg-primary/10 text-primary"}`}>
                        <Check className="h-3 w-3" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Floating Footer */}
              <div className="absolute bottom-2 w-[calc(100%-16px)] ml-2 z-30 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-3 px-5 flex justify-between items-center shadow-xl">
                <p className="text-xs text-muted-foreground font-medium group-hover:text-foreground transition-colors">Ready to start?</p>
                <button className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-lg ${plan.popular
                  ? "gradient-bg text-white hover:opacity-90 hover:scale-105"
                  : "bg-white/10 hover:bg-white/20 text-foreground border border-white/5"
                  }`}>
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
