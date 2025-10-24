import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, desc } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  InsertProduct,
  InsertProductPrice,
  InsertReview,
  InsertAnnouncement,
  InsertSocialMediaService,
  InsertSocialMediaPrice,
  InsertAdmin,
  SelectProduct,
  SelectProductPrice,
  SelectReview,
  SelectAnnouncement,
  SelectSocialMediaService,
  SelectSocialMediaPrice,
  SelectAdmin,
  ProductWithPrices,
  SocialMediaServiceWithPrices,
} from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export interface IStorage {
  getProducts(): Promise<ProductWithPrices[]>;
  getProduct(id: number): Promise<ProductWithPrices | null>;
  createProduct(product: InsertProduct, prices: Omit<InsertProductPrice, "productId">[]): Promise<ProductWithPrices>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<ProductWithPrices | null>;
  deleteProduct(id: number): Promise<boolean>;
  
  getReviews(approved?: boolean): Promise<SelectReview[]>;
  getReview(id: number): Promise<SelectReview | null>;
  createReview(review: InsertReview): Promise<SelectReview>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<SelectReview | null>;
  deleteReview(id: number): Promise<boolean>;
  approveReview(id: number): Promise<SelectReview | null>;
  
  getAnnouncements(activeOnly?: boolean): Promise<SelectAnnouncement[]>;
  getAnnouncement(id: number): Promise<SelectAnnouncement | null>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<SelectAnnouncement>;
  updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<SelectAnnouncement | null>;
  deleteAnnouncement(id: number): Promise<boolean>;
  
  getSocialMediaServices(): Promise<SocialMediaServiceWithPrices[]>;
  getSocialMediaService(id: number): Promise<SocialMediaServiceWithPrices | null>;
  createSocialMediaService(service: InsertSocialMediaService, prices: Omit<InsertSocialMediaPrice, "serviceId">[]): Promise<SocialMediaServiceWithPrices>;
  updateSocialMediaService(id: number, service: Partial<InsertSocialMediaService>): Promise<SocialMediaServiceWithPrices | null>;
  deleteSocialMediaService(id: number): Promise<boolean>;
  
  getAdminByUsername(username: string): Promise<SelectAdmin | null>;
  createAdmin(admin: InsertAdmin): Promise<SelectAdmin>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<ProductWithPrices[]> {
    const productsData = await db.select().from(schema.products).where(eq(schema.products.isActive, true));
    
    const productsWithPrices = await Promise.all(
      productsData.map(async (product) => {
        const prices = await db.select().from(schema.productPrices).where(eq(schema.productPrices.productId, product.id));
        return { ...product, prices };
      })
    );
    
    return productsWithPrices;
  }

  async getProduct(id: number): Promise<ProductWithPrices | null> {
    const [product] = await db.select().from(schema.products).where(eq(schema.products.id, id));
    if (!product) return null;
    
    const prices = await db.select().from(schema.productPrices).where(eq(schema.productPrices.productId, id));
    return { ...product, prices };
  }

  async createProduct(product: InsertProduct, prices: Omit<InsertProductPrice, "productId">[]): Promise<ProductWithPrices> {
    const [newProduct] = await db.insert(schema.products).values(product).returning();
    
    const pricesWithProductId = prices.map(p => ({
      productId: newProduct.id,
      value: p.value,
      label: p.label,
      price: p.price,
    }));
    
    const newPrices = await db.insert(schema.productPrices)
      .values(pricesWithProductId)
      .returning();
    
    return { ...newProduct, prices: newPrices };
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<ProductWithPrices | null> {
    const [updated] = await db.update(schema.products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(schema.products.id, id))
      .returning();
    
    if (!updated) return null;
    
    const prices = await db.select().from(schema.productPrices).where(eq(schema.productPrices.productId, id));
    return { ...updated, prices };
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(schema.products).where(eq(schema.products.id, id));
    return true;
  }

  async getReviews(approved?: boolean): Promise<SelectReview[]> {
    if (approved !== undefined) {
      return await db.select().from(schema.reviews)
        .where(eq(schema.reviews.isApproved, approved))
        .orderBy(desc(schema.reviews.createdAt));
    }
    return await db.select().from(schema.reviews).orderBy(desc(schema.reviews.createdAt));
  }

  async getReview(id: number): Promise<SelectReview | null> {
    const [review] = await db.select().from(schema.reviews).where(eq(schema.reviews.id, id));
    return review || null;
  }

  async createReview(review: InsertReview): Promise<SelectReview> {
    const [newReview] = await db.insert(schema.reviews).values(review).returning();
    return newReview;
  }

  async updateReview(id: number, review: Partial<InsertReview>): Promise<SelectReview | null> {
    const updateData: Partial<typeof schema.reviews.$inferInsert> = {};
    if (review.name !== undefined) updateData.name = review.name;
    if (review.email !== undefined) updateData.email = review.email;
    if (review.game !== undefined) updateData.game = review.game;
    if (review.rating !== undefined) updateData.rating = review.rating;
    if (review.comment !== undefined) updateData.comment = review.comment;
    if (review.isApproved !== undefined) updateData.isApproved = review.isApproved;
    
    const [updated] = await db.update(schema.reviews)
      .set(updateData)
      .where(eq(schema.reviews.id, id))
      .returning();
    
    return updated || null;
  }

  async deleteReview(id: number): Promise<boolean> {
    await db.delete(schema.reviews).where(eq(schema.reviews.id, id));
    return true;
  }

  async approveReview(id: number): Promise<SelectReview | null> {
    const [approved] = await db.update(schema.reviews)
      .set({ isApproved: true })
      .where(eq(schema.reviews.id, id))
      .returning();
    
    return approved || null;
  }

  async getAnnouncements(activeOnly?: boolean): Promise<SelectAnnouncement[]> {
    if (activeOnly) {
      return await db.select().from(schema.announcements)
        .where(eq(schema.announcements.isActive, true))
        .orderBy(desc(schema.announcements.createdAt));
    }
    return await db.select().from(schema.announcements).orderBy(desc(schema.announcements.createdAt));
  }

  async getAnnouncement(id: number): Promise<SelectAnnouncement | null> {
    const [announcement] = await db.select().from(schema.announcements).where(eq(schema.announcements.id, id));
    return announcement || null;
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<SelectAnnouncement> {
    const [newAnnouncement] = await db.insert(schema.announcements).values(announcement).returning();
    return newAnnouncement;
  }

  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<SelectAnnouncement | null> {
    const [updated] = await db.update(schema.announcements)
      .set({ ...announcement, updatedAt: new Date() })
      .where(eq(schema.announcements.id, id))
      .returning();
    
    return updated || null;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    await db.delete(schema.announcements).where(eq(schema.announcements.id, id));
    return true;
  }

  async getSocialMediaServices(): Promise<SocialMediaServiceWithPrices[]> {
    const servicesData = await db.select().from(schema.socialMediaServices)
      .where(eq(schema.socialMediaServices.isActive, true));
    
    const servicesWithPrices = await Promise.all(
      servicesData.map(async (service) => {
        const prices = await db.select().from(schema.socialMediaPrices)
          .where(eq(schema.socialMediaPrices.serviceId, service.id));
        return { ...service, prices };
      })
    );
    
    return servicesWithPrices;
  }

  async getSocialMediaService(id: number): Promise<SocialMediaServiceWithPrices | null> {
    const [service] = await db.select().from(schema.socialMediaServices)
      .where(eq(schema.socialMediaServices.id, id));
    if (!service) return null;
    
    const prices = await db.select().from(schema.socialMediaPrices)
      .where(eq(schema.socialMediaPrices.serviceId, id));
    return { ...service, prices };
  }

  async createSocialMediaService(
    service: InsertSocialMediaService,
    prices: Omit<InsertSocialMediaPrice, "serviceId">[]
  ): Promise<SocialMediaServiceWithPrices> {
    const [newService] = await db.insert(schema.socialMediaServices).values(service).returning();
    
    const pricesWithServiceId = prices.map(p => ({
      serviceId: newService.id,
      quantity: p.quantity,
      label: p.label,
      price: p.price,
    }));
    
    const newPrices = await db.insert(schema.socialMediaPrices)
      .values(pricesWithServiceId)
      .returning();
    
    return { ...newService, prices: newPrices };
  }

  async updateSocialMediaService(
    id: number,
    service: Partial<InsertSocialMediaService>
  ): Promise<SocialMediaServiceWithPrices | null> {
    const [updated] = await db.update(schema.socialMediaServices)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(schema.socialMediaServices.id, id))
      .returning();
    
    if (!updated) return null;
    
    const prices = await db.select().from(schema.socialMediaPrices)
      .where(eq(schema.socialMediaPrices.serviceId, id));
    return { ...updated, prices };
  }

  async deleteSocialMediaService(id: number): Promise<boolean> {
    await db.delete(schema.socialMediaServices).where(eq(schema.socialMediaServices.id, id));
    return true;
  }

  async getAdminByUsername(username: string): Promise<SelectAdmin | null> {
    const [admin] = await db.select().from(schema.admins).where(eq(schema.admins.username, username));
    return admin || null;
  }

  async createAdmin(admin: InsertAdmin): Promise<SelectAdmin> {
    const [newAdmin] = await db.insert(schema.admins).values(admin).returning();
    return newAdmin;
  }
}

export const storage = new DatabaseStorage();
