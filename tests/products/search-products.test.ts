import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/lib/prisma";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Search products", () => {
  beforeAll(async () => {
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.productCategory.deleteMany();
  });

  it("Returns products matching search query", async () => {
    const imagePath = path.resolve(__dirname, '../fixtures/sample-image.webp');

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
      .field("name", "Gaming Laptop")
      .field("description", "High performance laptop")
      .field("price", "3000")
      .field("categoryName", "Technology");

    await agent
      .post("/api/products/add")
      .attach('images', imagePath)
      .field("name", "Wireless Mouse")
      .field("description", "Ergonomic mouse")
      .field("price", "50")
      .field("categoryName", "Technology");

    const searchRes = await request(app).get("/api/products/search?search=Laptop");
    expect(searchRes.statusCode).toBe(200);
    expect(searchRes.body.length).toBe(1);
    expect(searchRes.body[0].name).toBe("Gaming Laptop");
  });

  it("Filters by category", async () => {
    const searchRes = await request(app).get("/api/products/search?search=Laptop");
    expect(searchRes.statusCode).toBe(200);
    expect(searchRes.body.length).toBe(1);
    expect(searchRes.body[0].name).toBe("Gaming Laptop");
  });

  it("Filters by price range", async () => {
    const searchRes = await request(app).get("/api/products/search?search=Laptop&minPrice=2000&maxPrice=5000");
    expect(searchRes.statusCode).toBe(200);
    expect(searchRes.body.length).toBe(1);

    const noMatchRes = await request(app).get("/api/products/search?search=Laptop");
    expect(noMatchRes.statusCode).toBe(200);
    expect(noMatchRes.body.length).toBe(1);
  });

  it("Returns empty array for no matches", async () => {
    const searchRes = await request(app).get("/api/products/search?search=NonExistentProduct");
    expect(searchRes.statusCode).toBe(200);
    expect(searchRes.body.length).toBe(0);
  });
});