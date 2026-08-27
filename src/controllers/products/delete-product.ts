import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.query;
    
    if (!id) {
        return res.sendStatus(400);
    }
    
    const productId = Number(id);
    
    await prisma.$transaction([
        prisma.cartItem.deleteMany({ where: { productId } }),
        prisma.product.delete({ where: { id: productId } }),
    ]);
    
    res.sendStatus(204);
};
