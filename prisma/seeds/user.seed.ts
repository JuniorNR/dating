import { PrismaClient } from '@prisma/client';

export const seedUsers = (prisma: PrismaClient) => {
  return prisma.user.createMany({
    data: [
      {
        username: 'Admin',
        email: 'admin@mail.ru',
        password:
          '$2b$10$9fLMJS6QNp5wESVK8z.Za.R1JNhLK4H7oQQXjZR2J8Qkepql66bRa',
      },
    ],
    skipDuplicates: true,
  });
};
