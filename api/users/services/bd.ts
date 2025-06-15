// import dotenv from "dotenv";
import mongoose, { Schema, model } from "mongoose";

interface dbConnectionObj {
    URI: string;
    USERS_COLLECTION_NAME: string;
    TASKS_COLLECTION_NAME: string;
    RATINGS_COLLECTION_NAME: string;
}

interface collectionObj {
    Users: mongoose.Model<any>;
    Tasks: mongoose.Model<any>;
    Ratings: mongoose.Model<any>;
}

let isConnected = false;

async function retrieveCollections(): Promise<collectionObj> {
    const connectionObj = checkVariables();

    if (!isConnected) {
        await mongoose.connect(connectionObj.URI);
        isConnected = true;
    }

    const usersSchema = new Schema(
        {
            firebaseUid: {
                type: String,
                required: [true, "A firebaseUid is required."],
                unique: true,
                index: true,
            },
            name: {
                type: String,
                required: [true, "A name is required."],
                trim: true,
            },
            surname: {
                type: String,
                required: [true, "A surname is required."],
                trim: true,
            },
            mail: {
                type: String,
                required: [true, "An email is required."],
                unique: true,
                lowercase: true,
                trim: true,
            },
            address: {
                country: { type: String, required: true },
                city: { type: String, required: true },
                street: { type: String, required: true },
                house: { type: String, required: true },
            },
            role: {
                type: String,
                enum: ["admin", "editor", "viewer"],
                required: true,
                default: "viewer",
            },
            rating: {
                type: Number,
                min: 0,
                max: 5,
                default: 0,
            },
        },
        {
            timestamps: true,
        },
    );

    const tasksSchema = new Schema(
        {
            ownerId: {
                type: Schema.Types.ObjectId,
                required: true,
                index: true,
            },
            assigneeId: {
                type: Schema.Types.ObjectId,
                default: null,
                index: true,
            },
            status: {
                type: String,
                enum: ["open", "in_progress", "completed", "cancelled"],
                default: "open",
                required: true,
            },
            address: {
                country: { type: String, required: true },
                city: { type: String, required: true },
                district: { type: String, required: true },
            },
            description: {
                type: String,
                required: true,
                trim: true,
            },
        },
        {
            timestamps: true,
        },
    );

    const ratingsSchema = new Schema(
        {
            userId: {
                type: Schema.Types.ObjectId,
                required: [true, "A rating must be associated with a user."],
                unique: true,
                index: true,
            },
            upvotes: {
                type: Number,
                required: true,
                default: 0,
                min: 0,
            },
            downvotes: {
                type: Number,
                required: true,
                default: 0,
                min: 0,
            },
        },
        {
            timestamps: true,
        },
    );

    const Users =
        mongoose.models[connectionObj.USERS_COLLECTION_NAME] ||
        model(connectionObj.USERS_COLLECTION_NAME, usersSchema);
    const Tasks =
        mongoose.models[connectionObj.TASKS_COLLECTION_NAME] ||
        model(connectionObj.TASKS_COLLECTION_NAME, tasksSchema);
    const Ratings =
        mongoose.models[connectionObj.RATINGS_COLLECTION_NAME] ||
        model(connectionObj.RATINGS_COLLECTION_NAME, ratingsSchema);

    return {
        Users,
        Tasks,
        Ratings,
    };
}

function checkVariables(): dbConnectionObj {
    const MONGODB_URI = process.env.MONGODB_URI;
    const USERS_COLLECTION_NAME = process.env.USERS_COLLECTION_NAME;
    const TASKS_COLLECTION_NAME = process.env.TASKS_COLLECTION_NAME;
    const RATINGS_COLLECTION_NAME = process.env.RATINGS_COLLECTION_NAME;

    if (
        // dotenv.config().error ||
        !MONGODB_URI ||
        !USERS_COLLECTION_NAME ||
        !TASKS_COLLECTION_NAME ||
        !RATINGS_COLLECTION_NAME
    ) {
        throw new Error(
            "DOTENV FILE IS NOT LOADED OR IT DOES NOT CONTAIN DESIRED VARIABLES!",
        );
    }

    const URI = MONGODB_URI;
    return {
        URI,
        USERS_COLLECTION_NAME,
        TASKS_COLLECTION_NAME,
        RATINGS_COLLECTION_NAME,
    };
}

export { retrieveCollections };
