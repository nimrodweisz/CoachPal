import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'

export const createUser = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email })

    if (existingUser) {
      res.status(409).json({ message: 'Email is already registered' })
      return
    }

    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: error.message })
      return
    }

    res.status(500).json({ message: 'Could not create user' })
  }
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
