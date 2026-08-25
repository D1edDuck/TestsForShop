"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("Seeding database...");
    const adminPassword = await bcryptjs_1.default.hash("admin123", 10);
    const userPassword = await bcryptjs_1.default.hash("user123", 10);
    await prisma.user.upsert({
        where: { email: "admin@techshop.com" },
        update: {},
        create: { name: "Admin User", email: "admin@techshop.com", password: adminPassword, role: "ADMIN" },
    });
    await prisma.user.upsert({
        where: { email: "john@test.com" },
        update: {},
        create: { name: "John Doe", email: "john@test.com", password: userPassword, role: "USER" },
    });
    await prisma.user.upsert({
        where: { email: "jane@test.com" },
        update: {},
        create: { name: "Jane Smith", email: "jane@test.com", password: userPassword, role: "USER" },
    });
    console.log("Users seeded: admin@techshop.com, john@test.com, jane@test.com");
    const products = [
        { name: "iPhone 15 Pro", description: "Смартфон Apple iPhone 15 Pro, 256 ГБ, титановый корпус, чип A17 Pro, камера 48 Мп.", price: 1299.99, category: "Phones", stock: 25, rating: 4.8, image: "/images/iphone15pro.png" },
        { name: "MacBook Air M3", description: "Ноутбук Apple MacBook Air 15\" с чипом M3, 16 ГБ RAM, 512 ГБ SSD, Liquid Retina.", price: 1099.99, category: "Laptops", stock: 15, rating: 4.9, image: "/images/macbookair.png" },
        { name: "Sony WH-1000XM5", description: "Беспроводные наушники с шумоподавлением, 30 часов работы, Hi-Res Audio.", price: 349.99, category: "Audio", stock: 40, rating: 4.7, image: "/images/sonyxm5.png" },
        { name: "iPad Air", description: "Планшет Apple iPad Air 11\" с чипом M2, 128 ГБ, Liquid Retina, Apple Pencil.", price: 599.99, category: "Tablets", stock: 20, rating: 4.6, image: "/images/ipadair.png" },
        { name: "Samsung Galaxy S24 Ultra", description: "Смартфон Samsung Galaxy S24 Ultra, 256 ГБ, Snapdragon 8 Gen 3, камера 200 Мп.", price: 1199.99, category: "Phones", stock: 30, rating: 4.7, image: "/images/s24ultra.png" },
        { name: "Dell XPS 15", description: "Ноутбук Dell XPS 15, Intel Core i7, 16 ГБ RAM, 512 ГБ SSD, OLED.", price: 1299.99, category: "Laptops", stock: 10, rating: 4.5, image: "/images/dellxps.png" },
        { name: "AirPods Pro 2", description: "Беспроводные наушники Apple AirPods Pro 2 USB-C, шумоподавление, 6 часов.", price: 249.99, category: "Audio", stock: 50, rating: 4.8, image: "/images/airpodspro.png" },
        { name: "Nintendo Switch OLED", description: "Игровая консоль Nintendo Switch, 7\" OLED экран, 64 ГБ, Joy-Con.", price: 349.99, category: "Gaming", stock: 20, rating: 4.6, image: "/images/switch.png" },
        { name: "PS5 DualSense Controller", description: "Беспроводный геймпад Sony DualSense для PS5, адаптивные триггеры.", price: 69.99, category: "Gaming", stock: 35, rating: 4.5, image: "/images/dualsense.png" },
        { name: "Logitech MX Master 3S", description: "Беспроводная мышь Logitech MX Master 3S, MagSpeed колесо, USB-C.", price: 99.99, category: "Accessories", stock: 45, rating: 4.7, image: "/images/mxmaster.png" },
    ];
    for (let i = 0; i < products.length; i++) {
        await prisma.product.upsert({
            where: { id: i + 1 },
            update: products[i],
            create: { id: i + 1, ...products[i] },
        });
    }
    console.log(`Products seeded: ${products.length} items`);
    const john = await prisma.user.findUnique({ where: { email: "john@test.com" } });
    const jane = await prisma.user.findUnique({ where: { email: "jane@test.com" } });
    if (john && jane) {
        await prisma.review.create({ data: { text: "Отличный телефон! Камера просто бомба.", rating: 5, userId: john.id, productId: 1 } });
        await prisma.review.create({ data: { text: "Лучший планшет для работы и учёбы.", rating: 4, userId: jane.id, productId: 4 } });
        await prisma.review.create({ data: { text: "Шумоподавление на высоте, очень удобные.", rating: 5, userId: john.id, productId: 3 } });
    }
    console.log("Reviews seeded");
    console.log("Seed complete!");
}
main()
    .then(() => prisma.$disconnect())
    .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
//# sourceMappingURL=seed.js.map