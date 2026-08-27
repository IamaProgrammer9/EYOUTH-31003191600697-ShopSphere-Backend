import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/lib/prisma";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Create product", () => {
  beforeAll(async () => {
    // Clean DB tables in correct order (respect foreign keys)
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.productCategory.deleteMany();
  });

  it("Successfully creates a product", async () => {
    const imagePath = path.resolve(__dirname, '../fixtures/sample-image.webp');

    // 1. Verify fixture file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Test image path not found: ${imagePath}`);
    }

    // 2. Seed prerequisites
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

    // 3. Signup user & assert success (Do not wrap in empty catch block!)
    const signupRes = await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "ihateai@mail.com",
      password: "testpassword",
      isAdmin: true,
    });
    expect(signupRes.statusCode).toBeLessThan(400);

    // 4. Authenticate agent session
    const agent = request.agent(app);
    const signinRes = await agent.post("/api/auth/signin").send({
      email: "ihateai@mail.com",
      password: "testpassword",
    });
    expect(signinRes.statusCode).toBe(200);

    await agent.post("/api/auth/refresh");

    // 5. Send request with .attach() FIRST
    const response = await agent
      .post("/api/products/add")
      .attach('images', imagePath)
      .field("name", "Test product")
      .field("description", "No description")
      .field("price", "2000")
      .field("categoryName", "Technology");

    expect(response.statusCode).toBe(201); // Your controller explicitly returns 201
    expect(response.body).toHaveProperty("id");
  });
});