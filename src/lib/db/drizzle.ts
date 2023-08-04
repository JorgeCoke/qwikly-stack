import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import { sqliteDatabase } from './sqlite';

export const db: BetterSQLite3Database = drizzle(sqliteDatabase);
