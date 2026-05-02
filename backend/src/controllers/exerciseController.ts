import type { Request, Response } from 'express'
import Exercise from '../models/Exercise.js'

export const createExercise = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: 'Preview image is required' })
    return
  }

  const exercise = await Exercise.create({
    name: req.body.name,
    muscleGroup: req.body.muscleGroup,
    preview: {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    },
  })
  const preview = exercise.preview

  if (!preview) {
    res.status(500).json({ message: 'Preview image was not saved' })
    return
  }

  res.status(201).json({
    _id: exercise._id,
    createdAt: exercise.createdAt,
    muscleGroup: exercise.muscleGroup,
    name: exercise.name,
    previewContentType: preview.contentType,
    previewUrl: `/api/exercises/${exercise._id.toString()}/preview`,
    updatedAt: exercise.updatedAt,
  })
}

export const getExercises = async (_req: Request, res: Response) => {
  const exercises = await Exercise.find()
    .select('-preview.data')
    .sort({ createdAt: -1 })
  res.json(exercises)
}

export const getExerciseById = async (req: Request, res: Response) => {
  const exercise = await Exercise.findById(req.params.id)

  if (!exercise) {
    res.status(404).json({ message: 'Exercise not found' })
    return
  }

  res.json(exercise)
}

export const getExercisePreview = async (req: Request, res: Response) => {
  const exercise = await Exercise.findById(req.params.id).select('preview')

  if (!exercise) {
    res.status(404).json({ message: 'Exercise not found' })
    return
  }

  if (!exercise.preview) {
    res.status(404).json({ message: 'Exercise preview not found' })
    return
  }

  res.contentType(exercise.preview.contentType)
  res.send(exercise.preview.data)
}
