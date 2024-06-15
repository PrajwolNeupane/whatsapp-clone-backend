import express from 'express';
import signup from '../controllers/auth/signup.controller.js';
import authorize from '../controllers/auth/authorize.controller.js';
import authAccessToken from '../middleware/authAccessToken.js';
import authRefreshToken from '../middleware/authRefreshToken.js';
import refreshToken from '../controllers/auth/refreshToken.controller.js';
import login from '../controllers/auth/login.controller.js';
import googleAuth from '../controllers/auth/googleAuth.controller.js';
import multer from 'multer';
import updateProfile from '../controllers/auth/updateProfile.controller.js';
import searchUsers from '../controllers/auth/searchUsers.controller.js';


const router = express.Router();
//Upload Middleware
const upload = multer().single('image');

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.get("/", authAccessToken, authorize)
router.post("/update", [authAccessToken, upload], updateProfile)
router.get("/refresh", authRefreshToken, refreshToken);
router.get("/users", authAccessToken, searchUsers)

export default router;