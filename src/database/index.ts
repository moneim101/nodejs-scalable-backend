import mongoose from "mongoose";
import { db } from "../config.js";
import logger from "../cors/logger.js";

// const dbURI = `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}`
const dbURI = `mongodb+srv://${db.user}:${db.password}@${db.host}/${db.name}`;
mongoose
    .connect(dbURI)
    .then(() => logger.info("MongoDB Connected"))
    .catch((err) => logger.error(err));
