import type { APIContext } from "astro";
import db from "../../db/index.js";
import { hash } from "bcryptjs";

const MASTER_KEY = "posalan2026";

export async function POST(context: APIContext): Promise<Response> {
	const body = await context.request.text();
	const params = new URLSearchParams(body);
	const username = params.get("username")?.trim() ?? "";
	const newPassword = params.get("new_password") ?? "";
	const masterKey = params.get("master_key") ?? "";

	if (masterKey !== MASTER_KEY) {
		return new Response("Clave maestra incorrecta", { status: 403 });
	}

	if (username.length < 3) {
		return new Response("Usuario inválido", { status: 400 });
	}

	if (newPassword.length < 4 || newPassword.length > 255) {
		return new Response("La contraseña debe tener al menos 4 caracteres", { status: 400 });
	}

	const existingUserRes = await db.execute({
		sql: "SELECT id FROM user WHERE username = ?",
		args: [username]
	});

	if (existingUserRes.rows.length === 0) {
		return new Response("El usuario no existe", { status: 404 });
	}

	const passwordHash = await hash(newPassword, 10);
	await db.execute({
		sql: "UPDATE user SET password_hash = ? WHERE username = ?",
		args: [passwordHash, username]
	});

	return context.redirect("/login");
}
