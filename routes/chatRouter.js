import express from 'express'
import { createChat, findChat, userChats, userListChats, findReceiver } from '../controllers/chatController.js'
const router = express.Router()

router.post('/', createChat);
router.get('/:userId', userChats);
router.get('/user/:userId', userListChats);
router.get('/find/:firstId/:secondId', findChat);
router.get('/receiver/:chatId/:receiverId', findReceiver);

export default router