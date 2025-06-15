import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import admin from "firebase-admin";
import { userApiClient } from "../services/apiClients";
import { firebaseAuth } from "../config/firebaseAdmin";

const GatewayRegisterSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(6, "Password must be at least 6 characters"),
        name: z.string(),
        surname: z.string(),
        address: z.object({
            country: z.string(),
            city: z.string(),
            street: z.string(),
            house: z.string(),
        }),
    })
    .strict();

export async function registerUserHandler(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    let firebaseUserRecord: admin.auth.UserRecord | null = null;
    try {
        const { email, password, ...profileData } = GatewayRegisterSchema.parse(
            req.body,
        );

        firebaseUserRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: `${profileData.name} ${profileData.surname}`,
        });

        const userPayloadForMicroservice = {
            firebaseUid: firebaseUserRecord.uid,
            mail: email,
            ...profileData,
        };

        await userApiClient.post("/users", userPayloadForMicroservice);

        res.status(201).json({
            message: "User registered successfully!",
            uid: firebaseUserRecord.uid,
        });
    } catch (error) {
        if (firebaseUserRecord) {
            await admin.auth().deleteUser(firebaseUserRecord.uid);
            console.log(
                `ROLLBACK: Deleted orphaned Firebase user ${firebaseUserRecord.uid}`,
            );
        }
        next(error);
    }
}

export async function loginHandler(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { idToken } = z
            .object({ idToken: z.string().min(10) })
            .parse(req.body);

        const decoded = await firebaseAuth.verifyIdToken(idToken);
        res.status(200).json({ uid: decoded.uid });
    } catch (e) {
        next(e);
    }
}

export async function passwordResetHandler(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { email } = z
            .object({ email: z.string().email() })
            .parse(req.body);

        await firebaseAuth.generatePasswordResetLink(email);

        res.status(200).json({ message: "Reset link sent" });
    } catch (error) {
        next(error);
    }
}
