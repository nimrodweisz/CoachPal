import { Router } from 'express'
import {
  createExercise,
  getExerciseById,
  getExercises,
} from '../controllers/exerciseController.js'
import { verifyJwt } from '../middleware/authMiddleware.js'
import { uploadExercisePreview } from '../middleware/uploadMiddleware.js'

const router = Router()

router
  .route('/')
  .get(verifyJwt, getExercises)
  .post(verifyJwt, uploadExercisePreview, createExercise)
router.route('/:id').get(verifyJwt, getExerciseById)

export default router
