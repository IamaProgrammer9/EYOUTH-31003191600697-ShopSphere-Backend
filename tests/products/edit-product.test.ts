import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/lib/prisma";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Edit product", () => {
  beforeAll(async () => {
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.productCategory.deleteMany();
  });

  it("Successfully edits a product", async () => {
    const imagePath = path.resolve(__dirname, '../fixtures/sample-image.webp');

    if (!fs.existsSync(imagePath)) {
      throw new Error(`Test image path not found: ${imagePath}`);
    }

    await prisma.productCategory.upsert({
      where: { name: "Technology" },
      update: {},
      create: { name: "Technology" },
    });

    await prisma.productCategory.upsert({
      where: { name: "Electronics" },
      update: {},
      create: { name: "Electronics" },
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

    const createRes = await agent
      .post("/api/products/add")
      .attach('images', imagePath)
      .field("name", "Product to edit")
      .field("description", "Will be edited")
      .field("price", "1500")
      .field("categoryName", "Technology");
    expect(createRes.statusCode).toBe(201);

    const productId = createRes.body.id;

    const newCategory = await prisma.productCategory.findUnique({ where: { name: "Electronics" } });

    const editRes = await agent
      .put(`/api/products/edit?id=${productId}`)
      .send({
        name: "Updated Product",
        description: "Updated description",
        price: 2500,
        categoryId: newCategory!.id,
      });
    expect(editRes.statusCode).toBe(200);

    const updatedProduct = await prisma.product.findUnique({ where: { id: productId } });
    expect(updatedProduct).not.toBeNull();
    expect(updatedProduct!.name).toBe("Updated Product");
    expect(updatedProduct!.description).toBe("Updated description");
    expect(updatedProduct!.price).toBe(2500);
    expect(updatedProduct!.categoryId).toBe(newCategory!.id);
  });

  it("Returns 400 when id is missing", async () => {
    const agent = request.agent(app);
    await agent.post("/api/auth/signin").send({
      email: "ihateai@mail.com",
      password: "testpassword",
    });
    await agent.post("/api/auth/refresh");

    const editRes = await agent
      .put("/api/products/edit")
      .send({ name: "Should fail" });
    expect(editRes.statusCode).toBe(400);
  });
});