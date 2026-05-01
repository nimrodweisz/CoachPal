import { Router } from 'express'
import { getMyBodyMeasurements } from '../controllers/bodyMeasurementController.js'
import { verifyJwt } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/me', verifyJwt, getMyBodyMeasurements)

export default router
