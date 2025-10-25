import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, FileText, Calendar, Bold, Italic, Heading, List, Link as LinkIcon, Eye, Upload, Image as ImageIcon, X } from "lucide-react";
import type { SelectBlogPost } from "@shared/schema";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const blogPostFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional().refine((val) => {
    if (!val) return true;
    return val.startsWith('http') || val.startsWith('data:image');
  }, "Must be a valid URL or image data"),
});

type BlogPostForm = z.infer<typeof blogPostFormSchema>;

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState<string>("write");

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, label: "Bold", before: "**", after: "**" },
    { icon: Italic, label: "Italic", before: "*", after: "*" },
    { icon: Heading, label: "Heading", before: "# ", after: "" },
    { icon: List, label: "List", before: "- ", after: "" },
    { icon: LinkIcon, label: "Link", before: "[", after: "](url)" },
  ];

  return (
    <div className="space-y-2">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="write" className="gap-2" data-testid="tab-write">
              <Edit className="w-4 h-4" />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2" data-testid="tab-preview">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "write" && (
            <div className="flex gap-1">
              {formatButtons.map(({ icon: Icon, label, before, after }) => (
                <Button
                  key={label}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertMarkdown(before, after)}
                  title={label}
                  data-testid={`button-format-${label.toLowerCase()}`}
                  className="h-8 w-8 p-0"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="write" className="mt-0">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Write your content in Markdown..."}
            rows={12}
            className="font-mono text-sm resize-none"
            data-testid="input-post-content"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Supports Markdown formatting. Use the toolbar buttons to insert formatting syntax.
          </p>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <Card className="p-4 min-h-[300px] prose prose-sm dark:prose-invert max-w-none">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} data-testid="markdown-preview">
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">Nothing to preview yet. Write some content first.</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string>(value || "");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState<string>(value && value.startsWith('http') ? value : "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image"
      });
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image must be less than 2MB"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      onChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput) {
      setImagePreview(urlInput);
      onChange(urlInput);
    }
  };

  const handleClear = () => {
    setImagePreview("");
    setUrlInput("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={uploadMode === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("file")}
          data-testid="button-upload-mode-file"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
        <Button
          type="button"
          variant={uploadMode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("url")}
          data-testid="button-upload-mode-url"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Use URL
        </Button>
      </div>

      {uploadMode === "file" ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="flex-1"
              data-testid="input-image-file"
            />
            {imagePreview && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleClear}
                data-testid="button-clear-image"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Accepted formats: JPG, PNG, WebP • Maximum size: 2MB
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              data-testid="input-image-url"
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              size="sm"
              data-testid="button-submit-url"
            >
              Set
            </Button>
            {imagePreview && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleClear}
                data-testid="button-clear-image"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Paste the URL of an image from the web
          </p>
        </div>
      )}

      {imagePreview && (
        <Card className="p-4">
          <p className="text-sm font-medium mb-2">Image Preview:</p>
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-48 rounded-md object-cover w-full"
            data-testid="img-preview"
          />
        </Card>
      )}

      {!imagePreview && (
        <Card className="p-8 border-dashed">
          <div className="flex flex-col items-center justify-center text-center">
            <ImageIcon className="w-12 h-12 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              No image selected
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

export default function Blog() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SelectBlogPost | null>(null);

  const { data: posts, isLoading } = useQuery<SelectBlogPost[]>({
    queryKey: ["/api/admin/blog-posts"],
  });

  const form = useForm<BlogPostForm>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      featuredImage: "",
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (title: string) => {
    form.setValue("title", title);
    if (!editingPost) {
      const slug = generateSlug(title);
      form.setValue("slug", slug);
    }
  };

  const createMutation = useMutation({
    mutationFn: async ({ data, publish }: { data: BlogPostForm; publish: boolean }) => {
      const postData = {
        ...data,
        isPublished: publish,
        publishedAt: publish ? new Date().toISOString() : undefined,
        featuredImage: data.featuredImage || undefined,
        excerpt: data.excerpt || undefined,
      };
      await apiRequest("POST", "/api/admin/blog-posts", postData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      toast({ 
        title: variables.publish ? "Blog post published successfully" : "Blog post saved as draft" 
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to create blog post", description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, publish }: { id: number; data: BlogPostForm; publish?: boolean }) => {
      const postData: any = {
        ...data,
        featuredImage: data.featuredImage || undefined,
        excerpt: data.excerpt || undefined,
      };
      if (publish !== undefined) {
        postData.isPublished = publish;
        if (publish) {
          postData.publishedAt = new Date().toISOString();
        }
      }
      await apiRequest("PUT", `/api/admin/blog-posts/${id}`, postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      toast({ title: "Blog post updated successfully" });
      setIsDialogOpen(false);
      setEditingPost(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to update blog post", description: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/blog-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      toast({ title: "Blog post deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to delete blog post", description: error.message });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/admin/blog-posts/${id}/publish`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      toast({ title: "Blog post published successfully" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to publish blog post", description: error.message });
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PUT", `/api/admin/blog-posts/${id}`, { isPublished: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      toast({ title: "Blog post unpublished successfully" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to unpublish blog post", description: error.message });
    },
  });

  const handleEdit = (post: SelectBlogPost) => {
    setEditingPost(post);
    form.reset({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || "",
      featuredImage: post.featuredImage || "",
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingPost(null);
    form.reset();
  };

  const onSubmit = (data: BlogPostForm, publish: boolean = false) => {
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data, publish });
    } else {
      createMutation.mutate({ data, publish });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading blog posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage rich blog content with advanced editor</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-add-post">
              <Plus className="w-4 h-4" />
              Add New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Use the advanced editor below to create rich, formatted blog content
              </p>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter post title" 
                          onChange={(e) => handleTitleChange(e.target.value)}
                          data-testid="input-post-title" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="post-url-slug" data-testid="input-post-slug" />
                      </FormControl>
                      <FormDescription>
                        URL-friendly version of the title (auto-generated, but can be edited)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Brief summary of the post" 
                          rows={3}
                          data-testid="input-post-excerpt" 
                        />
                      </FormControl>
                      <FormDescription>
                        Short description shown in post previews
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Content - Rich Text Editor</FormLabel>
                      <FormControl>
                        <MarkdownEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Write your blog post content here..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Featured Image (Optional)</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 justify-end pt-4 border-t">
                  <Button type="button" variant="outline" onClick={handleDialogClose} data-testid="button-cancel">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="outline"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-draft"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : "Save as Draft"}
                  </Button>
                  <Button 
                    type="button"
                    onClick={form.handleSubmit((data) => onSubmit(data, true))}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-publish"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? "Publishing..." : editingPost ? "Save & Publish" : "Publish"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Excerpt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id} data-testid={`row-post-${post.id}`}>
                  <TableCell className="font-medium max-w-xs">
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <span className="line-clamp-2" data-testid={`text-post-title-${post.id}`}>
                        {post.title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <span className="text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt || "No excerpt"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={post.isPublished ? "default" : "secondary"}
                      data-testid={`badge-status-${post.id}`}
                    >
                      {post.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {post.publishedAt ? (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span data-testid={`text-published-date-${post.id}`}>
                          {format(new Date(post.publishedAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not published</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {post.isPublished ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => unpublishMutation.mutate(post.id)}
                          disabled={unpublishMutation.isPending}
                          data-testid={`button-unpublish-${post.id}`}
                        >
                          Unpublish
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => publishMutation.mutate(post.id)}
                          disabled={publishMutation.isPending}
                          data-testid={`button-publish-toggle-${post.id}`}
                        >
                          Publish
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(post)}
                        data-testid={`button-edit-${post.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            data-testid={`button-delete-${post.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{post.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-testid={`button-cancel-delete-${post.id}`}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(post.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              data-testid={`button-confirm-delete-${post.id}`}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2" data-testid="empty-state">
                    <FileText className="w-12 h-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground font-medium">No blog posts found</p>
                    <p className="text-sm text-muted-foreground">Create your first blog post to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
