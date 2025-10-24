import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Review {
  id: string | number;
  name: string;
  email?: string;
  game: string;
  rating: number;
  comment?: string;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="p-4 flex flex-col h-full bg-card dark:bg-card border-card-border dark:border-card-border">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-primary dark:text-primary">
            {review.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground dark:text-foreground text-sm truncate" data-testid={`text-reviewer-${review.id}`}>
            {review.name}
          </h4>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground truncate" data-testid={`text-game-${review.id}`}>
            {review.game}
          </p>
        </div>
      </div>
      
      <div className="flex gap-0.5 mb-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600"
            }`}
            data-testid={`star-${review.id}-${index + 1}`}
          />
        ))}
      </div>
      
      {review.comment && (
        <p className="text-sm text-muted-foreground dark:text-muted-foreground line-clamp-3" data-testid={`text-comment-${review.id}`}>
          {review.comment}
        </p>
      )}
    </Card>
  );
}
