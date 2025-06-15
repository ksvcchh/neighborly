if (process.env.NODE_ENV !== "production") {
    require("dotenv/config");
}
import express, { NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { Request, Response } from "express";
import proxy from "express-http-proxy";
import { authMiddleware } from "./middleware/authMiddleware";
import "./config/firebaseAdmin";
import authRouter from "./route/auth.route";
import { z } from "zod";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const gw = express();

gw.use(morgan("dev"));
gw.use(cors({ origin: true }));
gw.use(express.json());
gw.use(helmet());
gw.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }),
);

const PORT = process.env.PORT;

const USERS_URL = process.env.USERS_SERVICE_URL!;
const TASKS_URL = process.env.TASKS_SERVICE_URL!;
const REVIEWS_URL = process.env.REVIEWS_SERVICE_URL!;
const LEADERBOARDS_URL = process.env.LEADERBOARDS_SERVICE_URL!;

// gw.use((req, res, next) => {
//     if (["POST", "PATCH", "DELETE"].includes(req.method))
//         return authMiddleware(req, res, next);
//     next();
// });

gw.use("/auth", authRouter);

gw.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
            users: USERS_URL,
            tasks: TASKS_URL,
            reviews: REVIEWS_URL,
            leaderboards: LEADERBOARDS_URL,
        },
    });
});

gw.use(
    "/users/",
    proxy(USERS_URL, {
        proxyReqPathResolver: (req: Request) => {
            return `/users${req.url}`;
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.method == "GET") {
                delete (proxyReqOpts.headers as Record<string, string>)[
                    "content-type"
                ];
                delete (proxyReqOpts.headers as Record<string, string>)[
                    "content-length"
                ];
            }

            return proxyReqOpts;
        },

        userResDecorator: (proxyRes, proxyResData, userReq, _userRes) => {
            console.log(
                `Gateway: Response from Users Service for ${userReq.method} ${userReq.originalUrl}. Status: ${proxyRes.statusCode}`,
            );
            return proxyResData;
        },
    }),
);

gw.use(
    "/tasks/",
    (req: Request, res: Response, next: NextFunction) => {
        if (req.method === "POST") return authMiddleware(req, res, next);
        next();
    },
    proxy(TASKS_URL, {
        proxyReqPathResolver: (req: Request) => {
            return `/tasks${req.url}`;
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.method === "GET") {
                delete (proxyReqOpts.headers as Record<string, string>)[
                    "content-type"
                ];
                delete (proxyReqOpts.headers as Record<string, string>)[
                    "content-length"
                ];
            }
            return proxyReqOpts;
        },

        userResDecorator: (proxyRes, proxyResData, userReq, _userRes) => {
            console.log(
                `Gateway: Response from Tasks Service for ${userReq.method} ${userReq.originalUrl}. Status: ${proxyRes.statusCode}`,
            );
            return proxyResData;
        },
    }),
);

gw.use(
    "/reviews/",
    proxy(REVIEWS_URL, {
        proxyReqPathResolver: (req: Request) => {
            return `/reviews${req.url}`;
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.method == "GET") {
                delete (proxyReqOpts.headers as Record<string, string>)[
                    "content-type"
                ];
                delete (proxyReqOpts.headers as Record<string, string>)[
                    "content-length"
                ];
            }
            return proxyReqOpts;
        },

        userResDecorator: (proxyRes, proxyResData, userReq, _userRes) => {
            console.log(
                `Gateway: Response from Reviews Service for ${userReq.method} ${userReq.originalUrl}. Status: ${proxyRes.statusCode}`,
            );
            return proxyResData;
        },
    }),
);

gw.use(
    "/leaderboards/",
    proxy(LEADERBOARDS_URL, {
        proxyReqPathResolver: (req: Request) => {
            return `/leaderboards${req.url}`;
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.method == "GET") {
                delete (proxyReqOpts.headers as Record<string, string>)[
                    "content-type"
                ];
                delete (proxyReqOpts.headers as Record<string, string>)[
                    "content-length"
                ];
            }
            return proxyReqOpts;
        },

        userResDecorator: (proxyRes, proxyResData, userReq, _userRes) => {
            console.log(
                `Gateway: Response from Leaderboards Service for ${userReq.method} ${userReq.originalUrl}. Status: ${proxyRes.statusCode}`,
            );
            return proxyResData;
        },
    }),
);

gw.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Gateway Error Handler:", error);
    if (error instanceof z.ZodError) {
        res.status(400).json({
            message: "Invalid input",
            errors: error.errors,
        });
    } else {
        const errAny = error as any;
        if (errAny.code === "auth/email-already-exists") {
            res.status(409).json({ message: "Email is already in use." });
        } else {
            res.status(500).json({
                message: "An internal server error occurred.",
            });
        }
    }
});

gw.use((req: Request, res: Response) => {
    console.error("Gateway does not know about given request address!");
    res.status(404).json({ message: `${req.path} is not known to Gateway!` });
});

gw.listen(PORT, () => {
    console.log("I am working! Gateway succesfully started on port", PORT);
});
