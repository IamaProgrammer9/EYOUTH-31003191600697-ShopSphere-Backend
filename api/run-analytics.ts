import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export default async function handler(req: Request, res: Response) {
    try {
        const productCount = await prisma.product.count();
        const userCount = await prisma.user.count();

        console.log(`[Vercel Serverless Task Executed] Total Amount of Products: ${productCount}`);
        console.log(`[Vercel Serverless Task Executed] Total Amount of Users: ${userCount}`);

        return res.status(200).json({
            success: true,
            message: 'Background task executed successfuly',
            metrics: { totalProducts: productCount, totalUsers: userCount },
            timestamp: new Date().toISOString(),
        })
    } catch {
        return res.status(500).json({error: 'Failed to run serverless function'});
    }
}
