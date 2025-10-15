import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import type { GameProduct } from "@shared/schema";

interface ProductCardProps {
  product: GameProduct;
  isArabic: boolean;
  whatsappNumber?: string;
}

export function ProductCard({ product, isArabic, whatsappNumber = "201234567890" }: ProductCardProps) {
  const [selectedAmount, setSelectedAmount] = useState(product.amounts[0]);

  const handleWhatsAppClick = () => {
    const message = isArabic
      ? `مرحباً، أريد شراء ${product.name} - ${selectedAmount.label}`
      : `Hi, I want to buy ${product.name} - ${selectedAmount.label}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Card className="overflow-visible hover-elevate transition-all duration-300">
      <div className="aspect-square bg-card-foreground/5 flex items-center justify-center p-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground" data-testid={`text-product-${product.id}`}>
          {product.name}
        </h3>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {isArabic ? "اختر الكمية:" : "Select Amount:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {product.amounts.map((amount) => (
              <Badge
                key={amount.value}
                variant={selectedAmount.value === amount.value ? "default" : "secondary"}
                className="cursor-pointer px-3 py-1.5 text-sm hover-elevate active-elevate-2"
                onClick={() => setSelectedAmount(amount)}
                data-testid={`button-amount-${product.id}-${amount.value}`}
              >
                {amount.label}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          className="w-full gap-2 bg-[#25D366] text-white border border-[#20ba5a]"
          onClick={handleWhatsAppClick}
          data-testid={`button-whatsapp-${product.id}`}
        >
          <MessageCircle className="w-4 h-4" />
          {isArabic ? "اشتري عبر واتساب" : "Buy via WhatsApp"}
        </Button>
      </div>
    </Card>
  );
}
