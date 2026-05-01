import type { Request, Response } from 'express'
import User from '../models/User.js'

export const createUser = async (req: Request, res: Response) => {
  const user = await User.create(req.body)
  res.status(201).json(user)
}

export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find().sort({ createdAt: -1 })
  res.json(users)
}

export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  res.json(user)
}

export const updateUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  res.json(user)
}

export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    res.status(404).json({ message: 'User not found' })
    return
  }

  res.sendStatus(204)
}
