import { Request, Response, NextFunction } from "express";
import * as taskM from "../model/tasks.model";
import { Types } from "mongoose";
import {
    TaskSchema,
    TaskUpdateSchema,
    TaskCreationPayloadSchema,
    ITask,
} from "../schemas/task.schema";
import { retrieveCollections } from "../services/bd";

async function getAllTasksC(_req: Request, res: Response, next: NextFunction) {
    try {
        const tasks = await taskM.getAllTasks();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}

async function findTaskByIdC(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const trueId = new Types.ObjectId(id);
        const result = await taskM.findTaskById(trueId);
        if (!result) {
            res.status(404).json({
                message: "Task with the given Id was not found",
            });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        next(error);
    }
}

async function createTaskC(req: Request, res: Response, next: NextFunction) {
    try {
        const payload = TaskCreationPayloadSchema.parse(req.body);

        const { Users } = await retrieveCollections();
        const user = await Users.findOne({ firebaseUid: payload.ownerId });

        if (!user) {
            res.status(404).json({
                message: "Owner user not found in the database.",
            });
        } else {
            const taskToCreate = {
                description: payload.description,
                status: payload.status,
                address: payload.address,
                ownerId: user._id,
                assigneeId: payload.assigneeId
                    ? new Types.ObjectId(payload.assigneeId)
                    : null,
            };

            const result = await taskM.createTask(taskToCreate);

            res.status(201).json({
                message: "Task created succesfully!",
                result,
            });
        }
    } catch (error) {
        next(error);
    }
}

async function deleteTaskC(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const trueId = new Types.ObjectId(id);
        const result = await taskM.deleteTaskById(trueId);
        if (!result) {
            res.status(404).json({
                message: "Task with the given Id was not found",
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

async function updateTaskByIdC(
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
            TaskUpdateSchema.parse(payload);

            const result = await taskM.updateTaskById(trueId, payload);

            if (!result) {
                res.status(404).json({
                    message: "Task with the given Id was not found",
                });
            } else {
                res.status(200).json({
                    message: "Task was updated succesfully!",
                    result,
                });
            }
        }
    } catch (error) {
        next(error);
    }
}

export {
    ITask,
    getAllTasksC,
    findTaskByIdC,
    createTaskC,
    deleteTaskC,
    updateTaskByIdC,
};
