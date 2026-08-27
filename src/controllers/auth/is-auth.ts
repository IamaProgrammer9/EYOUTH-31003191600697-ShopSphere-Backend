import { Request, Response } from "express";
import { getUserFromRequest } from "../utils.js";
import { prisma } from "../../lib/prisma.js";

/**
 * Checks if the current request is authenticated and returns user details.
 * @param {Request} req - The Express request object containing authentication data.
 * @res {Object} Sends a JSON object with the user's id and name on success.
 * @error {401} Triggered if the user is not authenticated or missing from request.
 */
export const isAuth = async (req: Request, res: Response) => {
    const user = await getUserFromRequest(req);
    if (!user) {
        res.status(401).send('Not authenticated');
        return;
    }
    
    let isAdmin: boolean;
    const userRole = await prisma.userRole.findUniqueOrThrow({ where: { id: user.roleId } });
    
    res.send({
        id: user.id,
        name: user.name,
        isAdmin: userRole.name == 'Admin',
    })
};
