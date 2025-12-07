import "dotenv/config";
import { defineConfig } from "prisma/config";

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;
const DATABASE_URL = `postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: DATABASE_URL,
  },
});
