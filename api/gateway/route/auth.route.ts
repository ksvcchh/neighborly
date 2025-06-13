import { Router } from "express";
import { registerUserHandler } from "../controller/auth.controller";

const router = Router();

router.post("/register", registerUserHandler);

export default router;
