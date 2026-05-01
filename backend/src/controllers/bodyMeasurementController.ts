import type { Request, Response } from 'express'
import BodyMeasurement from '../models/BodyMeasurement.js'
import TraineeProfile from '../models/TraineeProfile.js'

export const getMyBodyMeasurements = async (req: Request, res: Response) => {
  const traineeProfile = await TraineeProfile.findOne({ userId: req.user?._id })

  if (!traineeProfile) {
    res.status(404).json({ message: 'Trainee profile not found' })
    return
  }

  const measurements = await BodyMeasurement.findOne({
    traineeId: traineeProfile._id,
  })

  res.json({
    traineeProfile,
    measurements,
  })
}
