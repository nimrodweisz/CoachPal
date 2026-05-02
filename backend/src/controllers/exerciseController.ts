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
    preview: `/uploads/exercises/${req.file.filename}`,
  })

  res.status(201).json(exercise)
}

export const getExercises = async (_req: Request, res: Response) => {
  const exercises = await Exercise.find().sort({ createdAt: -1 })
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
