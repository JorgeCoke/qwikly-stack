export interface Database {
    user: UserTable
    user_key: UserKeyTable
    user_session: UserSessionTable
}

export interface UserTable {
    id: string;
    email: string;
    name: string | null
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