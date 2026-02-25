import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import LogosSection from "@/components/landing/LogosSection";
import ServicesSection from "@/components/landing/ServicesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  // معالجة الروابط المباشرة (hash links) عند تحميل الصفحة
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // انتظر حتى يتم تحميل الصفحة بالكامل
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          const rect = el.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          // استخدام offset 56px لضمان ظهور القسم بشكل كامل
          const targetY = rect.top + scrollTop - 56;
          
          window.scrollTo({
            top: Math.max(0, targetY),
            behavior: "smooth"
          });
        }
      }, 100);
    }
  }, []);

  return (
  <div className="min-h-screen bg-background noise">
    <Navbar />
    <main className="relative z-10">
      <HeroSection />
      <LogosSection />
      <ServicesSection />
      <HowItWorks />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </main>
    <Footer />
  </div>
);
};

export default Index;
