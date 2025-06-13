import { Router } from "express";
import * as tasksC from "../controller/tasks.controller";

const router = Router();

router.get("/", tasksC.getAllTasksC);
router.get("/:id", tasksC.findTaskByIdC);
router.post("/", tasksC.createTaskC);
router.delete("/:id", tasksC.deleteTaskC);
router.patch("/:id", tasksC.updateTaskByIdC);

export default router;
