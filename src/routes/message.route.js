import express from 'express';
import authenticateAccessToken from '../middleware/authAccessToken.js';
import sendMessage from '../controllers/message/sendMessage.controller.js';

const router = express.Router();

router.post("/send", authenticateAccessToken, sendMessage)

export default router;