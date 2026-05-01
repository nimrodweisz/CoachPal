import { Router } from 'express'
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/userController.js'
import { verifyJwt } from '../middleware/authMiddleware.js'

const router = Router()

router.route('/').post(createUser)
router.route('/').get(verifyJwt, getUsers)
router
  .route('/:id')
  .get(verifyJwt, getUserById)
  .patch(verifyJwt, updateUser)
  .delete(verifyJwt, deleteUser)

export default router
