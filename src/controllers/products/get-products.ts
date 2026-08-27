import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { generateSortQueryFromRequest } from "./utils/sorting.js";
import { getProductRating } from "./utils/get-product-rating.js";

/** Paginated view for accessing products in home page */
export const getProducts = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const take = parseInt(req.query.skip as string) || 16;
    const skip = (page - 1) * take;
    const sort = generateSortQueryFromRequest(req);

    const [products, totalCount] = await prisma.$transaction([
        prisma.product.findMany({
            take,
            skip,
            orderBy: sort,
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
