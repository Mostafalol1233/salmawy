import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface RequestSectionProps {
  isArabic: boolean;
  whatsappNumber?: string;
}

export function RequestSection({ isArabic, whatsappNumber = "2001027308353" }: RequestSectionProps) {
  const handleWhatsAppClick = () => {
    const message = isArabic
      ? "مرحباً، هل Discord Nitro أو بطاقة أخرى متوفرة الآن؟"
      : "Hi, is Discord Nitro or another card available right now?";
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-card to-accent/20">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            {isArabic ? "لم تجد ما تبحث عنه؟" : "Can't find what you need?"}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {isArabic
              ? "اسأل مباشرة على واتساب إذا كان Discord Nitro أو بطاقات أخرى متوفرة."
              : "Ask directly on WhatsApp if Discord Nitro or other cards are available."}
          </p>
          <Button
            size="lg"
            className="gap-2 bg-[#25D366] text-white border border-[#20ba5a]"
            onClick={handleWhatsAppClick}
            data-testid="button-ask-whatsapp"
          >
            <MessageCircle className="w-5 h-5" />
            {isArabic ? "اسأل على واتساب" : "Ask on WhatsApp"}
          </Button>
        </Card>
      </div>
    </section>
  );
}
