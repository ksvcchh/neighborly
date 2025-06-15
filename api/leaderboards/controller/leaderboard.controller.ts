import { Request, Response, NextFunction } from "express";
import * as model from "../model/leaderboard.model";

async function publishersC(_req: Request, res: Response, next: NextFunction) {
    try {
        const doc = await model.readLeaderboard("publishers");

        if (doc) {
            res.status(200).json(doc.entries);
        } else {
            const entries = await model.computePublishers();
            await model.saveLeaderboard("publishers", entries);
            res.status(200).json(entries);
        }
    } catch (e) {
        next(e as Error);
    }
}

async function contractorsC(_req: Request, res: Response, next: NextFunction) {
    try {
        const doc = await model.readLeaderboard("contractors");

        if (doc) {
            res.status(200).json(doc.entries);
        } else {
            const entries = await model.computeContractors();
            await model.saveLeaderboard("contractors", entries);
            res.status(200).json(entries);
        }
    } catch (e) {
        next(e as Error);
    }
}

async function ratingC(_req: Request, res: Response, next: NextFunction) {
    try {
        const doc = await model.readLeaderboard("rating");

        if (doc) {
            res.status(200).json(doc.entries);
        } else {
            const entries = await model.computeTopRated();
            await model.saveLeaderboard("rating", entries);
            res.status(200).json(entries);
        }
    } catch (e) {
        next(e as Error);
    }
}

async function refreshC(_req: Request, res: Response, next: NextFunction) {
    try {
        const [pub, con, rat] = await Promise.all([
            model.computePublishers(),
            model.computeContractors(),
            model.computeTopRated(),
        ]);

        await Promise.all([
            model.saveLeaderboard("publishers", pub),
            model.saveLeaderboard("contractors", con),
            model.saveLeaderboard("rating", rat),
        ]);

        res.status(200).json({ message: "Leaderboards refreshed" });
    } catch (e) {
        next(e as Error);
    }
}

export { publishersC, contractorsC, ratingC, refreshC };
