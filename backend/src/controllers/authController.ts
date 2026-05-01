import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email?: string
    password?: string
  }

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' })
    return
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    '+password',
  )

  if (!user || user.password !== password) {
    res.status(401).json({ message: 'Invalid email or password' })
    return
  }

  if (!user.isActive) {
    res.status(403).json({ message: 'User is inactive' })
    return
  }

  const { password: _password, ...userData } = user.toObject()
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    res.status(500).json({ message: 'JWT_SECRET is missing' })
    return
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    jwtSecret,
    { expiresIn: '7d' },
  )

  res.json({ user: userData, token })
}
