import type { APIContext } from "astro";
import db from "../../db/index.js";
import { hash } from "bcryptjs";

function generateId() {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function POST(context: APIContext): Promise<Response> {
	const body = await context.request.text();
	const params = new URLSearchParams(body);
	const username = params.get("username")?.trim() ?? "";
	const newPassword = params.get("new_password") ?? "";

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

	const userId = existingUserRes.rows[0].id as string;
	const passwordHash = await hash(newPassword, 10);
	await db.execute({
		sql: "UPDATE user SET password_hash = ? WHERE username = ?",
		args: [passwordHash, username]
	});

	// Invalidate any existing sessions for this user
	await db.execute({
		sql: "DELETE FROM session WHERE user_id = ?",
		args: [userId]
	});

	// Log the reset so the admin can review it later
	await db.execute({
		sql: "INSERT INTO password_reset_log (id, username, created_at) VALUES (?, ?, ?)",
		args: [generateId(), username, new Date().toISOString()]
	});

	return context.redirect("/login");
}
