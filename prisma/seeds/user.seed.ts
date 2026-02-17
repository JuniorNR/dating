import { PrismaClient } from '@prisma/client';

export const seedUsers = (prisma: PrismaClient) => {
  return prisma.user.createMany({
    data: [
      {
        username: 'Admin',
        email: 'admin@mail.ru',
        password: 'Admin!192837465',
      },
    ],
    skipDuplicates: true,
  });
};
