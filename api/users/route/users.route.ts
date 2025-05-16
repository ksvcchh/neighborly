import { Router } from "express";
import * as usersC from "../controller/users.controller";

const router = Router();

router.get("/", usersC.getAllUsersC);
router.get("/:id", usersC.findUserByIdC);
router.post("/", usersC.createUserC);
router.delete("/:id", usersC.deleteUserC);
router.patch("/:id", usersC.updateUserByIdC);

export default router;
