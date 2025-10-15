import { z } from "zod";

export interface GameProduct {
  id: string;
  name: string;
  currency: string;
  image: string;
  amounts: ProductAmount[];
}

export interface ProductAmount {
  value: number;
  label: string;
  price?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  purchaseAmount: string;
  gameDate: string;
}

export const gameProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: z.string(),
  image: z.string(),
  amounts: z.array(z.object({
    value: z.number(),
    label: z.string(),
    price: z.string().optional(),
  })),
});

export const reviewSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.number().min(1).max(5),
  purchaseAmount: z.string(),
  gameDate: z.string(),
});

export type SelectGameProduct = GameProduct;
export type SelectReview = Review;
