export const chores = [
    { label: "Lava los platos", code: "LA", emoji: "🧽" },
    { label: "Saca la mesa", code: "SA", emoji: "🗑️" },
    { label: "Pone la mesa", code: "PO", emoji: "🍽️" }
];

export const safeChore = { label: "Nada", code: "NA", emoji: "🎉" };

export function assignDailyChores(dailyRolls: any[], exemptions: any[]) {
    // 1. Sort by sum of dice ascending (worst luck first)
    const sortedRolls = [...dailyRolls].map(r => ({
        ...r,
        sum: Number(r.die1) + Number(r.die2) + Number(r.die3) + Number(r.die4)
    })).sort((a, b) => {
        if (a.sum !== b.sum) return a.sum - b.sum;
        // fallback to insertion order or id to keep stable sort
        return String(a.id).localeCompare(String(b.id));
    });

    const rollChoreMap = new Map();
    for (const roll of sortedRolls) {
        rollChoreMap.set(roll.id, safeChore);
    }

    // 2. Check Cláusula Lomito
    let lomitoActivated = false;
    let lomitoPlayers: string[] = [];
    for (let i = 0; i < sortedRolls.length; i++) {
        for (let j = i + 1; j < sortedRolls.length; j++) {
            const a = sortedRolls[i];
            const b = sortedRolls[j];
            
            // Dice are exactly the same combination (ignoring order)
            const aDice = [a.die1, a.die2, a.die3, a.die4].map(Number).sort((x, y) => x - y);
            const bDice = [b.die1, b.die2, b.die3, b.die4].map(Number).sort((x, y) => x - y);
            
            if (aDice[0] === bDice[0] && aDice[1] === bDice[1] && aDice[2] === bDice[2] && aDice[3] === bDice[3]) {
                lomitoActivated = true;
                if (!lomitoPlayers.includes(String(a.display_name))) lomitoPlayers.push(String(a.display_name));
                if (!lomitoPlayers.includes(String(b.display_name))) lomitoPlayers.push(String(b.display_name));
            }
        }
    }

    // 3. Assign chores
    let choreIndex = 0;
    for (const roll of sortedRolls) {
        if (choreIndex >= chores.length) break;
        
        const potentialChore = chores[choreIndex];
        const isExempt = exemptions.some(e => String(e.user_id) === String(roll.user_id) && e.chore_code === potentialChore.code);
        
        if (isExempt) {
            continue; // Dodges chore
        } else {
            rollChoreMap.set(roll.id, potentialChore);
            choreIndex++;
        }
    }

    return { rollChoreMap, lomitoActivated, lomitoPlayers, sortedRolls };
}
