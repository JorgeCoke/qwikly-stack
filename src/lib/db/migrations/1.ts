import { Kysely } from 'kysely'
import { UserRole } from '../schema'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('name', 'text')
    .addColumn('role', 'text', (col) => col.notNull().defaultTo(UserRole.User))
    .execute()

  await db.schema
    .createTable('user_key')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('user_id', 'text', (col) => col.notNull().references('user.id').onDelete('cascade'))
    .addColumn('hashed_password', 'text')
    .execute()

  await db.schema
    .createTable('user_session')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('user_id', 'text', (col) => col.notNull().references('user.id').onDelete('cascade'))
    .addColumn('active_expires', 'integer', (col) => col.notNull())
    .addColumn('idle_expires', 'integer', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user').execute()
  await db.schema.dropTable('user_key').execute()
  await db.schema.dropTable('user_session').execute()
}