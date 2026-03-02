import PublicLayout from "@/components/layout/PublicLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturedMenu from "@/components/home/FeaturedMenu";
import WhyUs from "@/components/home/WhyUs";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <FeaturedMenu />
      <WhyUs />
      <TestimonialsSection />
      <CTASection />
    </PublicLayout>
  );
}
