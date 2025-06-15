if (process.env.NODE_ENV !== "production") {
    require("dotenv/config");
}
import express from "express";
import morgan from "morgan";
import cors from "cors";
// import cron from "node-cron";
// import { refreshC } from "./controller/leaderboard.controller";
import router from "./route/leaderboard.route";
// import { NextFunction } from "express";

const PORT = process.env.PORT || 3003;
// const CRON = process.env.REFRESH_INTERVAL_CRON || "*/5 * * * *";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/leaderboards", router);

app.use((err: Error, _req: express.Request, res: express.Response) => {
    console.error("Leaderboards error:", err);
    res.status(500).json({ message: err.message });
});

app.listen(PORT, () => {
    console.log("Leaderboards service started on port", PORT);
});

// cron.schedule(CRON, async () => {
//     const fakeReq = {} as express.Request;
//     const fakeRes = { status: () => ({ json: () => {} }) } as any;
//     refreshC(fakeReq, fakeRes, ((err?: any) => {
//         if (err) console.error("Cron refresh error:", err);
//     }) as NextFunction);
// });
