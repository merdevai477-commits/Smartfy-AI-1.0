"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@clerk/nextjs";
import { useMe } from "@/hooks/useMe";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMe } from "@/lib/api";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { getToken } = useAuth();
  const { user, isLoading, refetch } = useMe();

  const [name, setName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [address, setAddress] = useState("");
  const [tone, setTone] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setBrandName(user.brandName ?? "");
    setAddress(user.address ?? "");
    setTone(user.tone ?? "");
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const token = await getToken();
      if (!token) {
        setMessage("انتهت الجلسة، من فضلك سجّل الدخول مرة أخرى.");
        return;
      }
      await updateMe(token, {
        name: name.trim() || undefined,
        brandName: brandName.trim() || undefined,
        address: address.trim() || undefined,
        tone: tone.trim() || undefined,
      });
      await refetch();
      setMessage("تم تحديث البروفايل بنجاح ✅");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "حدث خطأ أثناء حفظ التغييرات.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full py-10">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">
            {t("onboarding.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            حدّث بياناتك الشخصية علشان Smartfy يفهم البراند والتون بتاعك.
          </p>
        </div>
        <form onSubmit={handleSave} className="space-y-4 glass p-4 rounded-2xl">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اكتب اسمك"
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
            <Label htmlFor="tone">التون المفضل للردود (اختياري)</Label>
            <textarea
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              rows={3}
              className="w-full rounded-md border bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              placeholder="مثال: رد عليا بأسلوب ودود بسيط باللهجة العربية اللي تفضلها…"
            />
          </div>
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
          <Button
            type="submit"
            disabled={saving}
            className="gradient-bg text-primary-foreground"
          >
            {saving ? "جارِ الحفظ..." : "حفظ التغييرات"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}

