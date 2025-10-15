import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { AnimeCharacters } from "./AnimeCharacters";

interface HeroSectionProps {
  onShopClick: () => void;
  onLanguageToggle: () => void;
  isArabic: boolean;
}

export function HeroSection({ onShopClick, onLanguageToggle, isArabic }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 flex items-center justify-end pr-8">
        <div className="h-full w-auto max-w-[70%] md:max-w-[60%]">
          <AnimeCharacters />
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border">
            <span className="text-primary font-bold text-xl">S</span>
          </div>
          <h2 className="text-white font-bold text-lg">SLAMAWY STORE</h2>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onLanguageToggle}
          className="gap-2 text-white text-sm"
          data-testid="button-language-toggle"
        >
          <Globe className="w-4 h-4" />
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
