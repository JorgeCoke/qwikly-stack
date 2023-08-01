import 'dotenv/config';
import { CREDENTIALS_PROVIDER_ID, auth } from '../../lucia-auth';
import { db } from "../kysely";
import { UserRole } from '../schema';

// NOTE: You can ignore the output error about "import.meta.env"
async function seed() {
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PWD) {
    throw new Error(`process.env.ADMIN_USER or process.env.ADMIN_PWD is not defined!`)
  }
  const admin = {email: process.env.ADMIN_USER, password: process.env.ADMIN_PWD};

  const currentAdmin = await db.selectFrom('user').where('email', '=', admin.email).selectAll().executeTakeFirst()
  if (currentAdmin) {
    console.log(`${admin.email} user already exists!`)
  } else {
    await auth
    .createUser({
      key: {
        providerId: CREDENTIALS_PROVIDER_ID,
        providerUserId: admin.email.toLowerCase().trim(),
        password: admin.password,
      },
      attributes: {
        email: admin.email.toLowerCase().trim(),
        name: null,
        role: UserRole.Admin
      },
    })
    console.log(`${admin.email} user created!`)
  }
  await db.destroy();
}

seed();
