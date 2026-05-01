import type { Request, Response } from 'express'
import mongoose from 'mongoose'
import CoachProfile from '../models/CoachProfile.js'

export const createCoachProfile = async (req: Request, res: Response) => {
  try {
    const coachProfile = await CoachProfile.create(req.body)
    res.status(201).json(coachProfile)
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: error.message })
      return
    }

    res.status(500).json({ message: 'Could not create coach profile' })
  }
}

export const getCoachProfiles = async (_req: Request, res: Response) => {
  const coachProfiles = await CoachProfile.find()
    .populate('userId')
    .sort({ createdAt: -1 })

  res.json(coachProfiles)
}

export const getCoachProfileById = async (req: Request, res: Response) => {
  const coachProfile = await CoachProfile.findById(req.params.id).populate(
    'userId',
  )

  if (!coachProfile) {
    res.status(404).json({ message: 'Coach profile not found' })
    return
  }

  res.json(coachProfile)
}

export const updateCoachProfile = async (req: Request, res: Response) => {
  const coachProfile = await CoachProfile.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )

  if (!coachProfile) {
    res.status(404).json({ message: 'Coach profile not found' })
    return
  }

  res.json(coachProfile)
}

export const deleteCoachProfile = async (req: Request, res: Response) => {
  const coachProfile = await CoachProfile.findByIdAndDelete(req.params.id)

  if (!coachProfile) {
    res.status(404).json({ message: 'Coach profile not found' })
    return
  }

  res.sendStatus(204)
}
