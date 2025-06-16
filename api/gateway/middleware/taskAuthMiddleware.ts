import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "./authMiddleware";

const USERS_URL = process.env.USERS_SERVICE_URL!;

export function taskAuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (!["POST", "PATCH", "DELETE"].includes(req.method)) {
        return next();
    }

    authMiddleware(req, res, async (authErr) => {
        if (authErr) return next(authErr);

        const needsMongoUserId =
            req.method === "PATCH" &&
            (req.url?.includes("/accept") ||
                req.url?.includes("/cancel") ||
                req.url?.includes("/complete") ||
                req.url?.includes("/owner-cancel"));

        if (needsMongoUserId) {
            const authReq = req as any;
            if (authReq.user?.uid) {
                try {
                    const response = await fetch(
                        `${USERS_URL}/users/firebase/${authReq.user.uid}`,
                    );

                    if (response.ok) {
                        const userData = await response.json();
                        (req as any).mongoUserId = userData._id;
                    } else {
                        res.status(404).json({
                            message: "User not found in database",
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch user MongoDB ID:", error);
                    res.status(500).json({
                        message: "Internal server error",
                    });
                }
            }
        }

        next();
    });
}
