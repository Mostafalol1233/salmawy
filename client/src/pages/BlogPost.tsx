import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Home } from "lucide-react";
import { format } from "date-fns";
import { ThemeToggle } from "@/components/ThemeToggle";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import type { SelectBlogPost } from "@shared/schema";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug;

  const { data: post, isLoading, error } = useQuery<SelectBlogPost>({
    queryKey: [`/api/blog-posts/${slug}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
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
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blog">
            <a>
              <Button variant="default" className="gap-2" data-testid="button-back-to-blog">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Button>
            </a>
          </Link>
        </div>
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

      <article className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/blog">
          <a className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8" data-testid="link-back">
            <ArrowLeft className="w-4 h-4" />
            Back to all posts
          </a>
        </Link>

        {post.featuredImage && (
          <div className="aspect-video bg-card-foreground/5 rounded-lg overflow-hidden mb-8">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
              data-testid="img-featured"
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-title">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.publishedAt?.toString()} data-testid="text-date">
              {post.publishedAt ? format(new Date(post.publishedAt), "MMMM dd, yyyy") : "Draft"}
            </time>
          </div>
        </header>

        <div 
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-foreground prose-p:text-foreground
            prose-a:text-primary hover:prose-a:text-primary/80
            prose-strong:text-foreground prose-code:text-foreground
            prose-pre:bg-card prose-pre:border prose-pre:border-border
            prose-blockquote:border-primary prose-blockquote:text-foreground
            prose-li:text-foreground"
          data-testid="content-markdown"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <footer className="mt-12 pt-8 border-t border-border">
          <Link href="/blog">
            <a>
              <Button variant="outline" className="gap-2" data-testid="button-back-bottom">
                <ArrowLeft className="w-4 h-4" />
                Back to all posts
              </Button>
            </a>
          </Link>
        </footer>
      </article>
    </div>
  );
}
