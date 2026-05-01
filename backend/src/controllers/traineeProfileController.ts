import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import TraineeProfile from '../models/TraineeProfile.js'

export const getTrainees = async (req: Request, res: Response) => {
  const trainees = await TraineeProfile.find({ coachId: req.user?._id })
    .populate('userId', 'firstName lastName email phone')
    .sort({ createdAt: -1 })

  res.json(trainees)
}

export const createTrainee = async (req: Request, res: Response) => {
  try {
    const {
      email,
      birthDate,
      gender,
      goal,
      status,
      startDate,
      notes,
    } = req.body
    const traineeEmail = String(email).toLowerCase().trim()

    const existingProfile = await TraineeProfile.findOne({ traineeEmail })

    if (existingProfile) {
      res.status(409).json({ message: 'Trainee is already invited' })
      return
    }

    const trainee = await TraineeProfile.create({
      traineeEmail,
      coachId: req.user?._id,
      birthDate,
      gender,
      goal,
      status,
      startDate,
      notes,
    })

    const populatedTrainee = await trainee.populate(
      'userId',
      'firstName lastName email phone',
    )

    res.status(201).json(populatedTrainee)
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: error.message })
      return
    }

    res.status(500).json({ message: 'Could not create trainee' })
  }
}

export const getTraineeById = async (req: Request, res: Response) => {
  const trainee = await TraineeProfile.findOne({
    _id: req.params.id,
    coachId: req.user?._id,
  }).populate('userId', 'firstName lastName email phone')

  if (!trainee) {
    res.status(404).json({ message: 'Trainee not found' })
    return
  }

  res.json(trainee)
}
