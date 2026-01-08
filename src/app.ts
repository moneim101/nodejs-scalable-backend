import express, { type Application } from "express";
import cors from "cors";
import "./database/index.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import { corsUrl } from "./config.js";
import todoRoutes from "./routes/todoRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import requestLogger from "./middleware/requestLogger.js";

export const app: Application = express();

app.use(cors({ origin: corsUrl, credentials: true, optionsSuccessStatus: 200 }));
app.use(cookieParser());
app.use(express.json({limit: "10kb"}));
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger)

app.use("/api/users", userRoutes);
app.use("/api/todo", todoRoutes);

app.use("*", (req, res) => {
    res.json({ err: "404 page not found" });
});

app.use(errorHandler);
