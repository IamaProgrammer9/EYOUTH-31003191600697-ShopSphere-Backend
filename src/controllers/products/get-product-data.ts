import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { getProductRating } from "./utils/get-product-rating.js";

const getProductData = async (req: Request, res: Response) => {
    if (!req.query.id) {
        return res.status(400).json({ error: "id is required" });
    }
    
    const productId = parseInt(req.query.id as string);
    
    try {
        const product = await prisma.product.findUniqueOrThrow({
            where: { id: productId },
        })
        const rating = await getProductRating(product.id);
        return res.json({ ...product, rating });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "product not found" });
        }
        return res.status(500).json({ error: "failed to get product data" });
    }
};

export default getProductData;