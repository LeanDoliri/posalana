import type { APIContext } from "astro";
import db from "../../../db/index.js";
import { publishDailyVerdict } from "../../../utils/verdict.js";
import { getArgentinaNow } from "../../../utils/schedule.js";

export async function POST(context: APIContext): Promise<Response> {
    const { session, user } = context.locals;

    if (!session || !user || user.role !== "admin") {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const { dateStr } = getArgentinaNow();
        const result = await publishDailyVerdict(db, dateStr);

        if (!result.sent) {
            return new Response(JSON.stringify({ error: "No hay tiradas registradas hoy para publicar veredicto" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error: any) {
        console.error("Error publishing verdict to Discord:", error);
        return new Response(JSON.stringify({ error: error.message || "Error interno del servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
