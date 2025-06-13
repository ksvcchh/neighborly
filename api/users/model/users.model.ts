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

export {
    getAllUsers,
    findUserById,
    createUser,
    deleteUserById,
    updateUserById,
};
