import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Trash2, Star } from "lucide-react";
import type { SelectReview } from "@shared/schema";

export default function Reviews() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const { data: reviews, isLoading } = useQuery<SelectReview[]>({
    queryKey: ["/api/reviews"],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/reviews/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "Review approved successfully" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to approve review", description: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "Review deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to delete review", description: error.message });
    },
  });

  const filteredReviews = reviews?.filter(review => {
    if (filter === "all") return true;
    if (filter === "pending") return !review.isApproved;
    if (filter === "approved") return review.isApproved;
    return true;
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Review Moderation</h1>
        <p className="text-muted-foreground mt-1">Manage customer reviews and testimonials</p>
      </div>

      <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all-reviews">
            All Reviews
          </TabsTrigger>
          <TabsTrigger value="pending" data-testid="tab-pending-reviews">
            Pending ({reviews?.filter(r => !r.isApproved).length || 0})
          </TabsTrigger>
          <TabsTrigger value="approved" data-testid="tab-approved-reviews">
            Approved ({reviews?.filter(r => r.isApproved).length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews && filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <TableRow key={review.id} data-testid={`row-review-${review.id}`}>
                      <TableCell className="font-medium">{review.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {review.email || <span className="italic">Not provided</span>}
                      </TableCell>
                      <TableCell>{review.game}</TableCell>
                      <TableCell>{renderStars(review.rating)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {review.comment || <span className="text-muted-foreground italic">No comment</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={review.isApproved ? "default" : "secondary"}>
                          {review.isApproved ? "Approved" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {!review.isApproved && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => approveMutation.mutate(review.id)}
                              disabled={approveMutation.isPending}
                              data-testid={`button-approve-${review.id}`}
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteMutation.mutate(review.id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${review.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No reviews found in this category.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
