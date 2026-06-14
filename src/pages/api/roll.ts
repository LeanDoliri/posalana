import type { APIContext } from "astro";
import db from "../../db/index.js";

function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

export async function POST(context: APIContext): Promise<Response> {
	if (!context.locals.session) {
		return new Response("No autorizado", { status: 401 });
	}

    // Get current date in YYYY-MM-DD
    // Note: To match local timezone, we should ideally use the client's date or a fixed timezone. 
    // We'll use a simple UTC-3 for Argentina if we can, or just local server time.
    const today = new Date();
    // adjust to GMT-3 for Argentina
    today.setHours(today.getHours() - 3);
    const dateStr = today.toISOString().split('T')[0];

    const userId = context.locals.user!.id;

    // Check if already rolled
    const existing = await db.execute({
        sql: "SELECT id FROM roll WHERE user_id = ? AND date = ?",
        args: [userId, dateStr]
    });

    if (existing.rows.length > 0) {
        return new Response("Ya tiraste los dados hoy", { status: 400 });
    }

    const d1 = rollDie();
    const d2 = rollDie();
    const d3 = rollDie();
    const d4 = rollDie();
    const id = Math.random().toString(36).substring(2, 15);

    await db.execute({
        sql: "INSERT INTO roll (id, user_id, date, die1, die2, die3, die4) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [id, userId, dateStr, d1, d2, d3, d4]
    });

	return context.redirect("/");
}
