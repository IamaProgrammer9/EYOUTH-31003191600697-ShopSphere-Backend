import { NextFunction, Request, Response } from "express";
import authConfig from "../auth/auth.config.js";
import jwt from "jsonwebtoken";

/** Middleware to validate the refresh token and attach user information to the request object */
export function refreshTokenValidation(req: Request, res: Response, next: NextFunction) {
    // 1. Extract the refresh token from the HttpOnly cookie
    const refreshToken = req.cookies.refreshToken;

    // If there's no refresh token, return an error
    if (!refreshToken) {
        return res.status(401).send("No refresh token provided");
    }

    try {
        // 2. Verify the refresh token using the secret from the auth config
        const decodedToken = jwt.verify(refreshToken, authConfig.refresh_secret) as { userId: number };

        // If the token is valid, attach user information to the request object
        (req as any).userId = decodedToken.userId;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle token verification errors (invalid or expired token)
        console.error("Refresh Token authentication failed:", error);

        // Return a 401 Unauthorized with a more specific message
        return res.status(401).send("Invalid or expired refresh token");
        
    }
};
