import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";
import {getUserFromRequest} from "../utils.js";

import authConfig from "../../auth/auth.config.js";

/**
 * Refreshes the user's access token by validating the refresh token, generating a new one, and persisting it.
 *
 * @param {Request} req - The incoming HTTP request object containing user context and cookies.
 * @param {Response} res - The outgoing HTTP response object used to send status codes and headers.
 * @returns {Promise<void>} - Returns a promise that resolves when the token refresh operation completes successfully.
 * @throws {Error} - Throws an error if the user is missing, no refresh token exists, or any other unexpected exception occurs.
 */
export async function refreshTokenController(req: Request, res: Response): Promise<void> {
    try {
        const user = await getUserFromRequest(req);
        const refreshToken = req.cookies.refreshToken;

        if (!user || !refreshToken) {
            res.status(401).send('Refresh token not found');
            return;
        }

        const newAccessToken = jwt.sign(
            { userId: user.id },
            authConfig.secret,
            { expiresIn: authConfig.secret_expires_in as any }
        );

        // Send the new access token in the response
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000,  // 15 minutes
            sameSite: "strict"
        });

        res.send({'detail': 'access token refreshed successfully'});
    } catch {
        res.status(401).send('Something wrong happened');
    }
}

export default refreshTokenController;
