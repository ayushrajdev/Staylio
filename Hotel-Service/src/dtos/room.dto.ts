import { z } from 'zod';

const dateOnlySchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(
        (value) => !Number.isNaN(Date.parse(`${value}T00:00:00`)),
        'Invalid date',
    );

export const RoomGenerationRequestSchema = z.object({
    roomCategoryId: z.number().positive(),
    startDate: dateOnlySchema,
    endDate: dateOnlySchema,
    scheduleType: z.enum(['immediate', 'scheduled']).default('immediate'),
    scheduledAt: z.string().datetime().optional(),
    priceOverride: z.number().positive().optional(),
});

export const RoomGenerationJobSchema = z.object({
    roomCategoryId: z.number().positive(),
    startDate: dateOnlySchema,
    endDate: dateOnlySchema,
    priceOverride: z.number().positive().optional(),
    batchSize: z.number().positive().default(100),
});

export type RoomGenerationJob = z.infer<typeof RoomGenerationJobSchema>;

export type RoomGenerationRequest = z.infer<typeof RoomGenerationRequestSchema>;

export interface RoomGenerationResponse {
    success: boolean;
    totalRoomsCreated: number;
    totalDatesProcessed: number;
    errors: string[];
    jobId: string;
}
