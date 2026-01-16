import 'dotenv/config';

import { prisma } from './client';

async function main() {
  console.log({ prisma: await prisma.user.count({ where: { email: 'test@test.com' } }) })
  // const x = await prisma.user.count();
  // const users = await prisma.user.findMany();
  // console.log(users);
}

main()
  .then(() => {
    console.log('done');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
