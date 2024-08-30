import express from 'express'
import { deleteUser, followUser, getAllUsers, getUser, unfollowUser, updateUser,getSearch } from '../controllers/userController.js'
import authMiddleWare from '../middlewares/authMiddleware.js';

const router = express.Router()

router.get('/:id', getUser);
router.get('/search/:userId/:query', getSearch);
router.get('/',getAllUsers)
router.put('/:id',authMiddleWare, updateUser)
router.delete('/:id',authMiddleWare, deleteUser)
router.put('/:id/follow',authMiddleWare, followUser)
router.put('/:id/unfollow',authMiddleWare, unfollowUser)

export default router