import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const createProduct = async (req: Request, res: Response) => {
    const images = req.files as Express.Multer.File[];
    const { name, description, price, categoryName } = req.body;
    
    let category: {
        name: string;
        id: number;
    } | null
    
    try {
        category = await prisma.productCategory.findUnique({
            where: { name: (categoryName as string) }
        });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to find category" });
    }

    try {
        
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                category: { connect: { id: category?.id } },
                imagesUrl: images.map((image) => image.path),
            },
        });
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create product" });
    }
};
