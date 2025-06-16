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
    category: string;
    difficulty: string;
    reward: number;
    address: {
        country: string;
        city: string;
        district: string;
    };
    description: string;
};

export type TaskUpdatePayload = Partial<TaskCreationPayload>;

export type TaskStatus = "open" | "in_progress" | "completed" | "cancelled";

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

async function changeTaskStatus(
    id: string,
    newStatus: TaskStatus,
    assigneeId?: string | null,
): Promise<ITaskDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid task ID format.");
    }

    const updateObj: {
        status: TaskStatus;
        assigneeId?: Types.ObjectId | null;
    } = { status: newStatus };

    if (newStatus === "in_progress") {
        if (!assigneeId || !Types.ObjectId.isValid(assigneeId)) {
            throw new Error(
                "Invalid or missing assignee ID for in_progress status.",
            );
        }
        updateObj.assigneeId = new Types.ObjectId(assigneeId);
    } else if (newStatus === "cancelled" || newStatus === "open") {
        updateObj.assigneeId = null;
    }

    const { Tasks } = await retrieveCollections();
    const updated = await Tasks.findByIdAndUpdate(
        new Types.ObjectId(id),
        updateObj,
        { new: true },
    ).exec();

    return updated;
}

async function searchTasks(query: any): Promise<ITaskDocument[]> {
    const collections = await retrieveCollections();
    return collections.Tasks.find(query).exec();
}

async function searchTasksWithSort(
    query: any,
    sortOptions: any,
): Promise<ITaskDocument[]> {
    const collections = await retrieveCollections();
    return collections.Tasks.find(query).sort(sortOptions).exec();
}

export {
    getAllTasks,
    findTaskById,
    createTask,
    deleteTaskById,
    updateTaskById,
    changeTaskStatus,
    searchTasks,
    searchTasksWithSort,
};
