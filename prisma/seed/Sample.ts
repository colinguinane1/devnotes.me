import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  function generateUsername(firstName: string, lastName: string): string {
    const randomNumbers = Math.floor(100 + Math.random() * 900);
    const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}${randomNumbers}`;
    return username;
  }
  const userAccount = prisma.user.create({
    data: {
      first_name: "John",
      last_name: "Doe",
      username: generateUsername("John", "Doe" ),
      image_url: "https://example.com/image.jpg",
      created_at: new Date(),
      updated_at: new Date(),
      last_sign_in_at: new Date(),
      email: "johndoe@blogchain.com",
      clerk_id: "user_2jmwhc8VaBOSYnIRhg60BD0NW217",
    },
  });
}
seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });