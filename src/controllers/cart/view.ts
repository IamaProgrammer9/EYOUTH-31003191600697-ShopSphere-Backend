import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { getProductRating } from "../products/utils/get-product-rating.js";

export const viewCartItems = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: true
        },
    });
    if (!cart) {
        res.status(404).json("Cart not found");
        return;
    }

    let products = await prisma.product.findMany({
        where: {
            id: {
                in: cart.items.map((item: any) => item.productId)
            }
        },
    });

    const cartItemsWithProducts = await Promise.all(
        cart.items.map(async (cartItem: any) => {
            const product = products.find((p: any) => p.id === cartItem.productId);
            return {
                ...product,
                quantity: cartItem.quantity,
                productId: cartItem.productId,
                rating: await getProductRating(cartItem.productId),
            };
        })
    );
    
    res.json(cartItemsWithProducts);
};
