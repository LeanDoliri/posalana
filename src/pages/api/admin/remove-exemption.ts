import type { APIRoute } from "astro";
import db from "../../../db/index.js";

export const POST: APIRoute = async ({ request, locals }) => {
	const user = locals.user;
	
	if (!user || user.role !== "admin") {
		return new Response("Unauthorized", { status: 403 });
	}

	let formData;
	try {
		formData = new URLSearchParams(await request.text());
	} catch (e) {
		return new Response("Invalid form data", { status: 400 });
	}

	const id = formData.get("id")?.toString();

	if (!id) {
		return new Response("Missing id", { status: 400 });
	}

	try {
        await db.execute({
            sql: "DELETE FROM exemption WHERE id = ?",
            args: [id]
        });
		
		return new Response(null, {
			status: 302,
			headers: { Location: "/admin" }
		});
	} catch (e) {
		console.error("Error removing exemption:", e);
		return new Response("Internal Server Error", { status: 500 });
	}
};
