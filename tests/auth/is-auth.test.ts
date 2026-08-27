import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/lib/prisma";

describe("GET /auth", () => {
    beforeAll(async () => {
      await prisma.cartItem.deleteMany();
      await prisma.cart.deleteMany();
      await prisma.user.deleteMany();
    });

    it("should return authenticated user", async () => {
        for (const name of ["Admin", "Customer"]) {
            await prisma.userRole.upsert({
                where: { name },
                update: {},
                create: { name },
            });
        }

        try {
            await request(app).post("/api/auth/signup").send({
                name: "Test User",
                email: "ihateai@mail.com",
                password: "testpassword",
                isAdmin: false,
            });
        } catch (error) {}

        const agent = request.agent(app);

        await agent.post("/api/auth/signin").send({
            email: "ihateai@mail.com",
            password: "testpassword",
        });

        const response = await agent.get("/api/auth");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: "Test User",
                isAdmin: false,
            })
        );
    });
});
