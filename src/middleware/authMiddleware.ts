import jwt, { type JwtPayload } from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import type { NextFunction, Request, RequestHandler, Response } from "express"
import type { ProtectedRequest } from "../types/app-request.d.js"
import { AppError } from "../utils/AppError.js"

export const protect: RequestHandler = asyncHandler(async (req: ProtectedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt

  if(!token) throw new AppError("Not authorized, no token", 401)
  
  if(!process.env.JWT_SECRET) throw new AppError("JWT secret not configured", 500)

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload

  req.user = await User.findById(decoded.userId).select("-password")
  next()
})

