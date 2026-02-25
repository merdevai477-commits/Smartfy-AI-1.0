import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = [
    {
      quote: t("testimonials.reviews.1.quote"),
      name: "Sarah Chen",
      role: t("testimonials.reviews.1.role"),
      company: "TechCorp"
    },
    {
      quote: t("testimonials.reviews.2.quote"),
      name: "Marcus Johnson",
      role: t("testimonials.reviews.2.role"),
      company: "GrowthLab"
    },
    {
      quote: t("testimonials.reviews.3.quote"),
      name: "Priya Patel",
      role: t("testimonials.reviews.3.role"),
      company: "ScaleAI"
    },
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold heading-tight mb-4">
            {t("testimonials.title")} <span className="gradient-text">{t("testimonials.titleHighlight")}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 glass-hover transition-all"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
