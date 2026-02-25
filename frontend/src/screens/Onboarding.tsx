import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateMe } from "@/lib/api";

const FIELD_OPTIONS = [
  "clothing",
  "watches",
  "perfumes",
  "marketing",
  "content_creation",
] as const;

const COUNTRY_OPTIONS = [
  "US", "GB", "SA", "EG", "AE", "FR", "DE", "ES", "IT", "IN", "BR", "CA", "AU", "JP", "CN", "Other",
];

export default function Onboarding() {
  const { t } = useTranslation();
  const { getToken } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [address, setAddress] = useState("");
  const [tone, setTone] = useState("");
  const [country, setCountry] = useState("");
  const [fieldOfInterest, setFieldOfInterest] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("الاسم مطلوب");
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setError("Session expired. Please sign in again.");
        setLoading(false);
        return;
      }
      await updateMe(token, {
        name: name.trim() || undefined,
        brandName: brandName.trim() || undefined,
        address: address.trim() || undefined,
        tone: tone.trim() || undefined,
        country: country || undefined,
        fieldOfInterest: fieldOfInterest || undefined,
      });
      router.replace("/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold gradient-text">Smartfy AI</span>
        </div>
        <div className="glass rounded-2xl p-6 shadow-xl">
          <h1 className="text-xl font-semibold text-foreground mb-1">
            {t("onboarding.title")}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {t("onboarding.subtitle")}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("onboarding.nameLabel")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("onboarding.namePlaceholder")}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandName">اسم البراند (اختياري)</Label>
              <Input
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="مثال: Smartfy Studio"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">العنوان أو المنطقة (اختياري)</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="القاهرة، السعودية، إلخ"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("onboarding.countryLabel")}</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder={t("onboarding.countryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map((code) => (
                    <SelectItem key={code} value={code}>
                      {code === "Other" ? t("onboarding.countryPlaceholder") : code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("onboarding.fieldLabel")}</Label>
              <Select value={fieldOfInterest} onValueChange={setFieldOfInterest}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder={t("onboarding.fieldPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS.map((key) => (
                    <SelectItem key={key} value={key}>
                      {t(`onboarding.fields.${key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">
                التون المفضل للردود (اختياري)
              </Label>
              <textarea
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                rows={3}
                className="w-full rounded-md border bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                placeholder="مثال: رد عليا بأسلوب ودود بسيط باللهجة العربية اللي تفضلها، وركز على التسويق للسوشيال ميديا…"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full gradient-bg text-primary-foreground"
              disabled={loading}
            >
              {loading ? "..." : t("onboarding.submit")}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
