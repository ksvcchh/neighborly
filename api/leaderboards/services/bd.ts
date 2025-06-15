// import "dotenv/config";
import mongoose, { Schema, model } from "mongoose";

interface DbVars {
    URI: string;
    USERS_COLLECTION_NAME: string;
    TASKS_COLLECTION_NAME: string;
    LEADERBOARDS_COLLECTION_NAME: string;
}

interface Collections {
    Users: mongoose.Model<any>;
    Tasks: mongoose.Model<any>;
    Leaderboards: mongoose.Model<any>;
}

let isConnected = false;
let cached: Collections | null = null;

function loadEnv(): DbVars {
    const {
        MONGODB_URI,
        USERS_COLLECTION_NAME,
        TASKS_COLLECTION_NAME,
        LEADERBOARDS_COLLECTION_NAME,
    } = process.env;

    if (
        !MONGODB_URI ||
        !USERS_COLLECTION_NAME ||
        !TASKS_COLLECTION_NAME ||
        !LEADERBOARDS_COLLECTION_NAME
    ) {
        throw new Error("Leaderboards: missing .env variables");
    }

    return {
        URI: MONGODB_URI,
        USERS_COLLECTION_NAME,
        TASKS_COLLECTION_NAME,
        LEADERBOARDS_COLLECTION_NAME,
    };
}

export async function getCollections(): Promise<Collections> {
    if (cached) return cached;

    const cfg = loadEnv();

    if (!isConnected) {
        await mongoose.connect(cfg.URI);
        isConnected = true;
    }

    const leaderboardSchema = new Schema(
        {
            _id: { type: String },
            entries: { type: Array, default: [] },
            refreshedAt: { type: Date, default: Date.now },
        },
        { versionKey: false },
    );

    const Users =
        mongoose.models[cfg.USERS_COLLECTION_NAME] ||
        model(cfg.USERS_COLLECTION_NAME, new Schema({}, { strict: false }));

    const Tasks =
        mongoose.models[cfg.TASKS_COLLECTION_NAME] ||
        model(cfg.TASKS_COLLECTION_NAME, new Schema({}, { strict: false }));

    const Leaderboards =
        mongoose.models[cfg.LEADERBOARDS_COLLECTION_NAME] ||
        model(cfg.LEADERBOARDS_COLLECTION_NAME, leaderboardSchema);

    cached = { Users, Tasks, Leaderboards };
    return cached;
}
