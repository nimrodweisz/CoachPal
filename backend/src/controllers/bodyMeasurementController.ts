import type { Request, Response } from 'express'
import BodyMeasurement from '../models/BodyMeasurement.js'
import TraineeProfile from '../models/TraineeProfile.js'

const toDateKey = (value: Date | string) => {
  return new Date(value).toISOString().slice(0, 10)
}

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

export const getBodyMeasurementsByTrainee = async (
  req: Request,
  res: Response,
) => {
  const traineeProfile = await TraineeProfile.findOne({
    _id: req.params.traineeId,
    coachId: req.user?._id,
  })

  if (!traineeProfile) {
    res.status(404).json({ message: 'Trainee profile not found' })
    return
  }

  const measurements = await BodyMeasurement.findOne({
    traineeId: traineeProfile._id,
    coachId: req.user?._id,
  })

  res.json({ measurements })
}

export const updateBodyMeasurementsByTrainee = async (
  req: Request,
  res: Response,
) => {
  const traineeProfile = await TraineeProfile.findOne({
    _id: req.params.traineeId,
    coachId: req.user?._id,
  })

  if (!traineeProfile) {
    res.status(404).json({ message: 'Trainee profile not found' })
    return
  }

  const appendableFields = [
    'weight',
    'bodyFatPercentage',
    'chest',
    'waist',
    'hip',
    'thigh',
    'arm',
  ] as const
  const valuesToSave: Partial<Record<(typeof appendableFields)[number], number>> =
    {}

  for (const field of appendableFields) {
    const value = req.body[field]

    if (value !== undefined && value !== null && value !== '') {
      valuesToSave[field] = Number(value)
    }
  }

  const reportDate = new Date(req.body.date ?? new Date())
  const reportDateKey = toDateKey(reportDate)
  const measurements =
    (await BodyMeasurement.findOne({
      traineeId: traineeProfile._id,
      coachId: req.user?._id,
    })) ??
    new BodyMeasurement({
      traineeId: traineeProfile._id,
      coachId: req.user?._id,
      measurementDates: [],
      date: reportDate,
    })

  measurements.date = reportDate

  if (req.body.height !== undefined && req.body.height !== '') {
    measurements.height = Number(req.body.height)
  }

  if (req.body.notes !== undefined) {
    measurements.notes = req.body.notes
  }

  const measurementDates = (measurements.get('measurementDates') ??
    []) as Date[]
  let reportIndex = measurementDates.findIndex(
    (measurementDate) => toDateKey(measurementDate) === reportDateKey,
  )

  if (reportIndex === -1) {
    measurementDates.push(reportDate)
    reportIndex = measurementDates.length - 1
  } else {
    measurementDates[reportIndex] = reportDate
  }

  measurements.set('measurementDates', measurementDates)

  for (const [field, value] of Object.entries(valuesToSave)) {
    const currentValues =
      (measurements[field as keyof typeof valuesToSave] as number[] | undefined) ??
      []
    currentValues[reportIndex] = value
    measurements.set(field, currentValues)
  }

  await measurements.save()

  res.json(measurements)
}
