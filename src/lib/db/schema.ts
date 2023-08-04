// See: https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/README.md

import { InferModel, sql } from 'drizzle-orm';
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Authentication
export enum UserRole {
    User = 'User',
    Admin = 'Admin'
}
// NOTE: Do not forget to update userAttibutes for Lucia in "app.d.ts" and "lucia-auth.ts"
export const users = sqliteTable('user', {
    id: text('id').notNull().primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name'),
    role: text('role', {enum: [UserRole.User, UserRole.Admin]}).notNull().default(UserRole.User)
});

export const userKeys = sqliteTable('user_key', {
    id: text('id').notNull().primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    hashedPassword: text('hashed_password').unique()
});

export const userSessions = sqliteTable('user_session', {
    id: text('id').notNull().primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    activeExpires: integer('active_expires').notNull(),
    idleExpires: integer('idle_expires').notNull(),
});

// Stripe
export const stripeProducts = sqliteTable('stripe_product', {
    id: text('id').notNull().primaryKey(),
    name: text('name').notNull(),
    metadata: blob('metadata', { mode: 'json' }).$type<{ description: string }>(),
    amount: integer('amount').notNull(),
    currency: text('currency').notNull(),
    recurring: blob('recurring', { mode: 'json' }).$type<{ interval: string }>(), // NOTE: only required for Subscriptions
    priceId: text('price_id').notNull()
});
export type StripeProduct = InferModel<typeof stripeProducts>;

export enum StripeEventType {
    CheckoutProduct = 'CheckoutProduct',
    CheckoutSubscription = 'CheckoutSubscription',
    SubscriptionUpdated = 'SubscriptionUpdated',
    SubscriptionDeleted = 'SubscriptionDeleted'
}
export const stripeEvents = sqliteTable('stripe_event', {
    id: text('id').notNull().primaryKey(),     // StripeCheckoutSessionId coming from Stripe 
    type: text('type', {enum: [StripeEventType.CheckoutProduct,StripeEventType.CheckoutSubscription,StripeEventType.SubscriptionUpdated,StripeEventType.SubscriptionDeleted]}).notNull(),
    stripeProductId: text('stripe_product_id').notNull().references(() => stripeProducts.id),
    userId: text('user_id').notNull().references(() => users.id),
    createdAt: text("timestamp").default(sql`CURRENT_TIMESTAMP`)
});
