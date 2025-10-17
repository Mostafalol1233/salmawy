import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/HeroSection";
import { ProductCard } from "@/components/ProductCard";
import { RequestSection } from "@/components/RequestSection";
import { ReviewCard } from "@/components/ReviewCard";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import { LocationSection } from "@/components/LocationSection";
import type { GameProduct, Review } from "@shared/schema";

import crossfireImg from "@assets/generated_images/CrossFire_gaming_card_product_e40032b2.png";
import firefireImg from "@assets/generated_images/Free_Fire_gaming_card_product_429336cd.png";
import pubgImg from "@assets/generated_images/PUBG_Mobile_gaming_card_e9de6a22.png";
import valorantImg from "@assets/generated_images/Valorant_gaming_card_product_4f1d3dd6.png";
import genshinImg from "@assets/generated_images/Genshin_Impact_gaming_card_c2a046c1.png";
import lolImg from "@assets/generated_images/League_of_Legends_gaming_card_a7805b82.png";
import fortniteImg from "@assets/generated_images/Fortnite_gaming_card_product_e08a005e.png";
import robloxImg from "@assets/generated_images/Hero_section_anime_characters_a928f401.png";
import codImg from "@assets/generated_images/Galaxy_stars_space_background_7ba46401.png";

const products: GameProduct[] = [
  {
    id: "crossfire",
    name: "CrossFire",
    currency: "ZP",
    image: crossfireImg,
    amounts: [
      { value: 5000, label: "5,000 ZP" },
      { value: 10000, label: "10,000 ZP" },
      { value: 20000, label: "20,000 ZP" },
      { value: 50000, label: "50,000 ZP" },
    ],
  },
  {
    id: "freefire",
    name: "Free Fire",
    currency: "Diamonds",
    image: firefireImg,
    amounts: [
      { value: 100, label: "100 Diamonds" },
      { value: 310, label: "310 Diamonds" },
      { value: 520, label: "520 Diamonds" },
      { value: 1060, label: "1,060 Diamonds" },
    ],
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    currency: "UC",
    image: pubgImg,
    amounts: [
      { value: 60, label: "60 UC" },
      { value: 325, label: "325 UC" },
      { value: 660, label: "660 UC" },
      { value: 1800, label: "1,800 UC" },
    ],
  },
  {
    id: "valorant",
    name: "Valorant",
    currency: "VP",
    image: valorantImg,
    amounts: [
      { value: 475, label: "475 VP" },
      { value: 1000, label: "1,000 VP" },
      { value: 2050, label: "2,050 VP" },
      { value: 3650, label: "3,650 VP" },
    ],
  },
  {
    id: "genshin",
    name: "Genshin Impact",
    currency: "Primogems",
    image: genshinImg,
    amounts: [
      { value: 60, label: "60 Primogems" },
      { value: 300, label: "300 Primogems" },
      { value: 980, label: "980 Primogems" },
      { value: 1980, label: "1,980 Primogems" },
    ],
  },
  {
    id: "lol",
    name: "League of Legends",
    currency: "RP",
    image: lolImg,
    amounts: [
      { value: 650, label: "650 RP" },
      { value: 1380, label: "1,380 RP" },
      { value: 2800, label: "2,800 RP" },
      { value: 5000, label: "5,000 RP" },
    ],
  },
  {
    id: "fortnite",
    name: "Fortnite",
    currency: "V-Bucks",
    image: fortniteImg,
    amounts: [
      { value: 1000, label: "1,000 V-Bucks" },
      { value: 2800, label: "2,800 V-Bucks" },
      { value: 5000, label: "5,000 V-Bucks" },
      { value: 13500, label: "13,500 V-Bucks" },
    ],
  },
  {
    id: "roblox",
    name: "Roblox",
    currency: "Robux",
    image: robloxImg,
    amounts: [
      { value: 400, label: "400 Robux" },
      { value: 800, label: "800 Robux" },
      { value: 1700, label: "1,700 Robux" },
      { value: 4500, label: "4,500 Robux" },
    ],
  },
  {
    id: "callofduty",
    name: "Call of Duty",
    currency: "CP",
    image: codImg,
    amounts: [
      { value: 420, label: "420 CP" },
      { value: 1100, label: "1,100 CP" },
      { value: 2400, label: "2,400 CP" },
      { value: 5000, label: "5,000 CP" },
    ],
  },
];

const reviews: Review[] = [
  { id: "1", name: "Ahmed", rating: 5, purchaseAmount: "1,000 Diamonds", gameDate: "Jan 2025" },
  { id: "2", name: "Mohammed", rating: 5, purchaseAmount: "500 UC", gameDate: "Feb 2025" },
  { id: "3", name: "Sarah", rating: 5, purchaseAmount: "2,000 VP", gameDate: "Mar 2025" },
  { id: "4", name: "Fatima", rating: 5, purchaseAmount: "10,000 ZP", gameDate: "Apr 2025" },
  { id: "5", name: "Ali", rating: 5, purchaseAmount: "5,000 V-Bucks", gameDate: "May 2025" },
  { id: "6", name: "Omar", rating: 5, purchaseAmount: "1,000 RP", gameDate: "Jun 2025" },
];

export default function Home() {
  const [isArabic, setIsArabic] = useState(false);
  const productsRef = useRef<HTMLElement>(null);
  const whatsappNumber = "2001027308353";

  const { data: productsData, isLoading: productsLoading } = useQuery<GameProduct[]>({
    queryKey: ["/api/products"],
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const displayProducts = productsData && productsData.length > 0 ? productsData : products;
  const displayReviews = reviewsData && reviewsData.length > 0 ? reviewsData : reviews;

  const handleShopClick = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        onShopClick={handleShopClick}
        onLanguageToggle={() => setIsArabic(!isArabic)}
        isArabic={isArabic}
      />

      <section ref={productsRef} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {isArabic ? "منتجاتنا" : "Our Products"}
          </h2>
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-96 bg-card rounded-md animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} isArabic={isArabic} whatsappNumber={whatsappNumber} />
              ))}
            </div>
          )}
        </div>
      </section>

      <RequestSection isArabic={isArabic} whatsappNumber={whatsappNumber} />

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            {isArabic ? "عملاء موثوقون" : "Trusted Customers"}
          </h2>
          {reviewsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-card rounded-md animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {displayReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>

      <AboutSection isArabic={isArabic} whatsappNumber={whatsappNumber} />
      <LocationSection isArabic={isArabic} />
      <Footer isArabic={isArabic} whatsappNumber={whatsappNumber} />
    </div>
  );
}
