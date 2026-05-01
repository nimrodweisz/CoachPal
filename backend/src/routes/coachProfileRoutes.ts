import { Router } from 'express'
import {
  createCoachProfile,
  deleteCoachProfile,
  getCoachProfileById,
  getCoachProfiles,
  updateCoachProfile,
} from '../controllers/coachProfileController.js'

const router = Router()

router.route('/').get(getCoachProfiles).post(createCoachProfile)
router
  .route('/:id')
  .get(getCoachProfileById)
  .patch(updateCoachProfile)
  .delete(deleteCoachProfile)

export default router
