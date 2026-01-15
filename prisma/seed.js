import prisma from "../src/config/prisma.js";
import { faker } from "@faker-js/faker/locale/en";

const databaseSeeder = async () => {
    // Authors
    for (let i = 0; i < 50; i++) {
        await prisma.author.create({
            data: {
                name: faker.person.fullName(),
                biography: faker.lorem.paragraph(),
                birth_year: faker.date.birthdate({ min: 1940, max: 2005, mode: "year" }).getFullYear(),
            }
        });
    }

    // Books
    for (let i = 0; i < 50; i++) {
        await prisma.book.create({
            data: {
                title: faker.book.title(),
                description: faker.lorem.sentence(),
                thumbnail_url: faker.image.url(),
                release_year: faker.date.anytime().getFullYear(),
            }
        });
    }
};

try {
    await databaseSeeder();
    await prisma.$disconnect();
} catch (exception) {
    console.error(exception);
    await prisma.$disconnect();
    process.exit(1);
}
