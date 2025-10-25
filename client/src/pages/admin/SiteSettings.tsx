import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertSiteSettingsSchema, insertSocialLinkSchema, type SelectSiteSettings, type SelectSocialLink } from "@shared/schema";
import { Settings, Plus, Edit, Trash2, ChevronUp, ChevronDown, Save, Loader2 } from "lucide-react";

const siteSettingsFormSchema = insertSiteSettingsSchema.extend({
  whatsappNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid WhatsApp number (e.g., +201000000000)"),
  locationDetails: z.string().optional(),
});

const socialLinkFormSchema = insertSocialLinkSchema.extend({
  url: z.string().url("Please enter a valid URL"),
});

export default function SiteSettings() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SelectSocialLink | null>(null);
  const [deletingLink, setDeletingLink] = useState<SelectSocialLink | null>(null);

  const { data: siteSettings, isLoading: settingsLoading } = useQuery<SelectSiteSettings>({
    queryKey: ["/api/admin/site-settings"],
  });

  const { data: socialLinks = [], isLoading: linksLoading } = useQuery<SelectSocialLink[]>({
    queryKey: ["/api/admin/social-links"],
  });

  const settingsForm = useForm<z.infer<typeof siteSettingsFormSchema>>({
    resolver: zodResolver(siteSettingsFormSchema),
    values: siteSettings ? {
      siteTitle: siteSettings.siteTitle,
      heroTitle: siteSettings.heroTitle,
      heroSubtitle: siteSettings.heroSubtitle,
      whatsappNumber: siteSettings.whatsappNumber,
      location: siteSettings.location,
      locationDetails: siteSettings.locationDetails || "",
    } : {
      siteTitle: "",
      heroTitle: "",
      heroSubtitle: "",
      whatsappNumber: "",
      location: "",
      locationDetails: "",
    },
  });

  const socialLinkForm = useForm<z.infer<typeof socialLinkFormSchema>>({
    resolver: zodResolver(socialLinkFormSchema),
    defaultValues: {
      platform: "",
      url: "",
      icon: "",
      isActive: true,
      order: 0,
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: z.infer<typeof siteSettingsFormSchema>) => {
      return await apiRequest("PUT", "/api/admin/site-settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
      toast({
        title: "Settings updated",
        description: "Site settings have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update site settings.",
      });
    },
  });

  const createLinkMutation = useMutation({
    mutationFn: async (data: z.infer<typeof socialLinkFormSchema>) => {
      return await apiRequest("POST", "/api/admin/social-links", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-links"] });
      setIsAddDialogOpen(false);
      socialLinkForm.reset();
      toast({
        title: "Link added",
        description: "Social link has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to add link",
        description: error.message || "Failed to add social link.",
      });
    },
  });

  const updateLinkMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<z.infer<typeof socialLinkFormSchema>> }) => {
      return await apiRequest("PUT", `/api/admin/social-links/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-links"] });
      setEditingLink(null);
      socialLinkForm.reset();
      toast({
        title: "Link updated",
        description: "Social link has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update social link.",
      });
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/admin/social-links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-links"] });
      setDeletingLink(null);
      toast({
        title: "Link deleted",
        description: "Social link has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message || "Failed to delete social link.",
      });
    },
  });

  const onSettingsSubmit = (data: z.infer<typeof siteSettingsFormSchema>) => {
    updateSettingsMutation.mutate(data);
  };

  const onSocialLinkSubmit = (data: z.infer<typeof socialLinkFormSchema>) => {
    if (editingLink) {
      updateLinkMutation.mutate({ id: editingLink.id, data });
    } else {
      createLinkMutation.mutate(data);
    }
  };

  const handleEditLink = (link: SelectSocialLink) => {
    setEditingLink(link);
    socialLinkForm.reset({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
      isActive: link.isActive,
      order: link.order,
    });
  };

  const handleToggleActive = (link: SelectSocialLink) => {
    updateLinkMutation.mutate({
      id: link.id,
      data: { isActive: !link.isActive },
    });
  };

  const handleReorder = (link: SelectSocialLink, direction: "up" | "down") => {
    const currentIndex = socialLinks.findIndex((l) => l.id === link.id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === socialLinks.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const swapLink = socialLinks[swapIndex];

    updateLinkMutation.mutate({
      id: link.id,
      data: { order: swapLink.order },
    });
    updateLinkMutation.mutate({
      id: swapLink.id,
      data: { order: link.order },
    });
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingLink(null);
    socialLinkForm.reset({
      platform: "",
      url: "",
      icon: "",
      isActive: true,
      order: socialLinks.length,
    });
  };

  if (settingsLoading || linksLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Site Settings
          </h1>
          <p className="text-muted-foreground" data-testid="text-page-description">
            Manage site-wide settings and social links
          </p>
        </div>
      </div>

      {/* Site Information Section */}
      <Card data-testid="card-site-information">
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>Update general site information and contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...settingsForm}>
            <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={settingsForm.control}
                  name="siteTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Slamawy Store"
                          data-testid="input-site-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={settingsForm.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="+201000000000"
                          data-testid="input-whatsapp-number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={settingsForm.control}
                name="heroTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Welcome to Slamawy Store"
                        data-testid="input-hero-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={settingsForm.control}
                name="heroSubtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Subtitle</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Trusted & Fast Delivery"
                        data-testid="input-hero-subtitle"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={settingsForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Egypt"
                          data-testid="input-location"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={settingsForm.control}
                  name="locationDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Details (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Cairo, Egypt"
                          data-testid="input-location-details"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateSettingsMutation.isPending}
                  data-testid="button-save-settings"
                >
                  {updateSettingsMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Social Links Section */}
      <Card data-testid="card-social-links">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Manage your social media links</CardDescription>
            </div>
            <Button
              onClick={() => {
                socialLinkForm.reset({
                  platform: "",
                  url: "",
                  icon: "",
                  isActive: true,
                  order: socialLinks.length,
                });
                setIsAddDialogOpen(true);
              }}
              data-testid="button-add-social-link"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {socialLinks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-no-links">
              No social links added yet. Click "Add Link" to get started.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {socialLinks.map((link, index) => (
                    <TableRow key={link.id} data-testid={`row-social-link-${link.id}`}>
                      <TableCell className="font-medium" data-testid={`text-platform-${link.id}`}>
                        {link.platform}
                      </TableCell>
                      <TableCell data-testid={`text-url-${link.id}`}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate max-w-xs block"
                        >
                          {link.url}
                        </a>
                      </TableCell>
                      <TableCell data-testid={`text-icon-${link.id}`}>{link.icon}</TableCell>
                      <TableCell>
                        <Switch
                          checked={link.isActive}
                          onCheckedChange={() => handleToggleActive(link)}
                          data-testid={`switch-active-${link.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span data-testid={`text-order-${link.id}`}>{link.order}</span>
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0"
                              onClick={() => handleReorder(link, "up")}
                              disabled={index === 0 || updateLinkMutation.isPending}
                              data-testid={`button-move-up-${link.id}`}
                            >
                              <ChevronUp className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0"
                              onClick={() => handleReorder(link, "down")}
                              disabled={index === socialLinks.length - 1 || updateLinkMutation.isPending}
                              data-testid={`button-move-down-${link.id}`}
                            >
                              <ChevronDown className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditLink(link)}
                            data-testid={`button-edit-${link.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeletingLink(link)}
                            data-testid={`button-delete-${link.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Social Link Dialog */}
      <Dialog open={isAddDialogOpen || !!editingLink} onOpenChange={handleCloseDialog}>
        <DialogContent data-testid="dialog-social-link-form">
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Edit Social Link" : "Add Social Link"}
            </DialogTitle>
            <DialogDescription>
              {editingLink
                ? "Update the social link details below."
                : "Add a new social media link to your site."}
            </DialogDescription>
          </DialogHeader>
          <Form {...socialLinkForm}>
            <form onSubmit={socialLinkForm.handleSubmit(onSocialLinkSubmit)} className="space-y-4">
              <FormField
                control={socialLinkForm.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Facebook, Instagram, TikTok, etc."
                        data-testid="input-platform"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={socialLinkForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://facebook.com/yourpage"
                        data-testid="input-url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={socialLinkForm.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="🔗 or emoji/icon name"
                        data-testid="input-icon"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={socialLinkForm.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        data-testid="input-order"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={socialLinkForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Show this link on the website
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-is-active"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createLinkMutation.isPending || updateLinkMutation.isPending}
                  data-testid="button-submit-social-link"
                >
                  {createLinkMutation.isPending || updateLinkMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : editingLink ? (
                    "Update Link"
                  ) : (
                    "Add Link"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingLink} onOpenChange={() => setDeletingLink(null)}>
        <AlertDialogContent data-testid="dialog-delete-confirmation">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the social link for{" "}
              <span className="font-semibold">{deletingLink?.platform}</span>. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingLink && deleteLinkMutation.mutate(deletingLink.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteLinkMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
