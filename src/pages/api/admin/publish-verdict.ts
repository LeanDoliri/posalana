import type { APIContext } from "astro";
import db from "../../../db/index.js";
import { assignDailyChores } from "../../../utils/chores.js";
import { sendDiscordVerdict } from "../../../utils/discord.js";
import { getSeasonId, getExemptionsForSeason } from "../../../utils/season.js";

export async function POST(context: APIContext): Promise<Response> {
    const { session, user } = context.locals;

    if (!session || !user || user.role !== "admin") {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const today = new Date();
        today.setHours(today.getHours() - 3);
        const dateStr = today.toISOString().split('T')[0];

        const seasonId = getSeasonId(dateStr);
        const exemptions = await getExemptionsForSeason(db, seasonId);

        const allRollsRes = await db.execute({
            sql: `
                SELECT r.*, u.username, u.display_name, u.avatar_url 
                FROM roll r
                JOIN user u ON r.user_id = u.id
                WHERE r.date = ?
            `,
            args: [dateStr]
        });
        const allRolls = allRollsRes.rows;

        if (allRolls.length === 0) {
            return new Response(JSON.stringify({ error: "No hay tiradas registradas hoy para publicar veredicto" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const { rollChoreMap, sortedRolls } = assignDailyChores(allRolls, exemptions);

        const choresAssigned = {
            lava: [] as string[],
            saca: [] as string[],
            pone: [] as string[],
            zafaron: [] as string[],
            exentos: [] as string[]
        };

        for (const roll of sortedRolls) {
            const displayName = String(roll.display_name || roll.username);
            const chore = rollChoreMap.get(roll.id);

            if (chore.code === "LA") {
                choresAssigned.lava.push(displayName);
            } else if (chore.code === "SA") {
                choresAssigned.saca.push(displayName);
            } else if (chore.code === "PO") {
                choresAssigned.pone.push(displayName);
            } else {
                const userExemptions = exemptions.filter(e => String(e.user_id) === String(roll.user_id));
                if (userExemptions.length > 0) {
                    const exCodes = userExemptions.map(e => e.chore_code).join(", ");
                    choresAssigned.exentos.push(`${displayName} (${exCodes})`);
                } else {
                    choresAssigned.zafaron.push(displayName);
                }
            }
        }

        // Format Date for Discord Title (e.g. DD/MM/YYYY)
        const [year, month, day] = dateStr.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        await sendDiscordVerdict(formattedDate, choresAssigned);

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
