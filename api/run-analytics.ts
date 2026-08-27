import { PrismaClient } from "@prisma/client";
import { VercelRequest, VercelResponse } from "@vercel/node";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
let prisma: PrismaClient;

function getPrisma() {
    if (!prisma) {
        prisma = globalForPrisma.prisma ?? new PrismaClient();
        globalForPrisma.prisma = prisma;
    }
    return prisma;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
    try {
        const db = getPrisma();
        const productCount = await db.product.count();
        const userCount = await db.user.count();

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
