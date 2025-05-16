import dotenv from "dotenv";
import mongoose, { Schema, ObjectId, model } from "mongoose";

interface dbConnectionObj {
    URI: string;
    DB_NAME: string;
    USERS_COLLECTION_NAME: string;
    TASKS_COLLECTION_NAME: string;
    REVIEWS_COLLECTION_NAME: string;
    RATINGS_COLLECTION_NAME: string;
}

interface collectionObj {
    Users: mongoose.Model<any>;
    Tasks: mongoose.Model<any>;
    Reviews: mongoose.Model<any>;
    Ratings: mongoose.Model<any>;
}

let isConnected = false;

async function retrieveCollections(): Promise<collectionObj> {
    const connectionObj = checkVariables();

    if (!isConnected) {
        await mongoose.connect(connectionObj.URI + connectionObj.DB_NAME);
        isConnected = true;
    }

    const usersSchema = new Schema({
        name: String,
        surname: String,
        mail: String,
        address: {
            country: String,
            city: String,
            street: String,
            house: String,
        },
        rating: Number,
        createdAt: Date,
    });

    const tasksSchema = new Schema({
        owner: { type: Schema.Types.ObjectId, ref: "User" },
        assignee: { type: Schema.Types.ObjectId, default: null, ref: "User" },
        address: {
            country: String,
            city: String,
            district: String,
        },
        description: String,
    });

    const reviewsSchema = new Schema({
        author: { type: Schema.Types.ObjectId, ref: "User" },
        task: { type: Schema.Types.ObjectId, ref: "Task" },
        text: String,
        rating: {
            type: String,
            enum: ["Positive", "Neutral", "Negative"],
            default: "Neutral",
        },
    });

    const ratingsSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: "User" },
        upvotes: Number,
    });

    const Users =
        mongoose.models[connectionObj.USERS_COLLECTION_NAME] ||
        model(connectionObj.USERS_COLLECTION_NAME, usersSchema);
    const Tasks =
        mongoose.models[connectionObj.TASKS_COLLECTION_NAME] ||
        model(connectionObj.TASKS_COLLECTION_NAME, tasksSchema);
    const Reviews =
        mongoose.models[connectionObj.REVIEWS_COLLECTION_NAME] ||
        model(connectionObj.REVIEWS_COLLECTION_NAME, reviewsSchema);
    const Ratings =
        mongoose.models[connectionObj.RATINGS_COLLECTION_NAME] ||
        model(connectionObj.RATINGS_COLLECTION_NAME, ratingsSchema);

    return {
        Users,
        Tasks,
        Reviews,
        Ratings,
    };
}

function checkVariables(): dbConnectionObj {
    const MONGODB_URI = process.env.MONGODB_URI;
    const MONGODB_PORT = process.env.MONGODB_PORT;
    const DB_NAME = process.env.DB_NAME;
    const USERS_COLLECTION_NAME = process.env.USERS_COLLECTION_NAME;
    const TASKS_COLLECTION_NAME = process.env.TASKS_COLLECTION_NAME;
    const REVIEWS_COLLECTION_NAME = process.env.REVIEWS_COLLECTION_NAME;
    const RATINGS_COLLECTION_NAME = process.env.RATINGS_COLLECTION_NAME;

    if (
        dotenv.config().error ||
        !MONGODB_URI ||
        !MONGODB_PORT ||
        !DB_NAME ||
        !USERS_COLLECTION_NAME ||
        !TASKS_COLLECTION_NAME ||
        !REVIEWS_COLLECTION_NAME ||
        !RATINGS_COLLECTION_NAME
    ) {
        throw new Error(
            "DOTENV FILE IS NOT LOADED OR IT DOES NOT CONTAIN DESIRED VARIABLES!",
        );
    }

    const URI = MONGODB_URI + MONGODB_PORT;
    return {
        URI,
        DB_NAME,
        USERS_COLLECTION_NAME,
        TASKS_COLLECTION_NAME,
        REVIEWS_COLLECTION_NAME,
        RATINGS_COLLECTION_NAME,
    };
}

export { retrieveCollections };
