import type { GameProduct, Review } from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<GameProduct[]>;
  getReviews(): Promise<Review[]>;
}

export class MemStorage implements IStorage {
  private products: GameProduct[];
  private reviews: Review[];

  constructor() {
    this.products = [];
    this.reviews = [];
  }

  async getProducts(): Promise<GameProduct[]> {
    return this.products;
  }

  async getReviews(): Promise<Review[]> {
    return this.reviews;
  }

  setProducts(products: GameProduct[]): void {
    this.products = products;
  }

  setReviews(reviews: Review[]): void {
    this.reviews = reviews;
  }
}

export const storage = new MemStorage();
