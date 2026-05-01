import { Router } from 'express'
import {
  createCoachProfile,
  deleteCoachProfile,
  getCoachProfileById,
  getCoachProfiles,
  updateCoachProfile,
} from '../controllers/coachProfileController.js'
import { verifyJwt } from '../middleware/authMiddleware.js'

const router = Router()

router.route('/').post(createCoachProfile)
router.route('/').get(verifyJwt, getCoachProfiles)
router
  .route('/:id')
  .get(verifyJwt, getCoachProfileById)
  .patch(verifyJwt, updateCoachProfile)
  .delete(verifyJwt, deleteCoachProfile)

export default router
