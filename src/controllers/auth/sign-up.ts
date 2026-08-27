import { Request, Response } from 'express';
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import { transporter } from '../../mail/config.js';

/**
 * Handles the user registration process by validating input, checking for existing accounts, and creating a new user record.
 * @param {Request} req - The incoming HTTP request object containing the body with user information.
 * @param {Response} res - The outgoing HTTP response object used to send status codes and JSON data.
 * @returns {Promise<void>} - Returns a promise that resolves when the user creation process is complete.
 * @throws {Error} - Throws an error if the request fails or if a user with the provided email already exists.
 */
export async function signUpController(req: Request, res: Response): Promise<void> {
    const { name, email, password, isAdmin } = req.body;

    // Check if a user with the provided email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        res.status(400).json('Email is already associated with another account');
        return;
    }

    // Hash the password using bcrypt before saving to ensure security
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Get the UserRole model according to the specified isAdmin boolean
    let userRole;
    
    if (isAdmin) {
        userRole = await prisma.userRole.findUnique({ where: { name: 'Admin' } });
    } else {
        userRole = await prisma.userRole.findUnique({ where: { name: 'Customer' } });
    }

    // Create a new user record with the validated and hashed information
    await prisma.user.create({ data: { name, email, password: hashedPassword, role: { connect: { id: userRole!.id } } } });

    // Send a welcome email
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Welcome to NileBridge',
            text: `Hello ${name}, welcome to NileBridge!`
        };

        transporter.sendMail(mailOptions, (error, info) => { });

    } catch (error) {
        console.error('Failed to send welcome email:', error);
    }

    // Send a success response to the client
    res.send({ 'detail': 'User created successfully' });
}

export default signUpController;
