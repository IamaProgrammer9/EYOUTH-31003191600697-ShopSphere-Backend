import express from "express";
import { addToCart } from "../controllers/cart/add.js";
import { viewCartItems } from "../controllers/cart/view.js";
import { removeFromCart } from "../controllers/cart/remove.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();

router.post('/add', authMiddleware, addToCart);
router.get('/', authMiddleware, viewCartItems);
router.delete('/remove', authMiddleware, removeFromCart);

export default router;
