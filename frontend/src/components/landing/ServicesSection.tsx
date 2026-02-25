import { Pen, Image, Video, BarChart3, Share2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function ServicesSection() {
  const { t } = useTranslation();

  const services = [
    {
      icon: Pen,
      title: t("services.cards.content.title"),
      desc: t("services.cards.content.desc"),
      tags: t("services.cards.content.tag"),
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800"
    },
    {
      icon: Image,
      title: t("services.cards.image.title"),
      desc: t("services.cards.image.desc"),
      tags: t("services.cards.image.tag"),
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
    },
    {
      icon: Video,
      title: t("services.cards.video.title"),
      desc: t("services.cards.video.desc"),
      tags: t("services.cards.video.tag"),
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800"
    },
    {
      icon: BarChart3,
      title: t("services.cards.marketing.title"),
      desc: t("services.cards.marketing.desc"),
      tags: t("services.cards.marketing.tag"),
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
    },
    {
      icon: Share2,
      title: t("services.cards.social.title"),
      desc: t("services.cards.social.desc"),
      tags: t("services.cards.social.tag"),
      image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&q=80&w=800"
    },
    {
      icon: Search,
      title: t("services.cards.seo.title"),
      desc: t("services.cards.seo.desc"),
      tags: t("services.cards.seo.tag"),
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800"
    },
  ];

  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary mb-4">
            {t("services.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold heading-tight mb-4">
            {t("services.title")}
            <br />
            <span className="gradient-text">{t("services.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("services.subtitle")}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative h-[360px] w-full overflow-hidden rounded-2xl border border-white/10"
            >
              {/* Header */}
              <div className="absolute top-4 left-4 z-20 flex flex-col items-start pr-4">
                <p className="text-[10px] uppercase font-bold tracking-wider text-white/70 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md mb-1">{s.tags}</p>
                <h4 className="text-white font-bold text-2xl leading-tight drop-shadow-md">{s.title}</h4>
              </div>

              {/* Background Image */}
              <div className="absolute inset-0 z-0 after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:from-black/60 after:via-transparent after:to-black/30 after:z-10">
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 w-full z-20 bg-black/40 backdrop-blur-xl border-t border-white/10 p-4 transition-all duration-300">
                <div className="flex gap-3 items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center shrink-0">
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-xs text-white/60 truncate">AI Powered</p>
                      <p className="text-xs text-white/90 line-clamp-1 font-medium">{s.desc}</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-semibold bg-white text-black px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors shrink-0">
                    Try Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
