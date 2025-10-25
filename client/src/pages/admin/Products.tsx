import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Edit, Trash2, HelpCircle, Coins } from "lucide-react";
import type { ProductWithPrices } from "@shared/schema";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  currency: z.string().min(1, "Currency is required"),
  image: z.string().url("Must be a valid URL"),
  category: z.string().default("games"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  prices: z.array(z.object({
    value: z.number().min(1, "Value must be greater than 0"),
    label: z.string().min(1, "Label is required"),
    price: z.string().min(1, "Price is required").regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),
  })).min(1, "At least one price tier is required"),
});

type ProductForm = z.infer<typeof productFormSchema>;

export default function Products() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithPrices | null>(null);
  const [tierToDelete, setTierToDelete] = useState<number | null>(null);

  const { data: products, isLoading } = useQuery<ProductWithPrices[]>({
    queryKey: ["/api/products"],
  });

  const form = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      currency: "",
      image: "",
      category: "games",
      description: "",
      isActive: true,
      prices: [{ value: 0, label: "", price: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prices",
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProductForm) => {
      const { prices, ...product } = data;
      await apiRequest("POST", "/api/products", { product, prices });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product created successfully" });
      setIsDialogOpen(false);
      setEditingProduct(null);
      form.reset({
        name: "",
        currency: "",
        image: "",
        category: "games",
        description: "",
        isActive: true,
        prices: [{ value: 0, label: "", price: "" }],
      });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to create product", description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProductForm }) => {
      const { prices, ...product } = data;
      await apiRequest("PUT", `/api/products/${id}`, { product, prices });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product updated successfully" });
      setIsDialogOpen(false);
      setEditingProduct(null);
      form.reset({
        name: "",
        currency: "",
        image: "",
        category: "games",
        description: "",
        isActive: true,
        prices: [{ value: 0, label: "", price: "" }],
      });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to update product", description: error.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to delete product", description: error.message });
    },
  });

  const handleEdit = (product: ProductWithPrices) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      currency: product.currency,
      image: product.image,
      category: product.category,
      description: product.description || "",
      isActive: product.isActive,
      prices: product.prices.map(p => ({
        value: p.value,
        label: p.label,
        price: p.price,
      })),
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    form.reset({
      name: "",
      currency: "",
      image: "",
      category: "games",
      description: "",
      isActive: true,
      prices: [{ value: 0, label: "", price: "" }],
    });
  };

  const handleRemoveTier = (index: number) => {
    if (fields.length === 1) {
      toast({ 
        variant: "destructive", 
        title: "Cannot remove tier", 
        description: "At least one price tier is required" 
      });
      return;
    }
    setTierToDelete(index);
  };

  const confirmRemoveTier = () => {
    if (tierToDelete !== null) {
      remove(tierToDelete);
      setTierToDelete(null);
      toast({ title: "Price tier removed" });
    }
  };

  const onSubmit = (data: ProductForm) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8" data-testid="loading-products">Loading products...</div>;
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
          <p className="text-muted-foreground mt-1">Manage your game products and pricing tiers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-add-product" onClick={handleDialogClose}>
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editingProduct ? "Edit Product" : "Add New Product"}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Configure gaming card products like PUBG UC, Free Fire Diamonds, etc.</p>
                  </TooltipContent>
                </Tooltip>
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Product Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Product Information</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., PUBG Mobile, Free Fire, CrossFire" data-testid="input-product-name" />
                        </FormControl>
                        <FormDescription>
                          The name of the game or service
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency/Points Type</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., UC, Diamonds, ZP" data-testid="input-product-currency" />
                          </FormControl>
                          <FormDescription>
                            The in-game currency name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., games, social" data-testid="input-product-category" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://..." data-testid="input-product-image" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Product description" rows={3} data-testid="input-product-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>Make this product visible to customers</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-product-active" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-6" />

                {/* Price Tiers Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Price Tiers</h3>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Add different amounts/packages for this product. For example:</p>
                          <ul className="list-disc list-inside mt-1 text-xs">
                            <li>1000 UC for $10.00</li>
                            <li>5000 UC for $45.00</li>
                            <li>10000 UC for $85.00</li>
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ value: 0, label: "", price: "" })}
                      data-testid="button-add-price-tier"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Tier
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Configure different card amounts and their prices (e.g., 1000 ZP, 5000 UC, 10000 Diamonds)
                  </p>

                  {/* Price Tiers Table */}
                  <div className="border rounded-lg overflow-hidden" data-testid="price-tiers-table">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[100px]">Value</TableHead>
                          <TableHead>Label</TableHead>
                          <TableHead className="w-[150px]">Price ($)</TableHead>
                          <TableHead className="w-[80px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No price tiers yet. Click "Add Tier" to create one.
                            </TableCell>
                          </TableRow>
                        ) : (
                          fields.map((field, index) => (
                            <TableRow key={field.id} data-testid={`tier-row-${index}`}>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`prices.${index}.value`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          type="number"
                                          placeholder="1000"
                                          onChange={(e) => field.onChange(Number(e.target.value))}
                                          data-testid={`input-price-value-${index}`}
                                          className="h-9"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-xs" />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`prices.${index}.label`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input 
                                          {...field} 
                                          placeholder="e.g., 1000 UC, Basic Pack" 
                                          data-testid={`input-price-label-${index}`}
                                          className="h-9"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-xs" />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`prices.${index}.price`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input 
                                          {...field} 
                                          placeholder="10.00" 
                                          data-testid={`input-price-price-${index}`}
                                          className="h-9"
                                        />
                                      </FormControl>
                                      <FormMessage className="text-xs" />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveTier(index)}
                                      data-testid={`button-remove-price-${index}`}
                                      className="h-8 w-8"
                                    >
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Remove this price tier</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {form.formState.errors.prices?.root && (
                    <p className="text-sm text-destructive">{form.formState.errors.prices.root.message}</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-2 justify-end pt-4 border-t">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDialogClose} 
                    data-testid="button-cancel"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending} 
                    data-testid="button-save-product"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
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
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price Tiers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                  <TableCell>
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.currency}</Badge>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="cursor-help">
                          {product.prices?.length || 0} tier{product.prices?.length !== 1 ? 's' : ''}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          {product.prices?.map((price, idx) => (
                            <div key={idx} className="text-xs">
                              {price.label}: ${price.price}
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(product)}
                        data-testid={`button-edit-${product.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteMutation.mutate(product.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-${product.id}`}
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
                  No products found. Add your first product to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog for Tier Removal */}
      <AlertDialog open={tierToDelete !== null} onOpenChange={(open) => !open && setTierToDelete(null)}>
        <AlertDialogContent data-testid="dialog-confirm-remove-tier">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Price Tier?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this price tier? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-remove-tier">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveTier}
              data-testid="button-confirm-remove-tier"
              className="bg-destructive hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </TooltipProvider>
  );
}
