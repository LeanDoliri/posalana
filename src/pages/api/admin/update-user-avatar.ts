import type { APIContext } from "astro";
import db from "../../../db/index.js";

export async function POST(context: APIContext): Promise<Response> {
	if (!context.locals.user || context.locals.user.role !== "admin") {
		return new Response("No autorizado", { status: 403 });
	}

	let body;
	try {
		body = await context.request.json();
	} catch (e) {
		return new Response("JSON inválido", { status: 400 });
	}

	const { userId, avatar, removeAvatar } = body;

	if (!userId) {
		return new Response("Falta el ID de usuario", { status: 400 });
	}

	try {
		if (removeAvatar === true) {
			const userRes = await db.execute({
				sql: "SELECT username FROM user WHERE id = ?",
				args: [userId]
			});
			const u = userRes.rows[0];
			if (u) {
				const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`;
				await db.execute({
					sql: "UPDATE user SET avatar_url = ? WHERE id = ?",
					args: [defaultAvatar, userId]
				});
				return new Response("OK", { status: 200 });
			}
			return new Response("Usuario no encontrado", { status: 404 });
		} else if (avatar && typeof avatar === 'string' && avatar.length < 500000) {
			await db.execute({
				sql: "UPDATE user SET avatar_url = ? WHERE id = ?",
				args: [avatar, userId]
			});
			return new Response("OK", { status: 200 });
		}
		return new Response("Datos inválidos o imagen demasiado grande", { status: 400 });
	} catch (e) {
		console.error("Error al actualizar avatar del usuario:", e);
		return new Response("Error interno", { status: 500 });
	}
}
