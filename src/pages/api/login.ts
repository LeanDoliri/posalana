import type { APIContext } from "astro";
import { lucia } from "../../auth.js";
import db from "../../db/index.js";
import { hash, compare } from "bcryptjs";

function generateId() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function POST(context: APIContext): Promise<Response> {
	const body = await context.request.text();
	console.log("LOGIN BODY:", JSON.stringify(body));
	const params = new URLSearchParams(body);
	const username = params.get("username")?.trim() ?? "";
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return new Response("Usuario inválido (solo minúsculas y números, 3-31 caracteres)", {
			status: 400
		});
	}
	const password = params.get("password");
	if (typeof password !== "string" || password.length < 4 || password.length > 255) {
		return new Response("Contraseña inválida", {
			status: 400
		});
	}

	const existingUserRes = await db.execute({
		sql: "SELECT * FROM user WHERE username = ?",
		args: [username]
	});
	
	const existingUser = existingUserRes.rows[0];

	if (existingUser) {
		const validPassword = await compare(password, existingUser.password_hash as string);
		if (!validPassword) {
			return new Response("Usuario o contraseña incorrectos", {
				status: 400
			});
		}

		const session = await lucia.createSession(existingUser.id as string, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

		return context.redirect("/");
	} else {
		return new Response("Usuario no encontrado. Registrate primero.", {
			status: 404
		});
	}
}
