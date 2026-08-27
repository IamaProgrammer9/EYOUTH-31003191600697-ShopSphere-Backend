import { prisma } from "../../lib/prisma.js";
import { Request, Response } from "express";

/** Health-endpoint that checks that the backend server and database is working properly as well as as other microservices of the application and the serverless function */
export async function HealthController(req: Request, res: Response) {
    // Checking that the PostgreSQL server is working
    try {
        // Executes a lightweight query to verify active DB connection
        await prisma.$queryRaw`SELECT 1`;
        
        return res.status(200).json({
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        
        return res.status(500).json({
        status: 'error',
        database: 'disconnected',
        message: error instanceof Error ? error.message : 'Unknown database error'
        });
    }
}
