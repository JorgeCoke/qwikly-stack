import 'dotenv/config';
import { db } from "../kysely";

async function resetDb() {
    if (!process.env.DATABASE_URL) {
        throw new Error(`process.env.DATABASE_URL is not defined!`)
    }
    await db.deleteFrom('user_session').execute();
    await db.deleteFrom('user_key').execute();
    await db.deleteFrom('user').execute();
    console.log("Removed all data from database!")
}

resetDb();
