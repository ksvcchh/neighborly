import { retrieveCollections } from "../services/bd";
import { IUser } from "../controller/users.controller";
import { Types } from "mongoose";

async function getAllUsers(): Promise<IUser[]> {
    const collections = await retrieveCollections();
    return collections.Users.find().exec();
}

async function findUserById(id: Types.ObjectId): Promise<IUser | null> {
    const collections = await retrieveCollections();
    return collections.Users.findById(id).exec();
}

async function createUser(
    payload: Omit<IUser, "_id" | "createdAt">,
): Promise<IUser> {
    const collections = await retrieveCollections();
    const result = await collections.Users.create({
        ...payload,
        createdAt: Date.now(),
    });
    return result;
}

async function deleteUserById(id: Types.ObjectId): Promise<IUser | null> {
    const collections = await retrieveCollections();
    return collections.Users.findByIdAndDelete(id).exec();
}

async function updateUserById(
    id: Types.ObjectId,
    payload: Partial<Omit<IUser, "id" | "createdAt">>,
): Promise<IUser | null> {
    const collections = await retrieveCollections();
    return collections.Users.findByIdAndUpdate(id, payload).exec();
}

export {
    getAllUsers,
    findUserById,
    createUser,
    deleteUserById,
    updateUserById,
};
