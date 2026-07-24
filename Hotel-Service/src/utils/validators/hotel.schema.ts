import { z } from 'zod';

export const hotelSchema = z.object({
    name: z.string,
    address: z.string,
    location: z.string,
    rating: z.number,
    ratingCount: z.number,
});
