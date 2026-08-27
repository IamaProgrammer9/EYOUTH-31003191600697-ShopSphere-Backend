import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/lib/prisma";

describe("POST /auth/signin", () => {
    beforeAll(async () => {
      // Wipe test table before each test
      await prisma.cartItem.deleteMany();
      await prisma.cart.deleteMany();
      await prisma.user.deleteMany();
    });
    
    it("should sign in the user", async () => {
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

        const response = await request(app).post("/api/auth/signin").send({
            email: "ihateai@mail.com",
            password: "testpassword",
        });
        expect(response.statusCode).toBe(200);
    });
});
