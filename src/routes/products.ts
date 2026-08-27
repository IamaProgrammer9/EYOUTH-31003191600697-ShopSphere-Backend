import express from "express";
import { createProduct } from "../controllers/products/create-product.js";
import { upload } from "../middleware/upload.js";
import { getCategories } from "../controllers/products/get-categories.js";
import { getProducts } from "../controllers/products/get-products.js";
import getProductData from "../controllers/products/get-product-data.js";
import { deleteProduct } from "../controllers/products/delete-product.js";
import { editProduct } from "../controllers/products/edit-product.js";
import { searchProducts } from "../controllers/products/search-products.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { adminMiddleware } from "../middleware/admin-middleware.js";
import { getFilteredProducts } from "../controllers/products/get-filtered-products.js";

const router = express.Router();

router.post('/add', authMiddleware, adminMiddleware, upload.array('images'), createProduct);
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/product', getProductData);
router.delete('/delete', authMiddleware, adminMiddleware, deleteProduct);
router.put('/edit', authMiddleware, adminMiddleware, editProduct);
router.get('/filtered', getFilteredProducts);

export default router;
