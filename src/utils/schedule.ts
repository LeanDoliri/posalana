import type { Client } from "@libsql/client";
import { publishDailyVerdict } from "./verdict.js";

// Horario de tirada (hora de Argentina, GMT-3). Configurable desde /admin;
// estos son los valores por defecto si no hay nada guardado en `settings`.
export const DEFAULT_ROLL_START = "10:00";
export const DEFAULT_ROLL_END = "12:30";

// Última fecha (inclusive) en la que se muestra el pop-up que anuncia el horario nuevo.
export const SCHEDULE_NOTICE_UNTIL = "2026-10-18";

export type RollWindowStatus = "before" | "open" | "closed";

export interface RollSchedule {
    start: string;
    end: string;
    autoVerdictEnabled: boolean;
    autoVerdictLastDate: string | null;
    autoVerdictLastAt: string | null;
}

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidTime(value: string): boolean {
    return TIME_RE.test(value);
}

export function timeToMinutes(value: string): number {
    const [h, m] = value.split(":").map(Number);
    return h * 60 + m;
}

// Fecha y hora actuales en Argentina (GMT-3, sin horario de verano).
export function getArgentinaNow() {
    const now = new Date();
    now.setHours(now.getHours() - 3);
    const iso = now.toISOString();
    const dateStr = iso.split("T")[0];
    const timeStr = iso.split("T")[1].substring(0, 5);
    const secondsStr = iso.split("T")[1].substring(0, 8);
    return { dateStr, timeStr, secondsStr, minutes: timeToMinutes(timeStr) };
}

export async function getRollSchedule(db: Client): Promise<RollSchedule> {
    const res = await db.execute(`
        SELECT key, value FROM settings
        WHERE key IN ('roll_window_start', 'roll_window_end', 'auto_verdict_enabled', 'auto_verdict_last_date', 'auto_verdict_last_at')
    `);
    const map = new Map<string, string>();
    res.rows.forEach((r: any) => map.set(String(r.key), String(r.value)));

    let start = map.get("roll_window_start") || DEFAULT_ROLL_START;
    let end = map.get("roll_window_end") || DEFAULT_ROLL_END;
    if (!isValidTime(start) || !isValidTime(end) || timeToMinutes(start) >= timeToMinutes(end)) {
        start = DEFAULT_ROLL_START;
        end = DEFAULT_ROLL_END;
    }

    return {
        start,
        end,
        autoVerdictEnabled: map.get("auto_verdict_enabled") !== "0",
        autoVerdictLastDate: map.get("auto_verdict_last_date") || null,
        autoVerdictLastAt: map.get("auto_verdict_last_at") || null,
    };
}

export function getRollWindowStatus(schedule: RollSchedule, minutes = getArgentinaNow().minutes): RollWindowStatus {
    if (minutes < timeToMinutes(schedule.start)) return "before";
    if (minutes < timeToMinutes(schedule.end)) return "open";
    return "closed";
}

// Cache por instancia: una vez resuelto el veredicto automático del día no
// volvemos a consultar la base en cada request.
let handledDate: string | null = null;

/**
 * Publica el veredicto final automático si ya pasó la hora de cierre y todavía
 * no se publicó hoy. Es idempotente: el "claim" en `settings` es atómico, así
 * que aunque lleguen varios requests a la vez solo uno envía el mensaje.
 * Se dispara desde el middleware (cualquier visita, incluido el polling del
 * inicio) y desde el cron de Vercel como red de seguridad.
 */
export async function maybeSendAutoVerdict(db: Client): Promise<"sent" | "skipped" | "no-rolls"> {
    const now = getArgentinaNow();
    if (handledDate === now.dateStr) return "skipped";

    const schedule = await getRollSchedule(db);
    if (!schedule.autoVerdictEnabled) return "skipped";
    if (getRollWindowStatus(schedule, now.minutes) !== "closed") return "skipped";
    if (schedule.autoVerdictLastDate === now.dateStr) {
        handledDate = now.dateStr;
        return "skipped";
    }

    const claim = await db.execute({
        sql: `INSERT INTO settings (key, value) VALUES ('auto_verdict_last_date', ?)
              ON CONFLICT(key) DO UPDATE SET value = excluded.value WHERE settings.value <> excluded.value`,
        args: [now.dateStr]
    });
    if (claim.rowsAffected === 0) {
        handledDate = now.dateStr;
        return "skipped";
    }

    try {
        const result = await publishDailyVerdict(db, now.dateStr, { automatic: true });
        const lastAt = result.sent ? now.secondsStr : "sin tiradas";
        await db.execute({
            sql: "INSERT INTO settings (key, value) VALUES ('auto_verdict_last_at', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            args: [lastAt]
        });
        handledDate = now.dateStr;
        return result.sent ? "sent" : "no-rolls";
    } catch (err) {
        // Liberamos el claim para que el próximo request lo reintente.
        console.error("Error publicando el veredicto automático:", err);
        await db.execute({
            sql: "DELETE FROM settings WHERE key = 'auto_verdict_last_date' AND value = ?",
            args: [now.dateStr]
        }).catch(() => {});
        throw err;
    }
}
