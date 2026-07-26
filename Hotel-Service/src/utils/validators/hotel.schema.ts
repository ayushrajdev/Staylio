import { z } from "zod";

export const hotelSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  location: z.string().optional(),
  rating: z.number().optional(),
  ratingCount: z.number().optional(),
});
