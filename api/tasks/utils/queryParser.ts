import { FilterQuery } from "mongoose";

export function buildMongoQuery(q: any): FilterQuery<any> {
    const query: any = {};
    if (q.status) query.status = q.status;
    if (q.city) query["address.city"] = q.city;
    if (q.search) query.$text = { $search: q.search };
    if (q.minReward || q.maxReward) {
        query.reward = {};
        if (q.minReward) query.reward.$gte = Number(q.minReward);
        if (q.maxReward) query.reward.$lte = Number(q.maxReward);
    }
    return query;
}
