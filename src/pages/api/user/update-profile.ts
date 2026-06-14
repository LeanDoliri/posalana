import type { APIContext } from "astro";
import db from "../../../db/index.js";

export async function POST(context: APIContext): Promise<Response> {
	if (!context.locals.session) {
		return new Response("No autorizado", { status: 401 });
	}

	let body;
	try {
		body = await context.request.json();
	} catch (e) {
		return new Response("JSON invalido", { status: 400 });
	}

    const updates: string[] = [];
    const args: any[] = [];

    if (body.avatar && typeof body.avatar === 'string' && body.avatar.length < 500000) {
        updates.push("avatar_url = ?");
        args.push(body.avatar);
    }

    if (body.display_name && typeof body.display_name === 'string' && body.display_name.trim().length > 0) {
        updates.push("display_name = ?");
        args.push(body.display_name.trim());
    }

    if (updates.length === 0) {
        return new Response("No hay nada que actualizar", { status: 400 });
    }

    args.push(context.locals.user!.id);

	try {
		console.log("Updating profile:", updates, args);
		await db.execute({
			sql: `UPDATE user SET ${updates.join(', ')} WHERE id = ?`,
			args: args
		});
		console.log("Profile updated successfully in DB");
		return new Response("OK", { status: 200 });
	} catch (e) {
		console.error("Error al actualizar perfil:", e);
		return new Response("Error interno", { status: 500 });
	}
}
