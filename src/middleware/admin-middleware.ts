import { Request, Response, NextFunction } from "express";
import { getUserFromRequest } from "../controllers/utils.js";
import { prisma } from "../lib/prisma.js";

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user = await getUserFromRequest(req);
    if (!user) {
        res.status(401).send("Unauthorized");
        return;
    }

    try {
        const role = await prisma.userRole.findUniqueOrThrow({ where: { id: user.roleId } })
        if (role.name !== "Admin") {
            res.status(403).send("Forbidden");
            return;
        }
    } catch (error) {
        res.status(403).send("Forbidden");
        return;
    }

    next();
};
