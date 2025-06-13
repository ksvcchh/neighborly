import { z } from "zod";
import { Types } from "mongoose";

const AddressSchema = z.object({
    country: z.string(),
    city: z.string(),
    district: z.string(),
});

const isValidObjectId = (value: string) => Types.ObjectId.isValid(value);

export const TaskSchema = z.object({
    _id: z.string().refine(isValidObjectId, { message: "Invalid Task ID" }),
    owner: z.string().refine(isValidObjectId, { message: "Invalid Owner ID" }),
    assignee: z.union([
        z.string().refine(isValidObjectId).nullable(),
        z.null(),
    ]),
    address: AddressSchema,
    description: z.string(),
});

export const TaskUpdateSchema = TaskSchema.omit({ _id: true })
    .partial()
    .extend({
        address: AddressSchema.partial().optional(),
        owner: z.string().refine(isValidObjectId).optional(),
        assignee: z
            .union([z.string().refine(isValidObjectId), z.null()])
            .optional(),
    })
    .strict();

export const TaskCreationPayloadSchema = z
    .object({
        ownerId: z.string(),
        assigneeId: z.union([z.string(), z.null()]),
        status: z.string(),
        address: AddressSchema,
        description: z.string(),
    })
    .strict();

export type ITask = z.infer<typeof TaskSchema>;
