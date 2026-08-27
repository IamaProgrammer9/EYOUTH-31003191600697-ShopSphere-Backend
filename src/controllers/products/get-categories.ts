import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export const getCategories = async (req: Request, res: Response) => {
    const categories = await prisma.productCategory.findMany();
    res.json(categories);
};
