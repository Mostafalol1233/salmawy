import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import heroImage from "@assets/generated_images/Anime_character_with_blue_glow_8149ad3f.png";

interface HeroSectionProps {
  onShopClick: () => void;
  onLanguageToggle: () => void;
  isArabic: boolean;
}

export function HeroSection({ onShopClick, onLanguageToggle, isArabic }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 flex items-center justify-end">
        <img 
          src={heroImage} 
          alt="Gaming Character" 
          className="h-full w-auto object-contain max-w-[60%] md:max-w-[50%]"
        />
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 p-6 md:p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h2 className="text-white font-bold text-base md:text-lg">SLAMAWY STORE</h2>
        </div>
        
        <Button
          variant="ghost"
          size="default"
          onClick={onLanguageToggle}
          className="gap-2 text-white"
          data-testid="button-language-toggle"
        >
          <Globe className="w-5 h-5" />
          <span>{isArabic ? "Translate to English" : "Translate to Arabic"}</span>
        </Button>
      </div>

      <div className="relative z-10 px-6 md:px-12 lg:px-16 max-w-7xl w-full">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {isArabic ? "مرحباً بك في" : "Welcome to"}<br />
            {isArabic ? "متجر سلاموي 🔥" : "Slamawy Store 🔥"}
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 font-normal">
            {isArabic ? "موثوق وتسليم سريع" : "Trusted & Fast Delivery"}
          </p>
          <Button
            size="lg"
            variant="default"
            onClick={onShopClick}
            data-testid="button-shop-now"
          >
            {isArabic ? "تسوق الآن" : "Shop Now"}
          </Button>
        </div>
      </div>
    </section>
  );
}
