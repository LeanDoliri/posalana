import type { APIRoute } from "astro";
import db from "../../../db/index.js";

export const POST: APIRoute = async ({ request, locals }) => {
	const user = locals.user;
	
	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	let body;
	try {
		body = await request.json();
	} catch (e) {
		return new Response("Invalid JSON body", { status: 400 });
	}

	const avatarBase64 = body.avatar;

	if (!avatarBase64 || typeof avatarBase64 !== 'string' || !avatarBase64.startsWith('data:image/')) {
		return new Response("Formato de imagen inválido", { status: 400 });
	}

	// Limitar el tamaño a aproximadamente 2MB (base64) por seguridad
	if (avatarBase64.length > 2.5 * 1024 * 1024) {
		return new Response("La imagen es demasiado pesada.", { status: 400 });
	}

	try {
        await db.execute({
            sql: "UPDATE user SET avatar_url = ? WHERE id = ?",
            args: [avatarBase64, user.id]
        });
		
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error("Error updating avatar:", e);
		return new Response("Internal Server Error", { status: 500 });
	}
};
