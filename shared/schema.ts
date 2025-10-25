import { pgTable, text, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  currency: text("currency").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull().default("games"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productPrices = pgTable("product_prices", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  value: integer("value").notNull(),
  label: text("label").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email"),
  game: text("game").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  isApproved: boolean("is_approved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const socialMediaServices = pgTable("social_media_services", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  platform: text("platform").notNull(),
  serviceType: text("service_type").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const socialMediaPrices = pgTable("social_media_prices", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  serviceId: integer("service_id").notNull().references(() => socialMediaServices.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  label: text("label").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const admins = pgTable("admins", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  siteTitle: text("site_title").notNull().default("Slamawy Store"),
  heroTitle: text("hero_title").notNull().default("Welcome to Slamawy Store"),
  heroSubtitle: text("hero_subtitle").notNull().default("Trusted & Fast Delivery"),
  whatsappNumber: text("whatsapp_number").notNull().default("+201000000000"),
  location: text("location").notNull().default("Egypt"),
  locationDetails: text("location_details"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const socialLinks = pgTable("social_links", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  featuredImage: text("featured_image"),
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const blogImages = pgTable("blog_images", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  postId: integer("post_id").references(() => blogPosts.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt"),
  caption: text("caption"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProductSchema = z.object({
  name: z.string(),
  currency: z.string(),
  image: z.string(),
  category: z.string().default("games"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const insertProductPriceSchema = z.object({
  productId: z.number(),
  value: z.number(),
  label: z.string(),
  price: z.string(),
});

export const insertReviewSchema = z.object({
  name: z.string(),
  email: z.string().email().optional().or(z.literal("")),
  game: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  isApproved: z.boolean().default(false),
});

export const insertAnnouncementSchema = z.object({
  title: z.string(),
  message: z.string(),
  type: z.string().default("info"),
  isActive: z.boolean().default(true),
});

export const insertSocialMediaServiceSchema = z.object({
  platform: z.string(),
  serviceType: z.string(),
  name: z.string(),
  description: z.string().optional(),
  image: z.string(),
  isActive: z.boolean().default(true),
});

export const insertSocialMediaPriceSchema = z.object({
  serviceId: z.number(),
  quantity: z.number(),
  label: z.string(),
  price: z.string(),
});

export const insertAdminSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const insertSiteSettingsSchema = z.object({
  siteTitle: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  whatsappNumber: z.string(),
  location: z.string(),
  locationDetails: z.string().optional(),
});

export const insertSocialLinkSchema = z.object({
  platform: z.string(),
  url: z.string().url(),
  icon: z.string(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

export const insertBlogPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().optional(),
});

export const insertBlogImageSchema = z.object({
  postId: z.number().optional(),
  url: z.string(),
  alt: z.string().optional(),
  caption: z.string().optional(),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertProductPrice = z.infer<typeof insertProductPriceSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type InsertSocialMediaService = z.infer<typeof insertSocialMediaServiceSchema>;
export type InsertSocialMediaPrice = z.infer<typeof insertSocialMediaPriceSchema>;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type InsertSocialLink = z.infer<typeof insertSocialLinkSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertBlogImage = z.infer<typeof insertBlogImageSchema>;

export type SelectProduct = typeof products.$inferSelect;
export type SelectProductPrice = typeof productPrices.$inferSelect;
export type SelectReview = typeof reviews.$inferSelect;
export type SelectAnnouncement = typeof announcements.$inferSelect;
export type SelectSocialMediaService = typeof socialMediaServices.$inferSelect;
export type SelectSocialMediaPrice = typeof socialMediaPrices.$inferSelect;
export type SelectAdmin = typeof admins.$inferSelect;
export type SelectSiteSettings = typeof siteSettings.$inferSelect;
export type SelectSocialLink = typeof socialLinks.$inferSelect;
export type SelectBlogPost = typeof blogPosts.$inferSelect;
export type SelectBlogImage = typeof blogImages.$inferSelect;

export interface ProductWithPrices extends SelectProduct {
  prices: SelectProductPrice[];
}

export interface SocialMediaServiceWithPrices extends SelectSocialMediaService {
  prices: SelectSocialMediaPrice[];
}

export interface BlogPostWithImages extends SelectBlogPost {
  images: SelectBlogImage[];
}
