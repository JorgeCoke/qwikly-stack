import sqlite from "better-sqlite3";

export const sqliteDatabase = sqlite(process.env.DATABASE_URL!);
