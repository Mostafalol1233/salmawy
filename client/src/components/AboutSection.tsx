import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Globe2 } from "lucide-react";
import { SiFacebook } from "react-icons/si";

interface AboutSectionProps {
  isArabic: boolean;
  whatsappNumber?: string;
}

export function AboutSection({ isArabic, whatsappNumber = "201234567890" }: AboutSectionProps) {
  return (
    <section className="py-16 px-4 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <Card className="p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {isArabic ? "حول سلاموي" : "About Slamawy Store"}
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-xl text-primary font-semibold">
                {isArabic ? "مضمون من الجميع" : "Guaranteed by everyone"}
              </p>
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <Globe2 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isArabic
                ? "نحن متجر موثوق لبطاقات الألعاب مع تسليم سريع وخدمة عملاء ممتازة. انضم إلى آلاف العملاء الراضين."
                : "We are a trusted gaming card store with fast delivery and excellent customer service. Join thousands of satisfied customers."}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="default"
              size="lg"
              className="gap-2 bg-[#25D366] text-white border border-[#20ba5a]"
              onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
              data-testid="button-contact-whatsapp"
            >
              <MessageCircle className="w-5 h-5" />
              {isArabic ? "واتساب" : "WhatsApp"}
            </Button>
            <Button
              variant="default"
              size="lg"
              className="gap-2 bg-[#1877F2] text-white border border-[#145dbf]"
              onClick={() => window.open("https://facebook.com/", "_blank")}
              data-testid="button-contact-facebook"
            >
              <SiFacebook className="w-5 h-5" />
              {isArabic ? "فيسبوك" : "Facebook"}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
