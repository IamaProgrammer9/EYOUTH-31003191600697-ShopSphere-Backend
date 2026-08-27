import app from "../../src/index";
import { prisma } from "../../src/lib/prisma";
import request from "supertest";

describe("Refresh Token", () => {
    beforeAll(async () => {
        await prisma.cartItem.deleteMany();
        await prisma.cart.deleteMany();
        for (const name of ["Admin", "Customer"]) {
            await prisma.userRole.upsert({
                where: { name },
                update: {},
                create: { name },
            });
        }
    });

    it("Should refresh the token correctly", async () => {
        for (const name of ["Admin", "Customer"]) {
            await prisma.userRole.upsert({
                where: { name },
                update: {},
                create: { name },
            });
        }

        try {
            await request(app).post("/api/auth/signup").send({
                email: "ihateai@mail.com",
                password: "testpassword",
            });
        } catch (error) {}
        
        const agent = request.agent(app);
        await agent.post("/api/auth/signin").send({
            email: "ihateai@mail.com",
            password: "testpassword",
        });
        const response = await agent.post("/api/auth/refresh");
        expect(response.statusCode).toBe(200);
    })
});
