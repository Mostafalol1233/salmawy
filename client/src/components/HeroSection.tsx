import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import heroImage from "@assets/IMG-20251015-WA0395_1760557850015.jpg";

interface HeroSectionProps {
  onShopClick: () => void;
  onLanguageToggle: () => void;
  isArabic: boolean;
}

export function HeroSection({ onShopClick, onLanguageToggle, isArabic }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black dark:bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10" />
        <img 
          src={heroImage} 
          alt="Gaming Characters" 
          className="absolute right-0 top-0 h-full w-auto md:w-1/2 object-cover object-left"
        />
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg md:text-xl">S</span>
          </div>
          <h2 className="text-white font-bold text-sm md:text-lg lg:text-xl">SLAMAWY STORE</h2>
        </div>
        
        <Button
          variant="outline"
          size="default"
          onClick={onLanguageToggle}
          className="gap-2 bg-white/10 text-white border-white/20 backdrop-blur-sm hover:bg-white/20"
          data-testid="button-language-toggle"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{isArabic ? "Translate to English" : "Translate to Arabic"}</span>
          <span className="sm:hidden">{isArabic ? "EN" : "AR"}</span>
        </Button>
      </div>

      <div className="relative z-10 px-4 md:px-12 lg:px-20 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-4 md:mb-6">
            {isArabic ? "مرحباً بك في متجر سلاموي 🔥" : "Welcome to Slamawy Store 🔥"}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-8 font-medium">
            {isArabic ? "موثوق وتسليم سريع" : "Trusted & Fast Delivery"}
          </p>
          <Button
            size="lg"
            variant="default"
            onClick={onShopClick}
            className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 min-h-12 md:min-h-14"
            data-testid="button-shop-now"
          >
            {isArabic ? "تسوق الآن" : "Shop Now"}
          </Button>
        </div>
      </div>
    </section>
  );
}
