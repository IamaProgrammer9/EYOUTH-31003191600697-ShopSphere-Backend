import {Request} from "express";
import {prisma} from "../lib/prisma.js";

export async function getUserFromRequest(req: Request): Promise<{
    id: number
    email: string
    name: string
    password: string
    refreshToken: string | null,
    roleId: number,
} | null> {
    return prisma.user.findUnique({where: {id: (req as any).userId}});
}