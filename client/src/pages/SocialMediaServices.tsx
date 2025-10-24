import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";
import type { SocialMediaServiceWithPrices } from "@shared/schema";

interface ServiceCardProps {
  service: SocialMediaServiceWithPrices;
  isArabic: boolean;
  whatsappNumber: string;
}

function ServiceCard({ service, isArabic, whatsappNumber }: ServiceCardProps) {
  const [selectedPrice, setSelectedPrice] = useState(service.prices[0]);

  const handleWhatsAppClick = () => {
    const message = isArabic
      ? `مرحباً سلاموي، أريد طلب ${service.name} - ${selectedPrice.label}. هل يمكنك إخباري عن السعر؟`
      : `Hello Salamawy, I want to order ${service.name} - ${selectedPrice.label}. Can you tell me about the price?`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Card className="overflow-visible hover-elevate transition-all duration-300">
      <div className="aspect-square bg-card-foreground/5 flex items-center justify-center p-6">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground" data-testid={`text-service-${service.id}`}>
            {service.name}
          </h3>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{service.platform}</Badge>
            <Badge variant="outline">{service.serviceType}</Badge>
          </div>
        </div>
        
        {service.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {service.description}
          </p>
        )}

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {isArabic ? "اختر الباقة:" : "Select Package:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {service.prices.map((price) => (
              <Badge
                key={price.id}
                variant={selectedPrice.id === price.id ? "default" : "secondary"}
                className="cursor-pointer px-3 py-1.5 text-sm hover-elevate active-elevate-2"
                onClick={() => setSelectedPrice(price)}
                data-testid={`button-price-${service.id}-${price.id}`}
              >
                {price.label}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          className="w-full gap-2 bg-[#25D366] text-white border border-[#20ba5a]"
          onClick={handleWhatsAppClick}
          data-testid={`button-whatsapp-${service.id}`}
        >
          <MessageCircle className="w-4 h-4" />
          {isArabic ? "اطلب عبر واتساب" : "Order via WhatsApp"}
        </Button>
      </div>
    </Card>
  );
}

export default function SocialMediaServices() {
  const [isArabic, setIsArabic] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const servicesRef = useRef<HTMLElement>(null);
  const whatsappNumber = "2001027308353";

  const { data: services, isLoading } = useQuery<SocialMediaServiceWithPrices[]>({
    queryKey: ["/api/social-media-services"],
  });

  const activeServices = services?.filter(service => service.isActive) || [];
  
  const platforms = ["all", ...Array.from(new Set(activeServices.map(s => s.platform)))];
  
  const filteredServices = selectedPlatform === "all"
    ? activeServices
    : activeServices.filter(s => s.platform === selectedPlatform);

  const handleShopClick = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        onShopClick={handleShopClick}
        onLanguageToggle={() => setIsArabic(!isArabic)}
        isArabic={isArabic}
      />

      <section ref={servicesRef} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {isArabic ? "خدمات التواصل الاجتماعي" : "Social Media Services"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isArabic
                ? "عزز وجودك على وسائل التواصل الاجتماعي مع خدماتنا الاحترافية"
                : "Boost your social media presence with our professional services"}
            </p>
          </div>

          {platforms.length > 1 && (
            <div className="mb-8 flex justify-center">
              <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="w-full max-w-4xl">
                <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${platforms.length}, 1fr)` }}>
                  {platforms.map((platform) => (
                    <TabsTrigger
                      key={platform}
                      value={platform}
                      data-testid={`tab-platform-${platform}`}
                    >
                      {platform === "all"
                        ? isArabic
                          ? "الكل"
                          : "All"
                        : platform}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-96 bg-card rounded-md animate-pulse" />
              ))}
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isArabic={isArabic}
                  whatsappNumber={whatsappNumber}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                {isArabic
                  ? "لا توجد خدمات متاحة حالياً"
                  : "No services available at the moment"}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer isArabic={isArabic} whatsappNumber={whatsappNumber} />
    </div>
  );
}
