### Seting up Prisma with PostgreSql

- step 1 (run this command)
```bash
npm install prisma --save-dev
```

- step 2
```bash
npx prisma
```

- step 3
```bash
npx prisma init
```

- step 4
create a model

-step 5 (run this command)
```bash
npx prisma migrate dev --name init
```

- step 6 (run this command)
```bash
npm install @prisma/client
```

- step 7 (run this command)
```bash
npx prisma generate
```

- step 8 (run this)
```bash
npm install @prisma/adapter-pg
```