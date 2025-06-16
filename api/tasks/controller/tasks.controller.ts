import { Request, Response, NextFunction } from "express";
import * as taskM from "../model/tasks.model";
import { Types } from "mongoose";
import {
    TaskUpdateSchema,
    TaskCreationPayloadSchema,
    ITask,
    TaskIdParamSchema,
} from "../schemas/task.schema";
import { retrieveCollections } from "../services/bd";
import { buildMongoQuery, buildSortOptions } from "../utils/queryParser";
import { z } from "zod";

async function getAllTasksC(req: Request, res: Response, next: NextFunction) {
    try {
        const query = buildMongoQuery(req.query as any);
        const sortOptions = buildSortOptions(
            req.query.sortBy as string,
            req.query.sortOrder as "asc" | "desc",
        );

        const tasks = await taskM.searchTasksWithSort(query, sortOptions);

        res.status(200).json({
            tasks,
            count: tasks.length,
            filters: {
                status: req.query.status,
                city: req.query.city,
                category: req.query.category,
                difficulty: req.query.difficulty,
                search: req.query.search,
            },
        });
    } catch (e) {
        next(e);
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
            return;
        }

        const taskToCreate = {
            description: payload.description,
            status: payload.status,
            address: payload.address,
            category: payload.category,
            difficulty: payload.difficulty,
            reward: payload.reward,
            ownerId: user._id,
            assigneeId: payload.assigneeId
                ? new Types.ObjectId(payload.assigneeId)
                : null,
        };

        const result = await taskM.createTask(taskToCreate);

        res.status(201).json({
            message: "Task created successfully!",
            result,
        });
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

async function acceptTaskC(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = TaskIdParamSchema.parse(req.params);
        const assigneeId = getCallingUserId(req);

        console.log(`User ${assigneeId} attempting to accept task ${id}`);

        const updatedTask = await taskM.changeTaskStatus(
            id,
            "in_progress" as taskM.TaskStatus,
            assigneeId,
        );

        if (!updatedTask) {
            res.status(404).json({ message: "Task not found." });
        } else {
            res.status(200).json({
                message: "Task accepted successfully",
                task: updatedTask,
            });
        }
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            res.status(400).json({
                message: "Invalid parameters",
                errors: err.errors,
            });
        } else {
            if (err.status === 401) {
                res.status(401).json({ message: err.message });
            } else {
                console.error("Accept task error:", err);
                next(err);
            }
        }
    }
}

async function cancelTaskC(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = TaskIdParamSchema.parse(req.params);
        const userId = getCallingUserId(req);

        console.log(`User ${userId} attempting to cancel task ${id}`);

        const task = await taskM.findTaskById(new Types.ObjectId(id));
        if (!task) {
            res.status(404).json({ message: "Task not found." });
        } else {
            if (task.assigneeId?.toString() !== userId) {
                res.status(403).json({
                    message:
                        "You can only cancel tasks that are assigned to you.",
                });
            } else {
                const updatedTask = await taskM.changeTaskStatus(
                    id,
                    "open" as taskM.TaskStatus,
                );

                if (!updatedTask) {
                    res.status(404).json({ message: "Task not found." });
                } else {
                    res.status(200).json({
                        message: "Task cancelled successfully",
                        task: updatedTask,
                    });
                }
            }
        }
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            res.status(400).json({
                message: "Invalid parameters",
                errors: err.errors,
            });
        } else {
            if (err.status === 401) {
                res.status(401).json({ message: err.message });
            } else {
                console.error("Cancel task error:", err);
                next(err);
            }
        }
    }
}

async function completeTaskC(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = TaskIdParamSchema.parse(req.params);
        const ownerId = getCallingUserId(req);

        console.log(`User ${ownerId} attempting to complete task ${id}`);

        const task = await taskM.findTaskById(new Types.ObjectId(id));
        if (!task) {
            res.status(404).json({ message: "Task not found." });
            return;
        }

        if (task.ownerId?.toString() !== ownerId) {
            res.status(403).json({
                message: "You can only complete tasks that you own.",
            });
            return;
        }

        if (task.status !== "in_progress") {
            res.status(400).json({
                message: "Only tasks in progress can be marked as completed.",
            });
            return;
        }

        const updatedTask = await taskM.changeTaskStatus(
            id,
            "completed" as taskM.TaskStatus,
        );

        if (!updatedTask) {
            res.status(404).json({ message: "Task not found." });
            return;
        }

        res.status(200).json({
            message:
                "Task completed successfully. You can now review the assignee.",
            task: updatedTask,
            canReview: true,
            assigneeId: updatedTask.assigneeId,
        });
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            res.status(400).json({
                message: "Invalid parameters",
                errors: err.errors,
            });
            return;
        }

        if (err.status === 401) {
            res.status(401).json({ message: err.message });
            return;
        }

        console.error("Complete task error:", err);
        next(err);
    }
}

async function ownerCancelTaskC(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { id } = TaskIdParamSchema.parse(req.params);
        const ownerId = getCallingUserId(req);

        console.log(`Owner ${ownerId} attempting to cancel task ${id}`);

        const task = await taskM.findTaskById(new Types.ObjectId(id));
        if (!task) {
            res.status(404).json({ message: "Task not found." });
            return;
        }

        if (task.ownerId?.toString() !== ownerId) {
            res.status(403).json({
                message: "You can only cancel tasks that you own.",
            });
            return;
        }

        if (task.status === "completed") {
            res.status(400).json({
                message: "Completed tasks cannot be cancelled.",
            });
            return;
        }

        const updatedTask = await taskM.changeTaskStatus(
            id,
            "cancelled" as taskM.TaskStatus,
        );

        if (!updatedTask) {
            res.status(404).json({ message: "Task not found." });
        } else {
            res.status(200).json({
                message: "Task cancelled successfully by owner",
                task: updatedTask,
            });
        }
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            res.status(400).json({
                message: "Invalid parameters",
                errors: err.errors,
            });
        } else {
            if (err.status === 401) {
                res.status(401).json({ message: err.message });
            } else {
                console.error("Owner cancel task error:", err);
                next(err);
            }
        }
    }
}

export {
    ITask,
    getAllTasksC,
    findTaskByIdC,
    createTaskC,
    deleteTaskC,
    updateTaskByIdC,
    acceptTaskC,
    cancelTaskC,
    completeTaskC,
    ownerCancelTaskC,
};

function getCallingUserId(req: Request): string {
    const userId = req.header("x-user-id");
    if (!userId || !Types.ObjectId.isValid(userId)) {
        throw {
            status: 401,
            message: "Unauthorized: missing or invalid user ID.",
        };
    }
    return userId;
}
