import { Router } from 'express'
import {
  createTrainee,
  getTraineeById,
  getTrainees,
} from '../controllers/traineeProfileController.js'
import { verifyJwt } from '../middleware/authMiddleware.js'

const router = Router()

router.use(verifyJwt)

router.route('/').get(getTrainees).post(createTrainee)
router.route('/:id').get(getTraineeById)

export default router
