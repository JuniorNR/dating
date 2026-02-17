import { PrismaClient } from '@prisma/client';

export const seedRoles = (prisma: PrismaClient) => {
  return prisma.role.createMany({
    data: [
      {
        name: 'User',
        type: 'user',
        description: 'User is default role on this project.',
      },
      {
        name: 'Admin',
        type: 'admin',
        description:
          'The administrator can administer the content in the project.',
      },
      {
        name: 'Super user',
        type: 'super-user',
        description:
          'A super user can do everything that is possible in the project.',
      },
    ],
    skipDuplicates: true,
  });
};
