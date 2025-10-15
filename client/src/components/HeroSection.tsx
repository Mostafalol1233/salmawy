import { Button } from "@/components/ui/button";
import { Globe, Flame } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_section_anime_characters_a928f401.png";

interface HeroSectionProps {
  onShopClick: () => void;
  onLanguageToggle: () => void;
  isArabic: boolean;
}

export function HeroSection({ onShopClick, onLanguageToggle, isArabic }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-10" />
        <img 
          src={heroImage} 
          alt="Gaming Characters" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 hero-glow" />
      </div>

      <Button
        variant="outline"
        size="default"
        onClick={onLanguageToggle}
        className="absolute top-6 right-6 z-20 gap-2"
        data-testid="button-language-toggle"
      >
        <Globe className="w-4 h-4" />
        <span>{isArabic ? "English" : "العربية"}</span>
      </Button>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground">
            {isArabic ? "متجر سلاموي" : "Welcome to Slamawy Store"}
          </h1>
          <Flame className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-primary" />
        </div>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium">
          {isArabic ? "موثوق وتسليم سريع" : "Trusted & Fast Delivery"}
        </p>
        <Button
          size="lg"
          variant="default"
          onClick={onShopClick}
          className="text-lg px-8 py-6 min-h-14"
          data-testid="button-shop-now"
        >
          {isArabic ? "تسوق الآن" : "Shop Now"}
        </Button>
      </div>
    </section>
  );
}
