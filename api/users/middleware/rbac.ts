import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

export interface AuthenticatedRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

export function allowRoles(...allowed: string[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.sendStatus(403);
        } else {
            if (!allowed.includes((req.user as any).role)) {
                res.sendStatus(403);
            } else {
                next();
            }
        }
    };
}
