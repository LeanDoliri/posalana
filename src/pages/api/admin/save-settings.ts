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

	const last_lomito_date = formData.get("last_lomito_date")?.toString() || "";
	const master_key = formData.get("master_key")?.toString() || "";

	try {
        if (last_lomito_date) {
            await db.execute({
                sql: "INSERT INTO settings (key, value) VALUES ('last_lomito_date', ?) ON CONFLICT(key) DO UPDATE SET value = ?",
                args: [last_lomito_date, last_lomito_date]
            });
        } else {
            await db.execute("DELETE FROM settings WHERE key = 'last_lomito_date'");
        }
        
        if (master_key) {
            await db.execute({
                sql: "INSERT INTO settings (key, value) VALUES ('master_key', ?) ON CONFLICT(key) DO UPDATE SET value = ?",
                args: [master_key, master_key]
            });
        } else {
            await db.execute("DELETE FROM settings WHERE key = 'master_key'");
        }
		
		return new Response(null, {
			status: 302,
			headers: { Location: "/admin" }
		});
	} catch (e) {
		console.error("Error saving settings:", e);
		return new Response("Internal Server Error", { status: 500 });
	}
};
