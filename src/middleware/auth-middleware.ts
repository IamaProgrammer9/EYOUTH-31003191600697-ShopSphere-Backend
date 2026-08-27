import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import authConfig from "../auth/auth.config.js";

export interface DecodedToken {
    userId: number;
}

/**
 * Handles authentication by verifying the access token from cookies.
 * Validates the JWT signature and extracts user ID information.
 * Returns a 401 status with 'Unauthorized' message if the token is missing or invalid.
 * @param {Request} req - The incoming HTTP request object.
 * @param {Response} res - The outgoing HTTP response object.
 * @param {NextFunction} next - The middleware function to proceed after successful authentication or error handling.
 * @returns {Response} The response object containing the status code and message if authentication fails or is missing.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;

    if (!token || !req.path.startsWith('/')) {
        res.status(401).send('Unauthorized');
        return;
    }

    try {
        const decoded = jwt.verify(token, authConfig.secret) as DecodedToken;
        (req as any).userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).send('Access token is not valid');
    }
};
