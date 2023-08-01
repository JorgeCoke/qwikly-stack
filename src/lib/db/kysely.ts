import { Kysely, SqliteDialect } from 'kysely';
import { Database } from './schema'; // this is the Database interface we defined
import { sqliteDatabase } from './sqlite';

const dialect = new SqliteDialect({
  database: sqliteDatabase,
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
});