import type { APIRoute } from "astro";
import db from "../../../db/index.js";

function generateId() {
	return Math.random().toString(36).substring(2, 15);
}

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

	const season_id = formData.get("season_id")?.toString();
	const user_id = formData.get("user_id")?.toString();
	const chore_code = formData.get("chore_code")?.toString();

	if (!season_id || !user_id || !chore_code) {
		return new Response("Missing fields", { status: 400 });
	}

	try {
        await db.execute({
            sql: "INSERT OR IGNORE INTO exemption (id, user_id, season_id, chore_code) VALUES (?, ?, ?, ?)",
            args: [generateId(), user_id, season_id, chore_code]
        });
		
		return new Response(null, {
			status: 302,
			headers: { Location: "/admin" }
		});
	} catch (e) {
		console.error("Error adding exemption:", e);
		return new Response("Internal Server Error", { status: 500 });
	}
};
