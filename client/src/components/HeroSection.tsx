import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useEffect, useRef } from "react";
import heroVideo from "@assets/34560257-1b3a-407c-82b8-cf95bb8349e1_1760562412486.mp4";
import galaxyBg from "@assets/generated_images/Galaxy_stars_space_background_7ba46401.png";

interface HeroSectionProps {
  onShopClick: () => void;
  onLanguageToggle: () => void;
  isArabic: boolean;
}

export function HeroSection({ onShopClick, onLanguageToggle, isArabic }: HeroSectionProps) {
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const setupReversePlayback = (video: HTMLVideoElement) => {
      let playingForward = true;
      let animationFrameId: number | null = null;
      let lastTime = Date.now();

      const reversePlayback = () => {
        const now = Date.now();
        const deltaTime = (now - lastTime) / 1000;
        lastTime = now;

        if (!playingForward) {
          video.currentTime = Math.max(0, video.currentTime - deltaTime);
          
          if (video.currentTime <= 0.1) {
            playingForward = true;
            animationFrameId = null;
            video.play().catch(() => {});
          } else {
            animationFrameId = requestAnimationFrame(reversePlayback);
          }
        }
      };

      const handleTimeUpdate = () => {
        if (playingForward && video.currentTime >= video.duration - 0.15) {
          playingForward = false;
          video.pause();
          lastTime = Date.now();
          animationFrameId = requestAnimationFrame(reversePlayback);
        }
      };

      const handleEnded = (e: Event) => {
        e.preventDefault();
        if (playingForward) {
          playingForward = false;
          video.pause();
          lastTime = Date.now();
          animationFrameId = requestAnimationFrame(reversePlayback);
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      };
    };

    const desktopCleanup = desktopVideoRef.current ? setupReversePlayback(desktopVideoRef.current) : undefined;
    const mobileCleanup = mobileVideoRef.current ? setupReversePlayback(mobileVideoRef.current) : undefined;

    return () => {
      desktopCleanup?.();
      mobileCleanup?.();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col bg-black">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${galaxyBg})` }}
      />
      
      <div className="hidden md:flex absolute inset-0 z-0 items-center justify-end">
        <video 
          ref={desktopVideoRef}
          src={heroVideo}
          autoPlay
          muted
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          className="h-full w-auto object-contain max-w-[50%]"
        />
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

      <div className="relative z-10 px-6 md:px-12 lg:px-16 max-w-7xl w-full flex-1 flex flex-col justify-center md:justify-center">
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

        <div className="md:hidden mt-12 flex justify-center">
          <video 
            ref={mobileVideoRef}
            src={heroVideo}
            autoPlay
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
