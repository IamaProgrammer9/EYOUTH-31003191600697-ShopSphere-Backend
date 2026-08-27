import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const removeFromCart = async (req: Request, res: Response) => {
    const productId = parseInt(req.query.productId as string);
    const userId = (req as any).userId;
    
    const cart = await prisma.cart.findUnique({
        where: {
            userId: userId,
        }
    });

    if (!cart) {
        res.status(404).json("User doesn't have cart");
        return;
    }

    const cartItem = await prisma.cartItem.findUnique({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId: productId,
            },
        }
    });

    if (!cartItem) {
        res.status(404).json("Product not found in cart");
        return;
    }

    await prisma.cartItem.delete({
        where: {
            id: cartItem.id,
        }
    });

    res.status(200).json("Product removed from cart");
};
