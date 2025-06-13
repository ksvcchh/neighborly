import { Request, Response, NextFunction } from "express";
import admin, { firebaseAuth } from "../config/firebaseAdmin";

export interface AuthenticatedRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

export async function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(403).json({ message: "Unauthorized: No token provided" });
    } else {
        const idToken = authHeader.split("Bearer ")[1];

        try {
            const decodedToken = await firebaseAuth.verifyIdToken(idToken);
            req.user = decodedToken;
            next();
        } catch (error) {
            console.error("Error while verifying Firebase ID token:", error);
            res.status(403).json({ message: "Unauthorized: Invalid token" });
        }
    }
}
