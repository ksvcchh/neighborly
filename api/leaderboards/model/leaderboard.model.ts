import { Types } from "mongoose";
import { getCollections } from "../services/bd";

export interface LeaderboardEntry {
    userId: Types.ObjectId;
    score: number;
    name?: string;
    surname?: string;
    rating?: number;
}

export async function computePublishers(limit = 10) {
    const { Tasks, Users } = await getCollections();

    return Tasks.aggregate([
        { $group: { _id: "$ownerId", score: { $sum: 1 } } },
        { $sort: { score: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: Users.collection.name,
                localField: "_id",
                foreignField: "_id",
                as: "u",
            },
        },
        { $unwind: "$u" },
        {
            $project: {
                userId: "$_id",
                score: 1,
                name: "$u.name",
                surname: "$u.surname",
                rating: "$u.rating",
            },
        },
    ]);
}

export async function computeContractors(limit = 10) {
    const { Tasks, Users } = await getCollections();

    return Tasks.aggregate([
        { $match: { status: "completed", assigneeId: { $ne: null } } },
        { $group: { _id: "$assigneeId", score: { $sum: 1 } } },
        { $sort: { score: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: Users.collection.name,
                localField: "_id",
                foreignField: "_id",
                as: "u",
            },
        },
        { $unwind: "$u" },
        {
            $project: {
                userId: "$_id",
                score: 1,
                name: "$u.name",
                surname: "$u.surname",
                rating: "$u.rating",
            },
        },
    ]);
}

export async function computeTopRated(limit = 10) {
    const { Users } = await getCollections();

    return Users.aggregate([
        { $match: { rating: { $gt: 0 } } },
        { $sort: { rating: -1 } },
        { $limit: limit },
        {
            $project: {
                userId: "$_id",
                score: "$rating",
                name: "$name",
                surname: "$surname",
                rating: "$rating",
            },
        },
    ]);
}

export async function saveLeaderboard(id: string, entries: LeaderboardEntry[]) {
    const { Leaderboards } = await getCollections();
    await Leaderboards.findByIdAndUpdate(
        id,
        { entries, refreshedAt: new Date() },
        { upsert: true },
    );
}

export async function readLeaderboard(id: string) {
    const { Leaderboards } = await getCollections();
    return Leaderboards.findById(id).lean();
}
