import { Router } from "express";
import * as usersC from "../controller/users.controller";
import { allowRoles } from "../middleware/rbac";
import { z } from "zod";
import axios from "axios";

const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://gateway:3241";

const router = Router();

router.get("/firebase/:firebaseUid", usersC.findUserByFirebaseUidC);

router.get("/", usersC.getAllUsersC);
router.post("/", usersC.createUserC);

router.get("/:id", usersC.findUserByIdC);
router.patch("/:id", usersC.updateUserByIdC);

router.delete("/:id", allowRoles("admin"), usersC.deleteUserC);

router.post("/password-reset", async (req, res, next) => {
    try {
        const { email } = z
            .object({ email: z.string().email() })
            .parse(req.body);

        await axios.post(`${GATEWAY_URL}/auth/password-reset`, { email });

        res.status(200).json({ message: "Reset link sent" });
    } catch (error) {
        next(error as Error);
    }
});

export default router;
