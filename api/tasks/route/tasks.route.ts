import { Router } from "express";
import * as tasksC from "../controller/tasks.controller";

const router = Router();

router.get("/", tasksC.getAllTasksC);
router.get("/:id", tasksC.findTaskByIdC);
router.post("/", tasksC.createTaskC);
router.delete("/:id", tasksC.deleteTaskC);

router.patch("/:id/accept", tasksC.acceptTaskC);
router.patch("/:id/cancel", tasksC.cancelTaskC);

router.patch("/:id/complete", tasksC.completeTaskC);
router.patch("/:id/owner-cancel", tasksC.ownerCancelTaskC);

router.patch("/:id", tasksC.updateTaskByIdC);

export default router;
