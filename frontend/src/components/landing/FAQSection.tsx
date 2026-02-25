import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function FAQSection() {
  const { t } = useTranslation();

  const faqs = [
    { q: t("faq.items.1.q"), a: t("faq.items.1.a") },
    { q: t("faq.items.2.q"), a: t("faq.items.2.a") },
    { q: t("faq.items.3.q"), a: t("faq.items.3.a") },
    { q: t("faq.items.4.q"), a: t("faq.items.4.a") },
    { q: t("faq.items.5.q"), a: t("faq.items.5.a") },
    { q: t("faq.items.6.q"), a: t("faq.items.6.a") },
  ];

  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold heading-tight mb-4">
            {t("faq.title")} <span className="gradient-text">{t("faq.titleHighlight")}</span>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="glass rounded-xl border-none px-6">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4 text-start">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
