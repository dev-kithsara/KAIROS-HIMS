import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Department
  const dept = await prisma.department.create({
    data: { name: 'Cardiology' },
  });

  // 2. Create User
  const user = await prisma.user.create({
    data: {
      email: 'test@test.com',
      password: 'hashedpassword123', // Bcrypt කරපු එකක් බව සලකන්න
      name: 'Kamal',
      role: 'STAFF',
      departmentId: dept.id,
    },
  });

  // 3. Create Incident
  await prisma.incident.create({
    data: {
      title: 'Slippery Floor',
      description: 'Water leaked near ward 2',
      status: 'OPEN',
      departmentId: dept.id,
      reporterId: user.id,
    },
  });

  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });