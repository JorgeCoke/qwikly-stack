import { Insertable, Selectable, Updateable } from "kysely";

export interface Database {
    user: UserTable
    user_key: UserKeyTable
    user_session: UserSessionTable
}

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
    User = 'user',
    Admin = 'admin'
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