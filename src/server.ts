import logger from "./cors/logger.js";
import { app } from "./app.js";
import { environment, port } from "./config.js";

export const PORT = port ?? 8080;

app.listen(PORT, () => {
    let lg = logger.info(`Server is running on port ${PORT} - ${environment}`);
});

