import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";

interface LocationSectionProps {
  isArabic: boolean;
}

export function LocationSection({ isArabic }: LocationSectionProps) {
  const handleGoogleMapsClick = () => {
    // Open Google Maps with Egypt location
    window.open("https://maps.google.com/?q=Egypt", "_blank");
  };

  return (
    <section className="py-16 px-4 bg-card/20">
      <div className="max-w-7xl mx-auto">
        <Card className="p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <MapPin className="w-12 h-12 text-primary" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            {isArabic ? "موقعنا" : "Our Location"}
          </h2>
          
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {isArabic
              ? "نحن نخدم جميع أنحاء مصر مع تسليم سريع وآمن لجميع بطاقات الألعاب."
              : "We serve all of Egypt with fast and secure delivery for all gaming cards."}
          </p>
          
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={handleGoogleMapsClick}
            data-testid="button-google-maps"
          >
            <MapPin className="w-4 h-4" />
            {isArabic ? "عرض على خرائط جوجل" : "View on Google Maps"}
            <ExternalLink className="w-4 h-4" />
          </Button>
        </Card>
      </div>
    </section>
  );
}
