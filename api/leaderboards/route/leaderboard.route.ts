import { Router } from "express";
import * as c from "../controller/leaderboard.controller";

const router = Router();

router.get("/publishers", c.publishersC);
router.get("/contractors", c.contractorsC);
router.get("/rating", c.ratingC);
router.post("/refresh", c.refreshC);

export default router;
