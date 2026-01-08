import type { ErrorRequestHandler, NextFunction, Request, Response } from "express"
import { AppError } from "../utils/AppError.js"

const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Resource Not Found"
    statusCode = 404
  }
  res.status(statusCode)
  res.json({
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  })
}

const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Not Found: ${req.originalUrl}`, 404))
}

export { errorHandler, notFound }
