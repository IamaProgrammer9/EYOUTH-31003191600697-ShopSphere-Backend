# NileBridge Backend
The backend for the NileBridge platform, it uses a modern stack with express as the backbone and prisma with flexible databases according
to the requirements.
## Commands
1. Generate prisma client (mongdb): `npx prisma generate --schema=./prisma-mongodb/schema.prisma`
2. Generate prisma client (postgres): `npx prisma generate --schema=./prisma/schema.prisma`