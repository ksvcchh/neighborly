import { z } from "zod";
import { Types } from "mongoose";

const AddressSchema = z.object({
    country: z.string(),
    city: z.string(),
    district: z.string(),
});

const CategoryEnum = z.enum([
    "cleaning",
    "gardening",
    "pet_care",
    "repairs",
    "shopping",
    "delivery",
    "tutoring",
    "elderly_care",
    "moving",
    "other",
]);

const DifficultyEnum = z.enum(["easy", "medium", "hard"]);

const isValidObjectId = (value: string) => Types.ObjectId.isValid(value);

export const TaskSchema = z.object({
    _id: z.string().refine(isValidObjectId, { message: "Invalid Task ID" }),
    owner: z.string().refine(isValidObjectId, { message: "Invalid Owner ID" }),
    assignee: z.union([
        z.string().refine(isValidObjectId).nullable(),
        z.null(),
    ]),
    category: CategoryEnum,
    difficulty: DifficultyEnum,
    reward: z.number().min(0),
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
        category: CategoryEnum.optional(),
        difficulty: DifficultyEnum.optional(),
        reward: z.number().min(0).optional(),
    })
    .strict();

export const TaskCreationPayloadSchema = z
    .object({
        ownerId: z.string(),
        assigneeId: z.union([z.string(), z.null()]),
        status: z.string(),
        category: CategoryEnum.default("other"),
        difficulty: DifficultyEnum.default("medium"),
        reward: z.number().min(0).default(0),
        address: AddressSchema,
        description: z.string(),
    })
    .strict();

export const TaskIdParamSchema = z.object({
    id: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid task ID format.",
    }),
});

export type ITask = z.infer<typeof TaskSchema>;
export type TaskCategory = z.infer<typeof CategoryEnum>;
export type TaskDifficulty = z.infer<typeof DifficultyEnum>;
