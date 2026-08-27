import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/lib/prisma";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("View cart", () => {
    beforeAll(async () => {
        await prisma.cartItem.deleteMany();
        await prisma.cart.deleteMany();
        await prisma.product.deleteMany();
        await prisma.user.deleteMany();
        await prisma.productCategory.deleteMany();
    });

    it("Successfully views cart items", async () => {
        const imagePath = path.resolve(
            __dirname,
            "../fixtures/sample-image.webp",
        );

        if (!fs.existsSync(imagePath)) {
            throw new Error(`Test image path not found: ${imagePath}`);
        }

        await prisma.productCategory.upsert({
            where: { name: "Technology" },
            update: {},
            create: { name: "Technology" },
        });

        for (const name of ["Admin", "Customer"]) {
            await prisma.userRole.upsert({
                where: { name },
                update: {},
                create: { name },
            });
        }

        const signupRes = await request(app).post("/api/auth/signup").send({
            name: "Test User",
            email: "ihateai@mail.com",
            password: "testpassword",
            isAdmin: true,
        });
        expect(signupRes.statusCode).toBeLessThan(400);

        const agent = request.agent(app);
        const signinRes = await agent.post("/api/auth/signin").send({
            email: "ihateai@mail.com",
            password: "testpassword",
        });
        expect(signinRes.statusCode).toBe(200);

        await agent.post("/api/auth/refresh");

        await agent
          .post("/api/products/add")
          .attach('images', imagePath)
          .field("name", "Test product")
          .field("description", "No description")
          .field("price", "2000")
          .field("categoryName", "Technology");

        const searchRes = await agent.get('/api/products/search').query({
            name: "Test product",
        });
        expect(searchRes.statusCode).toBe(200);
        const productId = searchRes.body[0].id;

        await agent.post('/api/cart/add').send({ productId });

        const cartRes = await agent.get('/api/cart');
        expect(cartRes.statusCode).toBe(200);
        expect(cartRes.body.length).toBe(1);
        expect(cartRes.body[0].id).toBe(productId);
        expect(cartRes.body[0].quantity).toBe(1);
    });

    it("Returns 404 when cart doesn't exist", async () => {
        const signupRes = await request(app).post("/api/auth/signup").send({
            name: "No Cart User",
            email: "nocart@mail.com",
            password: "testpassword",
            isAdmin: false,
        });
        expect(signupRes.statusCode).toBeLessThan(400);

        const agent = request.agent(app);
        await agent.post("/api/auth/signin").send({
            email: "nocart@mail.com",
            password: "testpassword",
        });

        const cartRes = await agent.get('/api/cart');
        expect(cartRes.statusCode).toBe(404);
    });
});