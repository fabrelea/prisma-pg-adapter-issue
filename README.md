# `@prisma/adapter-pg` incompatible with `pg@8.17.x+`

## Bug Description

The `@prisma/adapter-pg` package is not compatible with `pg` version 8.17.0 and above. Using `pg@8.17.x+` causes connection/query failures when using the Prisma Postgres adapter.

**Workaround:** Downgrading to `pg@8.16.3` resolves the issue.

## Environment

| Package | Version |
|---------|---------|
| `prisma` | 7.2.0 |
| `@prisma/client` | 7.2.0 |
| `@prisma/adapter-pg` | 7.2.0 |
| `pg` (broken) | 8.17.x+ |
| `pg` (works) | 8.16.3 |
| Node.js | v24.13.0 |
| Bun | 1.3.6 |

## Reproduction Steps

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/prisma-repro.git
cd prisma-repro
bun install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Set up environment

Create a `.env` file:

```bash
echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prisma"' > .env
```

### 4. Generate Prisma client and run migrations

```bash
bunx prisma migrate deploy
bunx prisma generate
```

### 5. Reproduce the bug

Run the test script:

```bash
bun src/test.ts
```

**Expected:** Query executes successfully
**Actual:** Connection/query failure

### 6. Verify the workaround

Downgrade `pg` to 8.16.3:

```bash
rm -rf node_modules && bun add pg@8.16.3
```

Run the test script again:

```bash
bun src/test.ts
```

**Result:** Works as expected ✅

## Relevant Code

### `index.ts` - Prisma client setup with adapter

```typescript
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from './generated/prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});
```

### `prisma/schema.prisma`

```prisma
generator client {
  provider   = "prisma-client"
  runtime    = "bun"
  output     = "../src/generated/prisma"
  engineType = "client"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### `test.ts` - Test script

```typescript
import "dotenv/config";
import { prisma } from "./";

async function main() {
  const users = await prisma.user.count();
  console.log(users);
}

main().then(() => {
  console.log("done");
  process.exit(0);
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
```

## Additional Context

- The `pg` package released version 8.17.0 with potential breaking changes that may affect the adapter's compatibility
- Likely related to changes in `pg@8.17.0` - see [pg changelog](https://github.com/brianc/node-postgres/blob/master/CHANGELOG.md)
