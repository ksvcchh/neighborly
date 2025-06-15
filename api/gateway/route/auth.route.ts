import { Router } from "express";
import {
    loginHandler,
    passwordResetHandler,
    registerUserHandler,
} from "../controller/auth.controller";

const router = Router();

router.post("/register", registerUserHandler);
router.post("/login", loginHandler);
router.post("/password-reset", passwordResetHandler);

export default router;
