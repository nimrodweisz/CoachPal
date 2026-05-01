import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import TraineeProfile from '../models/TraineeProfile.js'
import User from '../models/User.js'

export const createUser = async (req: Request, res: Response) => {
  try {
    const email =
      typeof req.body.email === 'string'
        ? req.body.email.toLowerCase().trim()
        : req.body.email
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      res.status(409).json({ message: 'Email is already registered' })
      return
    }

    if (req.body.role === 'Trainee') {
      const traineeProfile = await TraineeProfile.findOne({
        traineeEmail: email,
      })

      if (!traineeProfile) {
        res.status(403).json({
          message: 'A coach must add your trainee profile before you sign up',
        })
        return
      }

      if (traineeProfile.userId) {
        res.status(409).json({ message: 'Trainee profile is already claimed' })
        return
      }
    }

    const user = await User.create({
      ...req.body,
      email,
    })

    if (req.body.role === 'Trainee') {
      await TraineeProfile.findOneAndUpdate(
        { traineeEmail: email },
        { userId: user._id },
        { runValidators: true },
      )
    }

    res.status(201).json(user)
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: error.message })
      return
    }

    if ((error as { code?: number }).code === 11000) {
      res.status(409).json({ message: 'Email is already registered' })
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
