import { prisma } from "../../../lib/prisma.js";

export async function getProductRating(productId: number): Promise<number> {
    let rating = 0;

    // // Check if the product exists
    // const product = await prisma.product.findUnique({
    //     where: { id: productId },
    // });

    // if (!product) return rating;

    // // Find all reviews
    // const reviews = await prisma.productReview.findMany({
    //     where: { productId },
    //     select: { rating: true },
    // });

    // const values = reviews.map((r: { rating: number }) => r.rating);
    // const count = values.length;

    // if (count) {
    //     const mid = Math.floor(count / 2);
    //     const median =
    //         count % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
    //     rating = median;
    // }

    return rating;
}
