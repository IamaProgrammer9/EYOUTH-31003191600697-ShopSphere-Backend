import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient({
    datasources: {
        db: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL },
    },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedImagesDir = path.resolve(__dirname, "seed-images");
const uploadsDir = path.resolve(__dirname, "../public/");

const categories = [
    { name: "Technology" },
    { name: "Home appliances" },
    { name: "Food" },
];

const technologyProducts = [
    { name: "MacBook Air M2", price: 1099, description: "Apple MacBook Air with M2 chip, 13.6-inch Liquid Retina display, 8GB RAM, 256GB SSD." },
    { name: "MacBook Pro 14-inch", price: 1999, description: "Apple MacBook Pro 14-inch with M3 Pro chip, 18GB RAM, 512GB SSD." },
    { name: "MacBook Air M3", price: 1199, description: "Apple MacBook Air with M3 chip, 15.3-inch Liquid Retina display, 16GB RAM, 512GB SSD." },
    { name: "MacBook Pro 16-inch", price: 2499, description: "Apple MacBook Pro 16-inch with M3 Max chip, 36GB RAM, 1TB SSD." },
    { name: "Dell XPS 15", price: 1299, description: "Dell XPS 15 with Intel Core i7, 16GB RAM, 512GB SSD, OLED display." },
    { name: "ThinkPad X1 Carbon", price: 1449, description: "Lenovo ThinkPad X1 Carbon Gen 11, Intel Core i7, 16GB RAM, 512GB SSD." },
    { name: "HP Spectre x360", price: 1349, description: "HP Spectre x360 2-in-1 laptop, Intel Core i7, 16GB RAM, 1TB SSD." },
    { name: "ASUS ROG Zephyrus", price: 1799, description: "ASUS ROG Zephyrus G16 gaming laptop, RTX 4070, 16GB RAM, 1TB SSD." },
    { name: "iPad Pro 12.9-inch", price: 1099, description: "Apple iPad Pro 12.9-inch with M2 chip, 256GB, Wi-Fi." },
    { name: "Samsung Galaxy Tab S9", price: 849, description: "Samsung Galaxy Tab S9 Ultra, 14.6-inch AMOLED, 256GB, S Pen included." },
    { name: "Apple Watch Series 9", price: 399, description: "Apple Watch Series 9 with GPS, 45mm, Always-On Retina display." },
    { name: "Samsung Galaxy Watch 6", price: 329, description: "Samsung Galaxy Watch 6 Classic, 47mm, rotating bezel, Wear OS." },
    { name: "Sony WH-1000XM5", price: 349, description: "Sony wireless noise-canceling headphones with 30-hour battery life." },
    { name: "AirPods Pro 2", price: 249, description: "Apple AirPods Pro 2nd generation with USB-C, active noise cancellation." },
    { name: "Bose QuietComfort Ultra", price: 429, description: "Bose QuietComfort Ultra headphones with spatial audio and noise cancellation." },
    { name: "LG UltraGear 27-inch", price: 499, description: "LG UltraGear 27-inch 4K gaming monitor, 144Hz, HDMI 2.1." },
    { name: "Samsung 34-inch Ultrawide", price: 599, description: "Samsung 34-inch ultrawide curved monitor, WQHD, 165Hz." },
    { name: "Logitech MX Master 3S", price: 99, description: "Logitech MX Master 3S wireless ergonomic mouse with MagSpeed scroll." },
    { name: "Keychron Q1 Pro", price: 199, description: "Keychron Q1 Pro wireless mechanical keyboard, hot-swappable, RGB." },
    { name: "SanDisk 1TB Portable SSD", price: 89, description: "SanDisk Extreme Portable SSD 1TB, USB-C, 1050MB/s read speed." },
];

const homeApplianceProducts = [
    { name: "Samsung French Door Fridge", price: 2199, description: "Samsung 28 cu. ft. French door refrigerator with Family Hub and ice maker." },
    { name: "LG InstaView Fridge", price: 2899, description: "LG InstaView Door-in-Door refrigerator with craft ice maker." },
    { name: "Whirlpool Dishwasher", price: 849, description: "Whirlpool 24-inch built-in dishwasher with 3rd rack and stainless steel tub." },
    { name: "Bosch 800 Series Dishwasher", price: 1099, description: "Bosch 800 Series dishwasher with CrystalDry technology and 42 dBA quiet operation." },
    { name: "Dyson V15 Detect", price: 749, description: "Dyson V15 Detect cordless vacuum with laser dust detection and LCD screen." },
    { name: "iRobot Roomba j7+", price: 599, description: "iRobot Roomba j7+ self-emptying robot vacuum with precision navigation." },
    { name: "Samsung Washer & Dryer Set", price: 1799, description: "Samsung 5.0 cu. ft. smart washer and 7.4 cu. ft. dryer set in white." },
    { name: "LG WashTower", price: 2199, description: "LG WashTower stacked laundry center with AI fabric care and TurboWash." },
    { name: "KitchenAid Stand Mixer", price: 449, description: "KitchenAid Artisan 5-quart tilt-head stand mixer in Empire Red." },
    { name: "Ninja Foodi Air Fryer", price: 179, description: "Ninja Foodi 6-in-1 air fryer with DualZone technology, 8-quart capacity." },
    { name: "Vitamix A3500 Blender", price: 549, description: "Vitamix A3500 Ascent Series smart blender with touchscreen and self-cleaning." },
    { name: "Breville Barista Express", price: 699, description: "Breville Barista Express espresso machine with built-in grinder." },
    { name: "De'Longhi Magnifica Evo", price: 899, description: "De'Longhi Magnifica Evo automatic espresso machine with latte crema system." },
    { name: "Dyson Pure Cool Air Purifier", price: 499, description: "Dyson Pure Cool air purifier and fan with HEPA filter and night mode." },
    { name: "Honeywell Air Purifier", price: 249, description: "Honeywell True HEPA air purifier for large rooms up to 1900 sq. ft." },
    { name: "Tefal OptiGrill+", price: 129, description: "Tefal OptiGrill+ electric indoor grill with automatic thickness detection." },
    { name: "Cuisinart Toaster Oven", price: 199, description: "Cuisinart Chef's Convection toaster oven with 9 cooking functions." },
    { name: "Dyson Hot+Cool Heater", price: 599, description: "Dyson Hot+Cool air purifier heater with HEPA filter and jet focus." },
    { name: "Ring Video Doorbell Pro 2", price: 249, description: "Ring Video Doorbell Pro 2 with 3D motion detection and head-to-toe HD+ video." },
    { name: "August Smart Lock Pro", price: 229, description: "August Wi-Fi Smart Lock with auto-lock, DoorSense, and voice assistant support." },
];

const foodProducts = [
    { name: "Lay's Classic Chips", price: 3, description: "Lay's Classic potato chips, crispy and perfectly salted, 10 oz bag." },
    { name: "Doritos Nacho Cheese", price: 4, description: "Doritos Nacho Cheese flavored tortilla chips, bold and crunchy, 9.25 oz." },
    { name: "Pringles Original", price: 4, description: "Pringles Original crispy potato chips, stackable and satisfying, 5.2 oz." },
    { name: "Cheetos Crunchy", price: 3, description: "Cheetos Crunchy cheese-flavored snacks, dangerously cheesy, 8.5 oz." },
    { name: "Tostitos Scoops", price: 4, description: "Tostitos Scoops tortilla chips perfect for dipping, 10 oz bag." },
    { name: "Kettle Brand Sea Salt", price: 5, description: "Kettle Brand sea salt potato chips, thick-cut and crunchy, 8 oz." },
    { name: "Terra Exotic Chips", price: 6, description: "Terra Exotic vegetable chips made with real root vegetables, 5 oz." },
    { name: "Popcorners Sea Salt", price: 4, description: "Popcorners popped corn snacks, light and crispy, sea salt flavor, 4.4 oz." },
    { name: "Sunchips Harvest Cheddar", price: 5, description: "Sunchips whole grain snacks with harvest cheddar flavor, 7 oz." },
    { name: "Ruffles Cheddar & Sour Cream", price: 4, description: "Ruffles Cheddar & Sour Cream potato chips with bold ridged crunch, 8.5 oz." },
    { name: "Goldfish Cheddar", price: 3, description: "Goldfish Cheddar crackers, baked snack crackers for kids and adults, 6.6 oz." },
    { name: "Cheez-It Original", price: 4, description: "Cheez-It Original baked cheese crackers, sharp and savory, 12.4 oz." },
    { name: "Planters Mixed Nuts", price: 7, description: "Planters lightly salted mixed nuts with cashews, almonds, and pecans, 16 oz." },
    { name: "Blue Diamond Almonds", price: 6, description: "Blue Diamond Whole Natural almonds, lightly salted, 16 oz bag." },
    { name: "Kind Bars Variety Pack", price: 12, description: "Kind Bars snack variety pack with dark chocolate, peanut butter, and more, 12 count." },
    { name: "RXBAR Protein Bars", price: 15, description: "RXBAR protein bars variety pack with egg whites, chocolate, and peanut butter, 12 count." },
    { name: "Oreo Original Cookies", price: 4, description: "Oreo original sandwich cookies, chocolate flavor with creme filling, 14.3 oz." },
    { name: "Chips Ahoy! Cookies", price: 4, description: "Chips Ahoy! original chocolate chip cookies, crispy and chewy, 13.7 oz." },
    { name: "Annie's Bunny Grahams", price: 4, description: "Annie's organic bunny graham crackers, honey flavored, 7 oz box." },
    { name: "BelVita Breakfast Biscuits", price: 5, description: "BelVita toasted oat breakfast biscuits, sustained energy, 8.8 oz." },
];

function copySeedImages() {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const images = fs.readdirSync(seedImagesDir);
    for (const image of images) {
        const src = path.join(seedImagesDir, image);
        const dest = path.join(uploadsDir, image);
        if (!fs.existsSync(dest)) {
            fs.copyFileSync(src, dest);
        }
    }
}

async function main() {
    copySeedImages();

    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.user.deleteMany();
    await prisma.userRole.deleteMany();

    await prisma.userRole.createMany({
        data: [
            { name: "Admin", description: "Full access to the system" },
            { name: "Customer", description: "Can browse and purchase products" },
        ],
    });

    await prisma.productCategory.createMany({ data: categories });

    const techCategory = await prisma.productCategory.findUnique({ where: { name: "Technology" } });
    const homeCategory = await prisma.productCategory.findUnique({ where: { name: "Home appliances" } });
    const foodCategory = await prisma.productCategory.findUnique({ where: { name: "Food" } });

    if (!techCategory || !homeCategory || !foodCategory) {
        throw new Error("Failed to create categories");
    }

    for (const product of technologyProducts) {
        await prisma.product.create({
            data: {
                ...product,
                categoryId: techCategory.id,
                imagesUrl: ["uploads/macbook air.webp", "uploads/macbook pro image.webp"],
            },
        });
    }

    for (const product of homeApplianceProducts) {
        await prisma.product.create({
            data: {
                ...product,
                categoryId: homeCategory.id,
                imagesUrl: ["uploads/fridge.jpg"],
            },
        });
    }

    for (const product of foodProducts) {
        await prisma.product.create({
            data: {
                ...product,
                categoryId: foodCategory.id,
                imagesUrl: ["uploads/chips.jpeg"],
            },
        });
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
