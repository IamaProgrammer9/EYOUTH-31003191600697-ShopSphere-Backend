import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

/**
 * Handles the logout process by clearing jwt (refresh/access) tokens and returning a success message.
 * @param req - The incoming HTTP request object containing the user session data.
 * @param res - The outgoing HTTP response object used to send status codes and messages back to the client.
 * @returns A promise that resolves when the logout process is complete, or rejects with a 401 status if an error occurs.
 */
export async function logOutController(req: Request, res: Response): Promise<void> {
    try {
        const userId = (req as any).userId;
        if (userId) {
            await prisma.user.update({
                where: { id: userId },
                data: { refreshToken: null }
            })
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.send('logged out successfully');
    } catch (error: any) {
        console.log(error);
        res.status(401).send('Something wrong happened')
    }
}

export default logOutController;
