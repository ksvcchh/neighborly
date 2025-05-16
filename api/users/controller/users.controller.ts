import * as userM from "../model/users.model";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Types } from "mongoose";

const AddressSchema = z.object({
    country: z.string(),
    city: z.string(),
    street: z.string(),
    house: z.string(),
});

const UserSchema = z.object({
    _id: z.string(),
    name: z.string(),
    surname: z.string(),
    address: AddressSchema,
    rating: z.number().min(0).max(5),
    mail: z.string().email({ message: "Invalid email address" }),
    createdAt: z.date(),
});

const UserUpdateSchema = UserSchema.omit({ _id: true, createdAt: true })
    .partial()
    .extend({
        address: AddressSchema.partial().optional(),
    })
    .strict();

type IUser = z.infer<typeof UserSchema>;

async function getAllUsersC(_req: Request, res: Response, next: NextFunction) {
    try {
        const users = await userM.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

async function findUserByIdC(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const trueId = new Types.ObjectId(id);
        const result = await userM.findUserById(trueId);
        if (!result) {
            res.status(404).json({
                message: "User with the given Id was not found",
            });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        next(error);
    }
}

async function createUserC(req: Request, res: Response, next: NextFunction) {
    try {
        const payload = req.body;
        UserSchema.omit({ _id: true, createdAt: true }).parse(payload);
        const result = await userM.createUser(payload);
        if (!result) {
            res.status(500).json({
                message: "Something went wrong during user creation ",
            });
        } else {
            res.status(201).json({
                message: "User created succesfully!",
                result,
            });
        }
    } catch (error) {
        next(error);
    }
}

async function deleteUserC(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const trueId = new Types.ObjectId(id);
        const result = await userM.deleteUserById(trueId);
        if (!result) {
            res.status(404).json({
                message: "User with the given Id was not found",
            });
        } else {
            res.status(200).json({
                message: "Document was deleted succesfully",
            });
        }
    } catch (error) {
        next(error);
    }
}

async function updateUserByIdC(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { id } = req.params;
        const payload = req.body;
        const trueId = new Types.ObjectId(id);

        if (!payload) {
            res.status(500).json({
                message: "PATCH request's body can not be empty!",
            });
        } else {
            UserUpdateSchema.parse(payload);

            const result = await userM.updateUserById(trueId, payload);

            if (!result) {
                res.status(404).json({
                    message: "User with the given Id was not found",
                });
            } else {
                res.status(200).json({
                    message: "User was updated succesfully!",
                    result,
                });
            }
        }
    } catch (error) {
        next(error);
    }
}

export {
    IUser,
    getAllUsersC,
    createUserC,
    findUserByIdC,
    deleteUserC,
    updateUserByIdC,
};
