import * as userM from "../model/users.model";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import {
    CreateUserSchema,
    FirebaseUidParamSchema,
    UpdateUserSchema,
    UserParamsSchema,
} from "../schemas/user.schemas";

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
        const { id } = UserParamsSchema.parse(req.params);

        const user = await userM.findUserById(new Types.ObjectId(id));

        if (!user) {
            res.status(404).json({
                message: "User with the given ID was not found",
            });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        next(error);
    }
}

async function findUserByFirebaseUidC(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { firebaseUid } = FirebaseUidParamSchema.parse(req.params);
        const user = await userM.findUserByFirebaseUid(firebaseUid);
        if (!user) {
            res.status(404).json({ message: "User not found." });
        } else {
            res.status(200).json(user);
        }
    } catch (err) {
        next(err as Error);
    }
}

async function createUserC(req: Request, res: Response, next: NextFunction) {
    try {
        const validatedPayload = CreateUserSchema.parse(req.body);

        const newUser = await userM.createUser(validatedPayload);

        res.status(201).json({
            message: "User created successfully!",
            user: newUser,
        });
    } catch (error) {
        next(error);
    }
}

async function deleteUserC(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = UserParamsSchema.parse(req.params);
        const result = await userM.deleteUserById(new Types.ObjectId(id));

        if (!result) {
            res.status(404).json({
                message: "User with the given ID was not found",
            });
        } else {
            res.status(204).send();
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
        const { id } = UserParamsSchema.parse(req.params);
        const validatedPayload = UpdateUserSchema.parse(req.body);

        if (Object.keys(validatedPayload).length === 0) {
            res.status(400).json({ message: "Update payload cannot be empty" });
        } else {
            const updatedUser = await userM.updateUserById(
                new Types.ObjectId(id),
                validatedPayload,
            );

            if (!updatedUser) {
                res.status(404).json({
                    message: "User with the given ID was not found",
                });
            } else {
                res.status(200).json({
                    message: "User was updated successfully!",
                    user: updatedUser,
                });
            }
        }
    } catch (error) {
        next(error);
    }
}
export {
    getAllUsersC,
    createUserC,
    findUserByIdC,
    findUserByFirebaseUidC,
    deleteUserC,
    updateUserByIdC,
};
