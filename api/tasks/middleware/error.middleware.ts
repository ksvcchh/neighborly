import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

function errorMiddleware(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    if (err instanceof ZodError) {
        res.status(500).json({ message: err.issues });
    } else {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

export { errorMiddleware };
