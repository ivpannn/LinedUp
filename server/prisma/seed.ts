import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    const restaurants = [
        { id: "rest_1", name: "Hai Di Lao", location: "Pavilion Bukit Jalil", cuisineType: "Hotpot", estimatedWait: 30 },
        { id: "rest_2", name: "Shin zushi", location: "Jalan Jalil Jaya 7", cuisineType: "Sushi", estimatedWait: 45 },
        { id: "rest_3", name: "Oriental Kopi", location: "Mid Valley", cuisineType: "Cafe", estimatedWait: 15 },
        { id: "rest_4", name: "Village Park", location: "Petaling Jaya", cuisineType: "Nasi Lemak", estimatedWait: 25 },
        { id: "rest_5", name: "Taisyu Yakiniku", location: "Taman Desa", cuisineType: "Japansese", estimatedWait: 36 },
        { id: "rest_6", name: "Gepuklah", location: "Jalan SS 23/11, Taman Sea", cuisineType: "Nasi Lemak", estimatedWait: 55 },
    ];

    for (const r of restaurants) {
        await prisma.restaurant.upsert({
            where: { id: r.id },
            update: r,
            create: r,
        });
    }

    console.log("Restaurants seeded successfully");
}

main()
    .catch((e) => {
        console.error("Seed failed:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());