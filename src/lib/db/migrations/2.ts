import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('stripe_product')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('amount', 'integer', (col) => col.notNull())
    .addColumn('currency', 'text', (col) => col.notNull())
    .addColumn('price_id', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('metadata', 'text')  // JSON
    .addColumn('recurring', 'text') // JSON
    .execute()

  await db.schema
    .createTable('stripe_event')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('stripe_product_id', 'text', (col) => col.notNull().references('stripe_product.id').onDelete('cascade'))
    .addColumn('user_id', 'text', (col) => col.notNull().references('user.id').onDelete('cascade'))
    .addColumn('created_at', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()

}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('stripe_product').execute()
  await db.schema.dropTable('stripe_event').execute()
}