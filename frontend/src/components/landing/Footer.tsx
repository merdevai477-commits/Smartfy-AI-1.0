import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  const cols = [
    {
      title: t("footer.columns.product"),
      links: [t("footer.links.features"), t("footer.links.pricing"), t("footer.links.api"), t("footer.links.integrations")]
    },
    {
      title: t("footer.columns.company"),
      links: [t("footer.links.about"), t("footer.links.blog"), t("footer.links.careers"), t("footer.links.contact")]
    },
    {
      title: t("footer.columns.legal"),
      links: [t("footer.links.privacy"), t("footer.links.terms"), t("footer.links.security")]
    },
  ];

  return (
    <footer className="border-t border-border/30 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold gradient-text">Smartfy AI</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {t("footer.description")}
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2025 Smartfy AI. {t("footer.rights")}</p>
          <p className="text-xs text-muted-foreground">Mr.dev ✨</p>
        </div>
      </div>
    </footer>
  );
}
