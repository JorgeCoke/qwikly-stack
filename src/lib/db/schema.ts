import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

// Global Database schema
export interface Database {
    user: UserTable
    user_key: UserKeyTable
    user_session: UserSessionTable
    stripe_product: StripeProduct
    stripe_event: StripeEvent
}

// Authentication
// NOTE: Do not forget to update userAttibutes for Lucia in "app.d.ts" and "lucia-auth.ts"
export interface UserTable {
    id: string;
    email: string;
    name: string | null
    role: UserRole;
}
export type User = Selectable<UserTable>
export type InsertUser = Insertable<UserTable>
export type UpdateUser = Updateable<UserTable>

export enum UserRole {
    User = 'User',
    Admin = 'Admin'
}

export interface UserKeyTable {
    id: string;
    user_id: string;
    hashed_password: string | null;
}

export interface UserSessionTable {
    id: string;
    user_id: string;
    active_expires: number;
    idle_expires: number;
}

// Stripe Payments
export interface StripeProduct {
    id: string;     // Stripe id coming from Stripe
    name: string;
    metadata?: string;  // JSON
    amount: number;
    currency: string;
    recurring?: string; // JSON // TODO: // NOTE: only required for Subscriptions
    price_id: string;
}

export interface StripeEvent {
    id: string;     // StripeCheckoutSessionId coming from Stripe 
    type: StripeEventType;
    stripe_product_id: string;
    user_id: string;
    // You can specify a different type for each operation (select, insert and update) using the `ColumnType<SelectType, InsertType, UpdateType>` wrapper. Here we define a column `created_at` that is selected as a `Date`, can optionally be provided as a `string` in inserts and can never be updated:
    created_at: ColumnType<Date, string | undefined, never>
}

export enum StripeEventType {
    CheckoutProduct = 'CheckoutProduct',
    CheckoutSubscription = 'CheckoutSubscription',
    SubscriptionUpdated = 'SubscriptionUpdated',
    SubscriptionDeleted = 'SubscriptionDeleted'
}