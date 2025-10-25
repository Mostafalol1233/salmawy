import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HeroSection } from "@/components/HeroSection";
import { ProductCard } from "@/components/ProductCard";
import { RequestSection } from "@/components/RequestSection";
import { ReviewCard } from "@/components/ReviewCard";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import { LocationSection } from "@/components/LocationSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Star, AlertCircle, CheckCircle, Info, X } from "lucide-react";
import type { ProductWithPrices, SelectReview, SelectAnnouncement } from "@shared/schema";

interface GameProduct {
  id: string;
  name: string;
  currency: string;
  image: string;
  category?: string;
  amounts: { value: number; label: string; price?: string }[];
}

interface Review {
  id: string;
  name: string;
  email?: string;
  game: string;
  rating: number;
  comment?: string;
}

import crossfireImg from "@assets/generated_images/CrossFire_gaming_card_product_e40032b2.png";
import firefireImg from "@assets/generated_images/Free_Fire_gaming_card_product_429336cd.png";
import pubgImg from "@assets/generated_images/PUBG_Mobile_gaming_card_e9de6a22.png";
import valorantImg from "@assets/generated_images/Valorant_gaming_card_product_4f1d3dd6.png";
import genshinImg from "@assets/generated_images/Genshin_Impact_gaming_card_c2a046c1.png";
import lolImg from "@assets/generated_images/League_of_Legends_gaming_card_a7805b82.png";
import fortniteImg from "@assets/generated_images/Fortnite_gaming_card_product_e08a005e.png";
import robloxImg from "@assets/generated_images/Roblox_gaming_card.png";
import codImg from "@assets/generated_images/Call_of_Duty_gaming_card.png";
import gamingCategoryIcon from "@assets/generated_images/Gaming_category_icon_f03cb930.png";
import subscriptionsCategoryIcon from "@assets/generated_images/Subscriptions_category_icon_45229c5f.png";
import socialMediaCategoryIcon from "@assets/generated_images/Social_media_category_icon_510bf088.png";

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
  { id: "1", name: "Ahmed", rating: 5, game: "Free Fire", comment: "Fast delivery and great service!" },
  { id: "2", name: "Mohammed", rating: 5, game: "PUBG Mobile", comment: "Reliable and trusted!" },
  { id: "3", name: "Sarah", rating: 5, game: "Valorant", comment: "Best prices, highly recommend!" },
  { id: "4", name: "Fatima", rating: 5, game: "CrossFire", comment: "Quick and professional!" },
  { id: "5", name: "Ali", rating: 5, game: "Fortnite", comment: "Amazing service!" },
  { id: "6", name: "Omar", rating: 5, game: "League of Legends", comment: "Very satisfied!" },
];

const reviewFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  game: z.string().min(1, "Game name is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

type ReviewForm = z.infer<typeof reviewFormSchema>;

export default function Home() {
  const [isArabic, setIsArabic] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const productsRef = useRef<HTMLElement>(null);
  const whatsappNumber = "2001027308353";
  const { toast } = useToast();

  const { data: productsData, isLoading: productsLoading } = useQuery<GameProduct[]>({
    queryKey: ["/api/products"],
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
    queryFn: async () => {
      const res = await fetch("/api/reviews?approved=true");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });

  const { data: announcements } = useQuery<SelectAnnouncement[]>({
    queryKey: ["/api/announcements"],
    queryFn: async () => {
      const res = await fetch("/api/announcements?active=true");
      if (!res.ok) throw new Error("Failed to fetch announcements");
      return res.json();
    },
  });

  const reviewForm = useForm<ReviewForm>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      name: "",
      email: "",
      game: "",
      rating: 5,
      comment: "",
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data: ReviewForm) => {
      await apiRequest("POST", "/api/reviews", { ...data, isApproved: false });
    },
    onSuccess: () => {
      toast({
        title: "Review submitted successfully!",
        description: "Thank you for your feedback. Your review will be published after approval.",
      });
      reviewForm.reset();
      setSelectedRating(5);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to submit review",
        description: error.message,
      });
    },
  });

  const displayProducts = productsData && productsData.length > 0 ? productsData : products;
  const displayReviews = reviewsData && reviewsData.length > 0 ? reviewsData : reviews;

  const groupedProducts = displayProducts.reduce((acc, product) => {
    const category = product.category || 'games';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof displayProducts>);

  const categoryInfo = {
    games: {
      title: isArabic ? 'الألعاب' : 'Gaming Cards',
      icon: gamingCategoryIcon,
      description: isArabic ? 'بطاقات شحن للألعاب المفضلة لديك' : 'Top-up cards for your favorite games'
    },
    subscriptions: {
      title: isArabic ? 'الاشتراكات' : 'Subscriptions',
      icon: subscriptionsCategoryIcon,
      description: isArabic ? 'اشتراكات Discord Nitro وغيرها' : 'Discord Nitro and other premium subscriptions'
    },
    social_media: {
      title: isArabic ? 'وسائل التواصل الاجتماعي' : 'Social Media Services',
      icon: socialMediaCategoryIcon,
      description: isArabic ? 'خدمات لزيادة المتابعين والإعجابات' : 'Boost your followers and engagement'
    }
  };

  const handleShopClick = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onSubmitReview = (data: ReviewForm) => {
    submitReviewMutation.mutate(data);
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "warning":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAnnouncementVariant = (type: string): "default" | "destructive" => {
    return type === "warning" ? "destructive" : "default";
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        onShopClick={handleShopClick}
        onLanguageToggle={() => setIsArabic(!isArabic)}
        isArabic={isArabic}
      />

      {announcements && announcements.length > 0 && (
        <section className="py-4 px-4 bg-background/50">
          <div className="max-w-7xl mx-auto space-y-3">
            {announcements.map((announcement) => (
              <Alert
                key={announcement.id}
                variant={getAnnouncementVariant(announcement.type)}
                className="relative"
                data-testid={`announcement-${announcement.id}`}
              >
                <div className="flex items-start gap-3">
                  {getAnnouncementIcon(announcement.type)}
                  <div className="flex-1">
                    <AlertTitle>{announcement.title}</AlertTitle>
                    <AlertDescription className="mt-1">{announcement.message}</AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </section>
      )}

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
            <div className="space-y-12">
              {Object.entries(groupedProducts).map(([category, categoryProducts]) => {
                if (categoryProducts.length === 0) return null;
                
                const info = categoryInfo[category as keyof typeof categoryInfo] || {
                  title: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
                  icon: gamingCategoryIcon,
                  description: isArabic ? 'منتجات أخرى' : 'Other products'
                };
                
                return (
                  <div key={category} className="space-y-6">
                    <div className="flex items-center gap-4 pb-4 border-b border-border">
                      <img src={info.icon} alt={info.title} className="w-12 h-12 object-contain" />
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{info.title}</h3>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} isArabic={isArabic} whatsappNumber={whatsappNumber} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <RequestSection isArabic={isArabic} whatsappNumber={whatsappNumber} />

      <section className="py-16 px-4 bg-background dark:bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground dark:text-foreground">
            {isArabic ? "آراء العملاء" : "Customer Reviews"}
          </h2>
          <p className="text-center text-muted-foreground dark:text-muted-foreground mb-8">
            {isArabic ? "ما يقوله عملاؤنا عنا" : "What our customers say about us"}
          </p>
          {reviewsLoading ? (
            <div className="h-[400px] overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-48 bg-card dark:bg-card rounded-md animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                  {displayReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <AboutSection isArabic={isArabic} whatsappNumber={whatsappNumber} />

      <section className="py-16 px-4 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {isArabic ? "شارك تجربتك" : "Share Your Experience"}
              </CardTitle>
              <p className="text-center text-muted-foreground">
                {isArabic
                  ? "أخبرنا عن تجربتك مع سلاموي ستور"
                  : "Tell us about your experience with Slamawy Store"}
              </p>
            </CardHeader>
            <CardContent>
              <Form {...reviewForm}>
                <form onSubmit={reviewForm.handleSubmit(onSubmitReview)} className="space-y-4">
                  <FormField
                    control={reviewForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isArabic ? "الاسم" : "Name"}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={isArabic ? "أدخل اسمك" : "Enter your name"}
                            data-testid="input-review-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={reviewForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isArabic ? "البريد الإلكتروني (اختياري)" : "Email (Optional)"}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder={isArabic ? "مثال: example@email.com" : "e.g., example@email.com"}
                            data-testid="input-review-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={reviewForm.control}
                    name="game"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isArabic ? "اسم اللعبة" : "Game Name"}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-review-game">
                              <SelectValue placeholder={isArabic ? "اختر اللعبة" : "Select a game"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CrossFire">CrossFire</SelectItem>
                            <SelectItem value="Free Fire">Free Fire</SelectItem>
                            <SelectItem value="PUBG Mobile">PUBG Mobile</SelectItem>
                            <SelectItem value="Valorant">Valorant</SelectItem>
                            <SelectItem value="Genshin Impact">Genshin Impact</SelectItem>
                            <SelectItem value="League of Legends">League of Legends</SelectItem>
                            <SelectItem value="Fortnite">Fortnite</SelectItem>
                            <SelectItem value="Roblox">Roblox</SelectItem>
                            <SelectItem value="Call of Duty">Call of Duty</SelectItem>
                            <SelectItem value="Discord Nitro">Discord Nitro</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                            <SelectItem value="Facebook">Facebook</SelectItem>
                            <SelectItem value="TikTok">TikTok</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={reviewForm.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isArabic ? "التقييم" : "Rating"}</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  setSelectedRating(i + 1);
                                  field.onChange(i + 1);
                                }}
                                className="focus:outline-none"
                                data-testid={`button-rating-${i + 1}`}
                              >
                                <Star
                                  className={`w-8 h-8 transition-colors ${
                                    i < selectedRating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300 dark:text-gray-600"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={reviewForm.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isArabic ? "تعليق (اختياري)" : "Comment (Optional)"}</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={isArabic ? "شارك تجربتك..." : "Share your experience..."}
                            rows={4}
                            data-testid="input-review-comment"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitReviewMutation.isPending}
                    data-testid="button-submit-review"
                  >
                    {submitReviewMutation.isPending
                      ? isArabic
                        ? "جاري الإرسال..."
                        : "Submitting..."
                      : isArabic
                      ? "إرسال المراجعة"
                      : "Submit Review"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>

      <LocationSection isArabic={isArabic} />
      <Footer isArabic={isArabic} whatsappNumber={whatsappNumber} />
    </div>
  );
}
