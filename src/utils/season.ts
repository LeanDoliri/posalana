import { assignDailyChores } from './chores.js';

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

export function getPreviousSeasons(seasonId: string, count: number): string[] {
    const seasonsOrder = ['verano', 'otoño', 'invierno', 'primavera'];
    const parts = seasonId.split('-');
    if (parts.length !== 2) return [seasonId];
    
    let year = parseInt(parts[0]);
    let seasonName = parts[1];
    
    let currentIndex = seasonsOrder.indexOf(seasonName);
    if (currentIndex === -1) return [seasonId];
    
    const result: string[] = [seasonId];
    
    for (let i = 0; i < count; i++) {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = 3;
            year--;
        }
        const prevSeasonName = seasonsOrder[currentIndex];
        result.push(`${year}-${prevSeasonName}`);
    }
    
    return result;
}


export async function calculateSeasonPoints(db: any, seasonId: string) {
    // 1. Get all rolls that belong to the season
    // Since we don't store season_id in roll, we must fetch rolls and filter them, or just fetch all and filter by getSeasonId.
    // For simplicity, we fetch all rolls (or rolls in a date range, but fetching all is fine for small DBs).
    const rollsRes = await db.execute("SELECT r.*, u.username, u.display_name, u.avatar_url FROM roll r JOIN user u ON r.user_id = u.id");
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
    // Map: user_id -> { username, display_name, avatar_url, scores: { LA: 0, SA: 0, PO: 0 } }
    const userStats = new Map<string, any>();
    
    // Initialize users that have manual points or exemptions even if they didn't roll
    const initUser = (userId: string, username: string = "Desconocido", display_name: string = "Desconocido", avatar_url: string = "") => {
        if (!userStats.has(userId)) {
            userStats.set(userId, { id: userId, username, display_name, avatar_url, scores: { LA: 0, SA: 0, PO: 0 } });
        }
    };

    const chores = ["LA", "SA", "PO"];
    
    for (const [date, dailyRolls] of rollsByDate.entries()) {
        for (const roll of dailyRolls) {
            initUser(roll.user_id as string, roll.username as string, roll.display_name as string, roll.avatar_url as string);
        }

        const { rollChoreMap, lomitoActivated } = assignDailyChores(dailyRolls, exemptions);
        
        for (const [rollId, chore] of rollChoreMap.entries()) {
            if (chore.code !== "NA") {
                const roll = dailyRolls.find((r: any) => r.id === rollId);
                if (roll) userStats.get(roll.user_id).scores[chore.code]++;
            }
        }
    }

    // Apply manual points
    for (const mp of manualPoints) {
        if (!userStats.has(mp.user_id as string)) {
            // Find user details from DB
            const uRes = await db.execute({ sql: "SELECT username, display_name, avatar_url FROM user WHERE id = ?", args: [mp.user_id] });
            const u = uRes.rows[0];
            initUser(mp.user_id as string, u?.username as string, u?.display_name as string, u?.avatar_url as string);
        }
        userStats.get(mp.user_id as string).scores[mp.chore_code as string] = mp.points;
    }

    // Convert map to array
    return Array.from(userStats.values());
}

export async function calculateYearPoints(db: any, year: string) {
    const seasons = [`${year}-verano`, `${year}-otoño`, `${year}-invierno`, `${year}-primavera`];
    const userStats = new Map<string, any>();
    
    for (const seasonId of seasons) {
        const seasonStats = await calculateSeasonPoints(db, seasonId);
        for (const stat of seasonStats) {
            if (!userStats.has(stat.id)) {
                userStats.set(stat.id, {
                    id: stat.id,
                    username: stat.username,
                    display_name: stat.display_name,
                    avatar_url: stat.avatar_url,
                    scores: { LA: 0, SA: 0, PO: 0 }
                });
            }
            const user = userStats.get(stat.id);
            user.scores.LA += stat.scores.LA;
            user.scores.SA += stat.scores.SA;
            user.scores.PO += stat.scores.PO;
        }
    }
    
    return Array.from(userStats.values());
}
