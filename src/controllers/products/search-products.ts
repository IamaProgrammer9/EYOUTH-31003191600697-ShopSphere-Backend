import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { generateSortQueryFromRequest } from "./utils/sorting.js";
import { getProductRating } from "./utils/get-product-rating.js";

export const searchProducts = async (req: Request, res: Response) => {
    const { search } = req.query;
    const sort = generateSortQueryFromRequest(req);
    
    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: search as string, mode: 'insensitive',
            },
        },
        orderBy: sort,
    });

    const productsWithRating = await Promise.all(
        products.map(async (product: any) => ({
            ...product,
            rating: await getProductRating(product.id),
        }))
    );

    res.json(productsWithRating);
}