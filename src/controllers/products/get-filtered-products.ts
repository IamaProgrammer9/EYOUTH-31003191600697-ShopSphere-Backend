import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { getProductRating } from "./utils/get-product-rating.js";

/** Paginated view for accessing products by category in home page */
export const getFilteredProducts = async (req: Request, res: Response) => {
    const categoryId = parseInt(req.query.categoryId as string) || undefined;
    
    const [products, totalCount] = await prisma.$transaction([
        prisma.product.findMany({
            where: { categoryId }
        }),
        prisma.product.count(),
    ])

    const productsWithRating = await Promise.all(
        products.map(async (product: any) => ({
            ...product,
            rating: await getProductRating(product.id),
        }))
    );

    res.json({ data: productsWithRating, count: totalCount })
}
