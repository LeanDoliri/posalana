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

	const targetUserId = formData.get("userId")?.toString();
	const newRole = formData.get("role")?.toString();

	if (!targetUserId || !newRole) {
		return new Response("Missing userId or role", { status: 400 });
	}
    
    if (targetUserId === user.id) {
        return new Response("No te podes cambiar el rol a vos mismo", { status: 400 });
    }

	try {
        await db.execute({
            sql: "UPDATE user SET role = ? WHERE id = ?",
            args: [newRole, targetUserId]
        });
		
		return new Response(null, {
			status: 302,
			headers: { Location: "/admin" }
		});
	} catch (e) {
		console.error("Error updating role:", e);
		return new Response("Internal Server Error", { status: 500 });
	}
};
