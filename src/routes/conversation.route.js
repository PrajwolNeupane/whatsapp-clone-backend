import express from 'express';
import authenticateAccessToken from '../middleware/authAccessToken.js';
import getAllConversation from '../controllers/conversation/getAllConversation.controller.js';
import createConversation from '../controllers/conversation/createConversation.controller.js';
import getConversation from '../controllers/conversation/getConvesation.controller.js';

const router = express.Router();

router.get("/", authenticateAccessToken, getAllConversation);
router.post("/create", authenticateAccessToken, createConversation);
router.get("/:id", authenticateAccessToken, getConversation);
export default router;