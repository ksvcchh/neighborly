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
