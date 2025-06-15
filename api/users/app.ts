if (process.env.NODE_ENV !== "production") {
    require("dotenv/config");
}
import morgan from "morgan";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware";
import userRouter from "./route/users.route";
const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    console.log("Environment check:");
    console.log("- MONGODB_URI:", process.env.MONGODB_URI);
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    next();
});

app.use("/users/", userRouter);

app.use((error: any, _req: Request, _res: Response, next: NextFunction) => {
    console.error("=== USERS SERVICE ERROR ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    console.error("========================");
    next(error);
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log("I am running! Server succesfully started on port", PORT);
});
