import type { NextFunction, Request, Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import User from '../models/User.js'

type AuthenticatedUser = {
  _id: unknown
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'Coach'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}

type TokenPayload = JwtPayload & {
  userId?: string
}

export const verifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization token is required' })
    return
  }

  const token = authHeader.replace('Bearer ', '').trim()
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    res.status(500).json({ message: 'JWT_SECRET is missing' })
    return
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload

    if (!decoded.userId) {
      res.status(401).json({ message: 'Invalid token' })
      return
    }

    const user = await User.findById(decoded.userId).select('-password').lean()

    if (!user || !user.isActive) {
      res.status(401).json({ message: 'User is not authorized' })
      return
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
