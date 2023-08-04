import 'dotenv/config';
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from '../drizzle';

async function migrateToLatest() {
  if (!process.env.DATABASE_URL) {
    throw new Error(`process.env.DATABASE_URL is not defined!`)
  }

  await migrate(db, { migrationsFolder: "../migrations" });
}

migrateToLatest();
