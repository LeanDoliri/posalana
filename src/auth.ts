import { Lucia } from "lucia";
import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";
import db from "./db/index.js";

const adapter = new LibSQLAdapter(db, {
	user: "user",
	session: "session"
});

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: import.meta.env.PROD
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			display_name: attributes.display_name,
			avatar_url: attributes.avatar_url,
			role: attributes.role
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
	display_name: string;
	avatar_url: string | null;
	role: string;
}
