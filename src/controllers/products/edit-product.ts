import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const editProduct = async (req: Request, res: Response) => {
    const { id } = req.query;
    const { name, description, price, categoryId } = req.body;
    
    if (!id) {
        return res.sendStatus(400);
    }

    const data: Record<string, any> = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = price;
    if (categoryId !== undefined) data.categoryId = categoryId;
    
    await prisma.product.update({
        where: { id: Number(id) },
        data,
    });
    
    res.status(200).json('Product updated successfully');
}
