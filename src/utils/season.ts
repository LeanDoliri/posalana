export function getSeasonId(dateStr: string): string {
    const d = new Date(dateStr);
    const month = d.getMonth() + 1; // 1-12
    const day = d.getDate();
    const year = d.getFullYear();

    // Verano: Dec 21 - Mar 20
    // Otoño: Mar 21 - Jun 20
    // Invierno: Jun 21 - Sep 20
    // Primavera: Sep 21 - Dec 20

    if ((month === 12 && day >= 21) || month === 1 || month === 2 || (month === 3 && day <= 20)) {
        // If it's Dec, it belongs to the summer that ends in the NEXT year
        const seasonYear = month === 12 ? year + 1 : year;
        return `${seasonYear}-verano`;
    } else if ((month === 3 && day >= 21) || month === 4 || month === 5 || (month === 6 && day <= 20)) {
        return `${year}-otoño`;
    } else if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day <= 20)) {
        return `${year}-invierno`;
    } else {
        return `${year}-primavera`;
    }
}

export function formatSeasonName(seasonId: string): string {
    const parts = seasonId.split('-');
    if (parts.length !== 2) return seasonId;
    const year = parts[0];
    const season = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    return `${season} ${year}`;
}

export async function calculateSeasonPoints(db: any, seasonId: string) {
    // 1. Get all rolls that belong to the season
    // Since we don't store season_id in roll, we must fetch rolls and filter them, or just fetch all and filter by getSeasonId.
    // For simplicity, we fetch all rolls (or rolls in a date range, but fetching all is fine for small DBs).
    const rollsRes = await db.execute("SELECT r.*, u.username, u.avatar_url FROM roll r JOIN user u ON r.user_id = u.id");
    const allRolls = rollsRes.rows.filter((r: any) => getSeasonId(r.date as string) === seasonId);

    // 2. Get exemptions and manual points for this season
    const exemptionsRes = await db.execute({
        sql: "SELECT user_id, chore_code FROM exemption WHERE season_id = ?",
        args: [seasonId]
    });
    const exemptions = exemptionsRes.rows;

    const manualPointsRes = await db.execute({
        sql: "SELECT user_id, chore_code, points FROM manual_points WHERE season_id = ?",
        args: [seasonId]
    });
    const manualPoints = manualPointsRes.rows;

    // 3. Group rolls by date
    const rollsByDate = new Map<string, any[]>();
    for (const roll of allRolls) {
        if (!rollsByDate.has(roll.date as string)) rollsByDate.set(roll.date as string, []);
        rollsByDate.get(roll.date as string)!.push(roll);
    }

    // 4. Calculate points
    // Map: user_id -> { username, avatar_url, scores: { LA: 0, SA: 0, PO: 0 } }
    const userStats = new Map<string, any>();
    
    // Initialize users that have manual points or exemptions even if they didn't roll
    const initUser = (userId: string, username: string = "Desconocido", avatar_url: string = "") => {
        if (!userStats.has(userId)) {
            userStats.set(userId, { id: userId, username, avatar_url, scores: { LA: 0, SA: 0, PO: 0 } });
        }
    };

    const chores = ["LA", "SA", "PO"];
    
    for (const [date, dailyRolls] of rollsByDate.entries()) {
        const sortedRolls = [...dailyRolls].sort((a, b) => {
            if (a.die1 !== b.die1) return (a.die1 as number) - (b.die1 as number);
            if (a.die2 !== b.die2) return (a.die2 as number) - (b.die2 as number);
            if (a.die3 !== b.die3) return (a.die3 as number) - (b.die3 as number);
            return (a.die4 as number) - (b.die4 as number);
        });

        const assignedChores = new Map();
        for (const roll of sortedRolls) {
            assignedChores.set(roll.id, "NA");
            initUser(roll.user_id, roll.username, roll.avatar_url);
        }

        for (const chore of chores) {
            for (const roll of sortedRolls) {
                if (assignedChores.get(roll.id) !== "NA") continue;

                const isExempt = exemptions.some((e: any) => e.user_id === roll.user_id && e.chore_code === chore);
                if (!isExempt) {
                    assignedChores.set(roll.id, chore);
                    userStats.get(roll.user_id).scores[chore]++;
                    break;
                }
            }
        }
    }

    // Apply manual points
    for (const mp of manualPoints) {
        if (!userStats.has(mp.user_id as string)) {
            // Find user details from DB
            const uRes = await db.execute({ sql: "SELECT username, avatar_url FROM user WHERE id = ?", args: [mp.user_id] });
            const u = uRes.rows[0];
            initUser(mp.user_id as string, u?.username as string, u?.avatar_url as string);
        }
        userStats.get(mp.user_id as string).scores[mp.chore_code as string] = mp.points;
    }

    // Convert map to array
    return Array.from(userStats.values());
}
