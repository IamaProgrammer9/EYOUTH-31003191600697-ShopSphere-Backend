import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/lib/prisma";

describe("POST /auth/sign-up", () => {
    beforeEach(async () => {
      // Wipe test table before each test
      await prisma.cartItem.deleteMany();
      await prisma.cart.deleteMany();
      await prisma.user.deleteMany();
    });
    
    beforeAll(async () => {
        for (const name of ["Admin", "Customer"]) {
            await prisma.userRole.upsert({
                where: { name },
                update: {},
                create: { name },
            });
        }
    });
    
    it("should sign up the user", async () => {
        const response = await request(app).post("/api/auth/signup").send({
            email: "ihateai@mail.com",
            password: "testpassword",
            name: "Omar Mohamed",
            isAdmin: true,
        });
        expect(response.statusCode).toBe(200);
    });

    afterAll(async () => {
      // Disconnect Prisma client when done
      await prisma.$disconnect();
    });
});
