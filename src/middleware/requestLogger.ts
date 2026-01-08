import type { RequestHandler } from "express";
import logger from "../cors/logger.js";

const requestLogger: RequestHandler = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        logger.info('HTTP Request', {
            method: req.method,
            url: req.originalUrl,
            status: req.statusCode,
            duration: `${duration}ms`,
            ip: req.ip
        })
    })

    next();
}

export default requestLogger;