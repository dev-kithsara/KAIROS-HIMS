import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Ensure Department exists
  const dept = await prisma.department.upsert({
    where: { name: 'Cardiology' },
    update: {},
    create: { name: 'Cardiology' },
  });

  // 2. Seed Demo Users
  const users = [
    {
      email: 'manager@hospital.com',
      password: hashedPassword,
      name: 'Dr. Manager',
      role: 'MANAGER',
      departmentId: dept.id,
    },
    {
      email: 'staff@hospital.com',
      password: hashedPassword,
      name: 'Kamal Perera',
      role: 'STAFF',
      departmentId: dept.id,
    },
    {
      email: 'investigator@hospital.com',
      password: hashedPassword,
      name: 'Nimal Investigator',
      role: 'INVESTIGATOR',
      departmentId: dept.id,
    },
    {
      email: 'actionowner@hospital.com',
      password: hashedPassword,
      name: 'Sunil Action Owner',
      role: 'ACTION_OWNER',
      departmentId: dept.id,
    },
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        password: userData.password,
        role: userData.role,
      },
      create: userData,
    });
  }

  console.log('✅ Demo users seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });