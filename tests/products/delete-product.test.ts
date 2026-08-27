import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/lib/prisma";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Delete product", () => {
  beforeAll(async () => {
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.productCategory.deleteMany();
  });

  it("Successfully deletes a product", async () => {
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

    // Create a product first so we have something to delete
    const createRes = await agent
      .post("/api/products/add")
      .attach('images', imagePath)
      .field("name", "Product to delete")
      .field("description", "Will be deleted")
      .field("price", "1500")
      .field("categoryName", "Technology");
    expect(createRes.statusCode).toBe(201);

    const productId = createRes.body.id;

    // Delete the product
    const deleteRes = await agent.delete(`/api/products/delete?id=${productId}`);
    expect(deleteRes.statusCode).toBe(204);

    // Verify it's gone
    const product = await prisma.product.findUnique({ where: { id: productId } });
    expect(product).toBeNull();
  });
});
