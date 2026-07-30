import { z } from 'zod';

export const pingSchema = z.object({
    ping: z.string(),
});
