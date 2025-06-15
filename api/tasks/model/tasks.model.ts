import { retrieveCollections } from "../services/bd";
import { Types } from "mongoose";

export interface ITaskDocument extends Document {
    ownerId: Types.ObjectId;
    assigneeId: Types.ObjectId | null;
    status: "open" | "in_progress" | "completed" | "cancelled";
    address: {
        country: string;
        city: string;
        district: string;
    };
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export type TaskCreationPayload = {
    ownerId: Types.ObjectId;
    assigneeId: Types.ObjectId | null;
    status: string;
    address: {
        country: string;
        city: string;
        district: string;
    };
    description: string;
};

export type TaskUpdatePayload = Partial<TaskCreationPayload>;

async function getAllTasks(): Promise<ITaskDocument[]> {
    const collections = await retrieveCollections();
    return collections.Tasks.find().exec();
}

async function findTaskById(id: Types.ObjectId): Promise<ITaskDocument> {
    const collections = await retrieveCollections();
    return collections.Tasks.findById(id).exec();
}

async function createTask(
    payload: TaskCreationPayload,
): Promise<ITaskDocument> {
    const collections = await retrieveCollections();
    const result = await collections.Tasks.create(payload);
    return result;
}

async function deleteTaskById(
    id: Types.ObjectId,
): Promise<ITaskDocument | null> {
    const collections = await retrieveCollections();
    return collections.Tasks.findByIdAndDelete(id);
}

async function updateTaskById(
    id: Types.ObjectId,
    payload: TaskCreationPayload,
): Promise<ITaskDocument | null> {
    const collections = await retrieveCollections();
    return collections.Tasks.findByIdAndUpdate(id, payload, { new: true });
}

async function searchTasks(query: any): Promise<ITaskDocument[]> {
    const collections = await retrieveCollections();
    return collections.Tasks.find(query).exec();
}

export {
    getAllTasks,
    findTaskById,
    createTask,
    deleteTaskById,
    updateTaskById,
    searchTasks,
};
