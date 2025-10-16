import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import heroVideo from "@assets/clideo_editor_8a556c51557b41029d2f8dc30a022ca9 (online-video-cutter.com)_1760565168452.mp4";
import galaxyBg from "@assets/generated_images/Galaxy_stars_space_background_7ba46401.png";

interface HeroSectionProps {
  onShopClick: () => void;
  onLanguageToggle: () => void;
  isArabic: boolean;
}

export function HeroSection({ onShopClick, onLanguageToggle, isArabic }: HeroSectionProps) {

  return (
    <section className="relative min-h-screen flex flex-col bg-black">
      {/* Galaxy Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ 
          backgroundImage: `url('/galaxy-bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Additional overlay for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black/40" />

      <div className="hidden md:flex absolute inset-0 z-0 items-center justify-end">
        <video 
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          className="h-full w-auto object-contain max-w-[50%]"
        />
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Slamawy Logo" 
            className="w-20 h-20 object-contain"
          />
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

      <div className="relative z-10 px-6 md:px-12 lg:px-16 max-w-7xl w-full flex-1 flex flex-col justify-center md:justify-center">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight flex flex-col">
            <span>{isArabic ? "مرحباً بك في" : "Welcome to"}</span>
            <span className="flex items-center gap-3">
              {isArabic ? "متجر سلاموي" : "Slamawy Store"}
              <svg className="w-10 h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#1877F2"/>
                <path d="M10.5 15L7.5 12L8.91 10.59L10.5 12.17L15.09 7.58L16.5 9L10.5 15Z" fill="white"/>
              </svg>
            </span>
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

        <div className="md:hidden mt-12 flex justify-center">
          <video 
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            tabIndex={-1}
            className="w-full max-w-md object-contain"
          />
        </div>
      </div>
    </section>
  );
}