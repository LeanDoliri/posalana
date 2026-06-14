import type { APIContext } from "astro";
import db from "../../db/index.js";
import { hash } from "bcryptjs";

export async function POST(context: APIContext): Promise<Response> {
	const body = await context.request.text();
	const params = new URLSearchParams(body);
	
    const username = params.get("username")?.trim() ?? "";
	const master_key = params.get("master_key")?.trim() ?? "";
	const new_password = params.get("new_password")?.trim() ?? "";

	if (!username || !master_key || !new_password) {
		return new Response("Faltan campos", { status: 400 });
	}

    if (new_password.length < 4) {
        return new Response("La contraseña es muy corta", { status: 400 });
    }

    // Verify master key
    const settingsRes = await db.execute("SELECT value FROM settings WHERE key = 'master_key'");
    const validMasterKey = settingsRes.rows.length > 0 ? settingsRes.rows[0].value as string : null;

    if (!validMasterKey || master_key !== validMasterKey) {
        return new Response("Clave maestra incorrecta o no configurada", { status: 403 });
    }

    // Hash new password
    const passwordHash = await hash(new_password, 10);

    // Update user
    const updateRes = await db.execute({
        sql: "UPDATE user SET password_hash = ? WHERE username = ?",
        args: [passwordHash, username]
    });

    if (updateRes.rowsAffected === 0) {
        return new Response("El usuario no existe", { status: 404 });
    }

	return context.redirect("/login");
}
