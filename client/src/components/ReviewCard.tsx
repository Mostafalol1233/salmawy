import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import type { Review } from "@shared/schema";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <span className="text-xl font-bold text-primary">
          {review.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <h4 className="font-semibold text-foreground mb-2" data-testid={`text-reviewer-${review.id}`}>
        {review.name}
      </h4>
      <div className="flex justify-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < review.rating
                ? "fill-primary text-primary"
                : "fill-muted text-muted"
            }`}
            data-testid={`star-${review.id}-${index + 1}`}
          />
        ))}
      </div>
    </Card>
  );
}
