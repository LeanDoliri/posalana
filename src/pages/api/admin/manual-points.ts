import type { APIContext } from "astro";
import db from "../../../db/index.js";

export async function POST(context: APIContext): Promise<Response> {
	if (!context.locals.user || context.locals.user.role !== "admin") {
		return new Response("Unauthorized", { status: 403 });
	}

	const body = await context.request.text();
	const params = new URLSearchParams(body);

	const userId = params.get("user_id");
	const seasonId = params.get("season_id");
	const choreCode = params.get("chore_code");
	const points = parseInt(params.get("points") || "-1");

	if (!userId || !seasonId || !choreCode || points < 0) {
		return new Response("Datos inválidos", { status: 400 });
	}

    const id = `${userId}_${seasonId}_${choreCode}`;

	try {
        // Usamos INSERT ON CONFLICT REPLACE (en SQLite es equivalente a INSERT OR REPLACE)
		await db.execute({
			sql: `
                INSERT INTO manual_points (id, user_id, season_id, chore_code, points)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(user_id, season_id, chore_code) DO UPDATE SET points = excluded.points
            `,
			args: [id, userId, seasonId, choreCode, points]
		});

		return context.redirect("/admin");
	} catch (e) {
		console.error("Error cargando puntos:", e);
		return new Response("Error al guardar en base de datos", { status: 500 });
	}
}
