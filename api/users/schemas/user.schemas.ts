import { Types } from "mongoose";
import { z } from "zod";

const AddressSchema = z.object({
    country: z.string(),
    city: z.string(),
    street: z.string(),
    house: z.string(),
});

export const CreateUserSchema = z
    .object({
        firebaseUid: z.string(),
        name: z.string(),
        surname: z.string(),
        address: AddressSchema,
        mail: z.string().email(),
    })
    .strict();

export const FullUserSchema = CreateUserSchema.extend({
    _id: z.string(),
    role: z.enum(["admin", "editor", "viewer"]),
    rating: z.number().min(0).max(5).default(0),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const UpdateUserSchema = CreateUserSchema.omit({ firebaseUid: true })
    .partial()
    .extend({
        address: AddressSchema.partial().optional(),
        role: z.enum(["admin", "editor", "viewer"]).optional(),
    })
    .strict();

export const UserParamsSchema = z.object({
    id: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid user ID format",
    }),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UserOutput = z.infer<typeof FullUserSchema>;
