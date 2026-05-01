import { Router } from 'express'
import {
  getBodyMeasurementsByTrainee,
  getMyBodyMeasurements,
  updateBodyMeasurementsByTrainee,
} from '../controllers/bodyMeasurementController.js'
import { verifyJwt } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/me', verifyJwt, getMyBodyMeasurements)
router
  .route('/trainee/:traineeId')
  .get(verifyJwt, getBodyMeasurementsByTrainee)
  .patch(verifyJwt, updateBodyMeasurementsByTrainee)

export default router
