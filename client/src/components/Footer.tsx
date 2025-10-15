import { MessageCircle } from "lucide-react";
import { SiFacebook } from "react-icons/si";

interface FooterProps {
  isArabic: boolean;
  whatsappNumber?: string;
}

export function Footer({ isArabic, whatsappNumber = "201234567890" }: FooterProps) {
  return (
    <footer className="bg-card border-t border-card-border py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {isArabic ? "سلاموي ستور" : "Slamawy Store"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isArabic
                ? "بطاقات ألعاب موثوقة وتسليم سريع"
                : "Trusted gaming cards with fast delivery"}
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {isArabic ? "تواصل معنا" : "Contact Us"}
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
                className="p-2 rounded-md bg-[#25D366]/10 text-[#25D366] hover-elevate active-elevate-2 transition-colors"
                data-testid="footer-whatsapp-link"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-6 h-6" />
              </button>
              <button
                onClick={() => window.open("https://facebook.com/", "_blank")}
                className="p-2 rounded-md bg-[#1877F2]/10 text-[#1877F2] hover-elevate active-elevate-2 transition-colors"
                data-testid="footer-facebook-link"
                aria-label="Facebook"
              >
                <SiFacebook className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {isArabic ? "ساعات العمل" : "Business Hours"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isArabic ? "متاح على مدار الساعة" : "Available 24/7"}
            </p>
          </div>
        </div>

        <div className="border-t border-card-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Slamawy Store. {isArabic ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
