import { prisma} from "../../lib/prisma.js";
import { Request, Response } from "express";
import { authConfig } from "../../auth/auth.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Handles user sign-in logic by attempting to find a user based on email and password.
 * @param req The Express request object, expected to contain {email: string, password: string} in the body.
 * @param res The Express response object to send the result back to the client.
 * @returns {void} Sends a 401 status if credentials do not match, otherwise the function completes (implying successful validation).
 */
export async function signInController(req: Request, res: Response): Promise<void> {
    const {email, password} = req.body ?? {};

    if (!email || !password) {
        res.status(400).json('Email and password are required');
        return;
    }

    // Fetch the user record from Prisma using the provided email
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    });

    // If no user is found with the provided credentials, return an error response
    if (!user) {
        res.status(401).json('Invalid credentials');
        return;
    }

    // Compare the provided password with the stored user password using bcryptjs
    const userPassword = user.password;
    const passwordMatch = await bcrypt.compare(password, userPassword);

    // If the password does not match, return an error response
    if (!passwordMatch) {
        res.status(401).json('Invalid credentials');
        return;
    }

    // Generate a JWT access token with user ID and expiration based on config settings
    const accessToken = jwt.sign(
        {userId: user.id},
        authConfig.secret,  // Use the secret from the authConfig for signing the access token
        {expiresIn: authConfig.secret_expires_in as any}  // Use the expiration time from the config (e.g., "15m")
    );

    // Generate a JWT refresh token with user ID and expiration based on config settings
    const refreshToken = jwt.sign(
        {userId: user.id,},
        authConfig.refresh_secret,  // Use the separate secret for signing the refresh token
        {expiresIn: authConfig.refresh_secret_expires_in as any}  // Use the expiration time for the refresh token (e.g., "24h")
    );

    // Update the user's refresh token in the database if one exists, otherwise leave it null
    await prisma.user.update({
        where: {email},
        data: {refreshToken}
    });

    // Set the access token cookie with appropriate security headers and expiration time
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "strict"
    });

    // Set the refresh token cookie with appropriate security headers and expiration time
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict"
    });

    // Send a success message to the client indicating authentication was successful
    res.send('authenticated successfully');
}

export default signInController;
