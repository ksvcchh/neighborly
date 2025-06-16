import { FilterQuery } from "mongoose";

export interface TaskSearchQuery {
    status?: string;
    city?: string;
    country?: string;
    district?: string;
    category?: string;
    difficulty?: string;
    minReward?: string;
    maxReward?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export function buildMongoQuery(q: TaskSearchQuery): FilterQuery<any> {
    const query: any = {};

    if (q.status) {
        query.status = q.status;
    }
    if (q.city) {
        query["address.city"] = { $regex: q.city, $options: "i" };
    }
    if (q.country) {
        query["address.country"] = { $regex: q.country, $options: "i" };
    }
    if (q.district) {
        query["address.district"] = { $regex: q.district, $options: "i" };
    }
    if (q.category) {
        query.category = q.category;
    }
    if (q.difficulty) {
        query.difficulty = q.difficulty;
    }
    if (q.minReward || q.maxReward) {
        query.reward = {};
        if (q.minReward) {
            query.reward.$gte = Number(q.minReward);
        }
        if (q.maxReward) {
            query.reward.$lte = Number(q.maxReward);
        }
    }
    if (q.search) {
        query.$text = { $search: q.search };
    }

    return query;
}

export function buildSortOptions(
    sortBy?: string,
    sortOrder: "asc" | "desc" = "desc",
): any {
    const sortOptions: any = {};

    switch (sortBy) {
        case "reward":
            sortOptions.reward = sortOrder === "asc" ? 1 : -1;
            break;
        case "difficulty":
            const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
            sortOptions.difficulty = sortOrder === "asc" ? 1 : -1;
            break;
        case "created":
            sortOptions.createdAt = sortOrder === "asc" ? 1 : -1;
            break;
        default:
            sortOptions.createdAt = -1;
    }

    return sortOptions;
}
