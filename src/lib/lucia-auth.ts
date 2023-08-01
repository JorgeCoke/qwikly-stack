import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import { lucia } from "lucia";
import { qwik } from "lucia/middleware";
import { sqliteDatabase } from "./db/sqlite";
// NOTE: If you’re using Node.js version 18 or below, you need to polyfill the Web Crypto API. This is not required if you’re using runtimes other than Node.js (Deno, Bun, Cloudflare Workers, etc) or using Node.js v20 and above.
// import "lucia/polyfill/node";

export const CREDENTIALS_PROVIDER_ID = "Credentials"

export const auth = lucia({
	env: import.meta.env!! ? (import.meta.env.DEV ? "DEV" : "PROD") : "DEV",
    middleware: qwik(),
    adapter: betterSqlite3(sqliteDatabase, {
		user: "user",
		key: "user_key",
		session: "user_session"
	}),
	getUserAttributes: (data) => {
		return {
			// NOTE: `userId` included by default
			email: data.email,
			name: data.name,
			role: data.role
		};
	},
	// sessionCookie: {
	// 	name: "session", // session cookie name
	// 	attributes: {
	// 		sameSite: "strict"
	// 	}
	// },
	// sessionExpiresIn: {
	// 	activePeriod: number;
    //     idlePeriod: number;
	// }
});

export type Auth = typeof auth;