// logger.js
import { createLogger, format, transports } from 'winston';
import { environment, logDir } from '../config.js';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, errors, json, splat, colorize } = format;

const logLevel = environment === "development" ? "debug" : "warn";

const dailyRotateFile = new DailyRotateFile({
    level: logLevel,
    filename: `${logDir}/%DATE%-result.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    handleExceptions: true,
    maxSize: '20m',
    maxFiles: "14d",
    format: combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json()
    )
})

const logger = createLogger({
  level: logLevel, // default log level = info
  format: combine(
    timestamp(),
    errors({ stack: true }),
    splat(),
    json()
  ),
  transports: [
    dailyRotateFile
  ],
  exceptionHandlers: [dailyRotateFile],
  rejectionHandlers: [dailyRotateFile],
  exitOnError: false
});

// Only log to console during development
if (environment !== 'production') {
  logger.add(new transports.Console({
    format: combine(
        colorize(),
        timestamp({ format: 'HH:mm:ss' }),
        format.printf(({ level, message, timestamp, stack }) => {
            return stack
            ? `[${timestamp}] ${level}: ${stack}`
            : `[${timestamp}] ${level}: ${message}`;
        })
    )
  }));
}


export default logger