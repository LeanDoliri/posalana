import type { APIRoute } from "astro";
import db from "../../../db/index.js";

export const POST: APIRoute = async ({ request, locals }) => {
	const user = locals.user;
	
	if (!user || user.role !== "admin") {
		return new Response("Unauthorized", { status: 403 });
	}

	let formData;
	try {
		if (request.headers.get("Content-Type")?.includes("multipart/form-data")) {
			formData = await request.formData();
		} else {
			formData = new URLSearchParams(await request.text());
		}
	} catch (e) {
		return new Response("Invalid form data", { status: 400 });
	}

	const rollId = formData.get("rollId")?.toString();

	if (!rollId) {
		return new Response("Missing rollId", { status: 400 });
	}

	try {
        // Delete roll
        await db.execute({
            sql: "DELETE FROM roll WHERE id = ?",
            args: [rollId]
        });
		
		return new Response(null, {
			status: 302,
			headers: { Location: "/admin" }
		});
	} catch (e) {
		console.error("Error deleting roll:", e);
		return new Response("Internal Server Error", { status: 500 });
	}
};
