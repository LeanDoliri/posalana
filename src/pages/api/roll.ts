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
    const timeStr = today.toISOString().split('T')[1].substring(0, 5); // HH:mm

    const userId = context.locals.user!.id;

    // Check if already rolled
    const existing = await db.execute({
        sql: "SELECT id FROM roll WHERE user_id = ? AND date = ?",
        args: [userId, dateStr]
    });

    if (existing.rows.length > 0) {
        return new Response("Ya tiraste los dados hoy", { status: 400 });
    }

    let d1 = rollDie();
    let d2 = rollDie();
    let d3 = rollDie();
    let d4 = rollDie();
    const id = Math.random().toString(36).substring(2, 15);

    if (context.locals.user?.username === 'lomitotester') {
        // Fetch admin's roll for today
        const adminRollRes = await db.execute({
            sql: `
                SELECT r.die1, r.die2, r.die3, r.die4 
                FROM roll r 
                JOIN user u ON r.user_id = u.id 
                WHERE u.role = 'admin' AND r.date = ? 
                LIMIT 1
            `,
            args: [dateStr]
        });
        if (adminRollRes.rows.length > 0) {
            d1 = adminRollRes.rows[0].die1 as number;
            d2 = adminRollRes.rows[0].die2 as number;
            d3 = adminRollRes.rows[0].die3 as number;
            d4 = adminRollRes.rows[0].die4 as number;
        } else {
            return new Response("El admin debe tirar primero para poder testear la cláusula lomito.", { status: 400 });
        }
    }

    await db.execute({
        sql: "INSERT INTO roll (id, user_id, date, time, die1, die2, die3, die4) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        args: [id, userId, dateStr, timeStr, d1, d2, d3, d4]
    });

	return context.redirect("/");
}
