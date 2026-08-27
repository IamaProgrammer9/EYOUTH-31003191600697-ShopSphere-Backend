import express from "express";
import {signInController} from "../controllers/auth/sign-in.js";
import signUpController from "../controllers/auth/sign-up.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import logOutController from "../controllers/auth/log-out.js";
import {isAuth} from "../controllers/auth/is-auth.js";
import refreshTokenController from "../controllers/auth/refresh-token.js";
import { refreshTokenValidation } from "../middleware/refresh-middleware.js";

const router = express.Router();

router.use(express.json());
router.get('/', authMiddleware, isAuth);
router.post('/signin', signInController);
router.post('/signup', signUpController);
router.post('/refresh', refreshTokenValidation, refreshTokenController);
router.post('/logout', authMiddleware, logOutController);

export default router;
