if (process.env.NODE_ENV !== "production") {
    require("dotenv/config");
}
import morgan from "morgan";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware";
import taskRouter from "./route/tasks.route";
const PORT = process.env.PORT;

const app = express();

app.use((req, _res, next) => {
    console.log(
        ">>> [Tasks Service] Incoming request:",
        req.method,
        req.originalUrl,
    );
    console.log(">>> [Tasks Service] Headers:", req.headers);
    next();
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/tasks/", taskRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log("Server succesfully started on port", PORT);
});
