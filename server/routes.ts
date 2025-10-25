import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import {
  insertProductSchema,
  insertProductPriceSchema,
  insertReviewSchema,
  insertAnnouncementSchema,
  insertSocialMediaServiceSchema,
  insertSocialMediaPriceSchema,
  insertAdminSchema,
  insertSiteSettingsSchema,
  insertSocialLinkSchema,
  insertBlogPostSchema,
  insertBlogImageSchema,
} from "@shared/schema";
import { z } from "zod";
import { fromError } from "zod-validation-error";

declare module "express-session" {
  interface SessionData {
    adminId?: number;
    username?: string;
  }
}

const isAdmin = (req: any, res: any, next: any) => {
  if (req.session.adminId) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "slamawy-store-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await storage.getAdminByUsername(username);
      
      if (!admin || admin.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      req.session.adminId = admin.id;
      req.session.username = admin.username;
      
      res.json({ success: true, username: admin.username });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/admin/session", (req, res) => {
    if (req.session.adminId) {
      res.json({ authenticated: true, username: req.session.username });
    } else {
      res.json({ authenticated: false });
    }
  });

  app.post("/api/admin/create", async (req, res) => {
    try {
      const validatedData = insertAdminSchema.parse(req.body);
      const admin = await storage.createAdmin(validatedData);
      res.json({ success: true, id: admin.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create admin" });
    }
  });

  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", isAdmin, async (req, res) => {
    try {
      const { product, prices } = req.body;
      const validatedProduct = insertProductSchema.parse(product);
      const validatedPrices = z.array(z.object({
        value: z.number(),
        label: z.string(),
        price: z.string(),
      })).parse(prices);
      
      const newProduct = await storage.createProduct(validatedProduct, validatedPrices);
      res.json(newProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { product, prices } = req.body;
      
      if (prices && Array.isArray(prices)) {
        const validatedProduct = insertProductSchema.partial().parse(product);
        const validatedPrices = z.array(z.object({
          value: z.number(),
          label: z.string(),
          price: z.string(),
        })).parse(prices);
        
        const updated = await storage.updateProductWithPrices(id, validatedProduct, validatedPrices);
        if (!updated) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.json(updated);
      } else {
        const validatedProduct = insertProductSchema.partial().parse(req.body);
        const updated = await storage.updateProduct(id, validatedProduct);
        if (!updated) {
          return res.status(404).json({ error: "Product not found" });
        }
        res.json(updated);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.get("/api/reviews", async (req, res) => {
    try {
      const approvedParam = req.query.approved;
      let approved: boolean | undefined;
      
      if (approvedParam === "true") {
        approved = true;
      } else if (approvedParam === "false") {
        approved = false;
      }
      
      const reviews = await storage.getReviews(approved);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedReview = insertReviewSchema.parse(req.body);
      const newReview = await storage.createReview(validatedReview);
      res.json(newReview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  app.post("/api/reviews/:id/approve", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const approved = await storage.approveReview(id);
      if (!approved) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.json(approved);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve review" });
    }
  });

  app.delete("/api/reviews/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteReview(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete review" });
    }
  });

  app.get("/api/announcements", async (req, res) => {
    try {
      const activeOnly = req.query.active === "true";
      const announcements = await storage.getAnnouncements(activeOnly);
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  app.post("/api/announcements", isAdmin, async (req, res) => {
    try {
      const validatedAnnouncement = insertAnnouncementSchema.parse(req.body);
      const newAnnouncement = await storage.createAnnouncement(validatedAnnouncement);
      res.json(newAnnouncement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create announcement" });
    }
  });

  app.put("/api/announcements/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedAnnouncement = insertAnnouncementSchema.partial().parse(req.body);
      const updated = await storage.updateAnnouncement(id, validatedAnnouncement);
      if (!updated) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update announcement" });
    }
  });

  app.delete("/api/announcements/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAnnouncement(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  });

  app.get("/api/social-media-services", async (_req, res) => {
    try {
      const services = await storage.getSocialMediaServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social media services" });
    }
  });

  app.get("/api/social-media-services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.getSocialMediaService(id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  app.post("/api/social-media-services", isAdmin, async (req, res) => {
    try {
      const { service, prices } = req.body;
      const validatedService = insertSocialMediaServiceSchema.parse(service);
      const validatedPrices = z.array(z.object({
        quantity: z.number(),
        label: z.string(),
        price: z.string(),
      })).parse(prices);
      
      const newService = await storage.createSocialMediaService(validatedService, validatedPrices);
      res.json(newService);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.put("/api/social-media-services/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedService = insertSocialMediaServiceSchema.partial().parse(req.body);
      const updated = await storage.updateSocialMediaService(id, validatedService);
      if (!updated) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/social-media-services/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSocialMediaService(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  // Site Settings Routes
  app.get("/api/site-settings", async (_req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });

  app.get("/api/admin/site-settings", isAdmin, async (_req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });

  app.put("/api/admin/site-settings", isAdmin, async (req, res) => {
    try {
      const validatedSettings = insertSiteSettingsSchema.parse(req.body);
      const updated = await storage.updateSiteSettings(validatedSettings);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to update site settings" });
    }
  });

  // Social Links Routes
  app.get("/api/social-links", async (_req, res) => {
    try {
      const links = await storage.getAllSocialLinks();
      const activeLinks = links.filter(link => link.isActive);
      res.json(activeLinks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social links" });
    }
  });

  app.get("/api/admin/social-links", isAdmin, async (_req, res) => {
    try {
      const links = await storage.getAllSocialLinks();
      res.json(links);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social links" });
    }
  });

  app.post("/api/admin/social-links", isAdmin, async (req, res) => {
    try {
      const validatedLink = insertSocialLinkSchema.parse(req.body);
      const newLink = await storage.createSocialLink(validatedLink);
      res.status(201).json(newLink);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to create social link" });
    }
  });

  app.put("/api/admin/social-links/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedLink = insertSocialLinkSchema.partial().parse(req.body);
      const updated = await storage.updateSocialLink(id, validatedLink);
      if (!updated) {
        return res.status(404).json({ error: "Social link not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to update social link" });
    }
  });

  app.delete("/api/admin/social-links/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSocialLink(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete social link" });
    }
  });

  // Blog Posts Routes
  app.get("/api/blog-posts", async (_req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getBlogPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      if (!post.isPublished) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.get("/api/admin/blog-posts", isAdmin, async (_req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/admin/blog-posts/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/admin/blog-posts", isAdmin, async (req, res) => {
    try {
      const validatedPost = insertBlogPostSchema.parse(req.body);
      const newPost = await storage.createBlogPost(validatedPost);
      res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog-posts/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedPost = insertBlogPostSchema.partial().parse(req.body);
      const updated = await storage.updateBlogPost(id, validatedPost);
      if (!updated) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog-posts/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlogPost(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  app.post("/api/admin/blog-posts/:id/publish", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const published = await storage.publishBlogPost(id);
      if (!published) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(published);
    } catch (error) {
      res.status(500).json({ error: "Failed to publish blog post" });
    }
  });

  // Blog Images Routes
  app.post("/api/admin/blog-images", isAdmin, async (req, res) => {
    try {
      const validatedImage = insertBlogImageSchema.parse(req.body);
      const newImage = await storage.createBlogImage(validatedImage);
      res.status(201).json(newImage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).json({ error: "Failed to create blog image" });
    }
  });

  app.delete("/api/admin/blog-images/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlogImage(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog image" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
