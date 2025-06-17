import { retrieveCollections } from "../services/bd";
import { Types } from "mongoose";
import {
    UserOutput,
    UpdateUserInput,
    CreateUserInput,
} from "../schemas/user.schemas";

async function getAllUsers(): Promise<UserOutput[]> {
    const collections = await retrieveCollections();
    return collections.Users.find().exec();
}

async function findUserById(id: Types.ObjectId): Promise<UserOutput | null> {
    const collections = await retrieveCollections();
    return collections.Users.findById(id).exec();
}

async function findUserByFirebaseUid(
    firebaseUid: string,
): Promise<UserOutput | null> {
    const { Users } = await retrieveCollections();
    return Users.findOne({ firebaseUid: firebaseUid.trim() }).exec();
}

async function createUser(payload: CreateUserInput): Promise<UserOutput> {
    const collections = await retrieveCollections();
    const result = await collections.Users.create({
        ...payload,
        createdAt: Date.now(),
    });
    return result;
}

async function deleteUserById(id: Types.ObjectId): Promise<UserOutput | null> {
    const collections = await retrieveCollections();
    return collections.Users.findByIdAndDelete(id).exec();
}

async function updateUserById(
    id: Types.ObjectId,
    payload: UpdateUserInput,
): Promise<UserOutput | null> {
    const collections = await retrieveCollections();
    return collections.Users.findByIdAndUpdate(id, payload, {
        new: true,
    }).exec();
}

async function searchUsers(
    searchQuery: string,
    limit: number = 20,
): Promise<UserOutput[]> {
    const collections = await retrieveCollections();

    const searchRegex = new RegExp(searchQuery.trim(), "i");

    return collections.Users.find({
        $or: [
            { name: searchRegex },
            { surname: searchRegex },
            { mail: searchRegex },
            {
                $expr: {
                    $regexMatch: {
                        input: { $concat: ["$name", " ", "$surname"] },
                        regex: searchQuery.trim(),
                        options: "i",
                    },
                },
            },
        ],
    })
        .select(
            "name surname mail rating createdAt address.city address.country",
        )
        .limit(limit)
        .exec();
}

async function getUserStats(userId: Types.ObjectId): Promise<any> {
    const collections = await retrieveCollections();

    const [userTasks, userAsCompletedTasks] = await Promise.all([
        collections.Tasks.find({ ownerId: userId }).exec(),
        collections.Tasks.find({
            assigneeId: userId,
            status: "completed",
        }).exec(),
    ]);

    return {
        tasksCreated: userTasks.length,
        tasksCompleted: userAsCompletedTasks.length,
        tasksCompletedAsOwner: userTasks.filter(
            (task) => task.status === "completed",
        ).length,
        tasksInProgress: userTasks.filter(
            (task) => task.status === "in_progress",
        ).length,
        tasksOpen: userTasks.filter((task) => task.status === "open").length,
    };
}

export {
    getAllUsers,
    findUserById,
    findUserByFirebaseUid,
    createUser,
    deleteUserById,
    updateUserById,
    searchUsers,
    getUserStats,
};
