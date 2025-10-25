import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Home } from "lucide-react";
import { format } from "date-fns";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { SelectBlogPost } from "@shared/schema";

export default function BlogIndex() {
  const { data: posts, isLoading } = useQuery<SelectBlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <a className="flex items-center gap-2 text-foreground hover:text-primary transition-colors" data-testid="link-home">
                <Home className="w-5 h-5" />
                <span className="font-semibold">Slamawy Store</span>
              </a>
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-page-title">
            Blog & News
          </h1>
          <p className="text-xl text-muted-foreground">
            Stay updated with the latest news, events, and announcements
          </p>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground" data-testid="text-no-posts">
              No blog posts available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col hover-elevate transition-all duration-300" data-testid={`card-post-${post.id}`}>
                {post.featuredImage && (
                  <div className="aspect-video bg-card-foreground/5 overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      data-testid={`img-featured-${post.id}`}
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.publishedAt?.toString()} data-testid={`text-date-${post.id}`}>
                      {post.publishedAt ? format(new Date(post.publishedAt), "MMMM dd, yyyy") : "Draft"}
                    </time>
                  </div>
                  <h2 className="text-xl font-bold text-foreground line-clamp-2" data-testid={`text-title-${post.id}`}>
                    {post.title}
                  </h2>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`text-excerpt-${post.id}`}>
                      {post.excerpt}
                    </p>
                  )}
                  <Link href={`/blog/${post.slug}`}>
                    <a className="mt-auto">
                      <Button variant="outline" className="w-full gap-2" data-testid={`button-read-${post.id}`}>
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
