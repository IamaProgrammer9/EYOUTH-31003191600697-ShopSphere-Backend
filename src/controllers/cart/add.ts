import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const addToCart = async (req: Request, res: Response) => {
    const productId = parseInt(req.body.productId as string);
    const userId = (req as any).userId;

    // Check if the user already has a cart, create if not
    let cart = await prisma.cart.findUnique({
        where: { userId },
    });

    if (!cart) {
        try {
            cart = await prisma.cart.create({
                data: { 
                    user: { connect: { id: userId } }
                },
            });
        } catch {
            res.status(500).json("Failed to create cart");
            return;
        }
    }

    if (!cart) {
        res.status(500).json("Failed to create cart");
        return;
    }

    // Add the product to the cart
    try {
        await prisma.cartItem.create({
            data: {
                product: { connect: { id: productId } },
                cart: { connect: { id: cart.id } },
                quantity: 1,
            }
        })
    } catch (err) {
        res.status(500).json("Failed to add product to cart");
        return;
    }

    res.status(200).json("Product added to cart");
};
