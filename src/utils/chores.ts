export const chores = [
    { label: "Lava los platos", code: "LA", emoji: "🧽" },
    { label: "Saca la mesa", code: "SA", emoji: "🗑️" },
    { label: "Pone la mesa", code: "PO", emoji: "🍽️" }
];

export const safeChore = { label: "Nada", code: "NA", emoji: "🎉" };

export function assignDailyChores(dailyRolls: any[], exemptions: any[]) {
    // 1. Sort by dice values: compare die1, then die2, then die3, then die4 ascending (worst luck first)
    const sortedRolls = [...dailyRolls].sort((a, b) => {
        const d1a = Number(a.die1), d1b = Number(b.die1);
        if (d1a !== d1b) return d1a - d1b;
        
        const d2a = Number(a.die2), d2b = Number(b.die2);
        if (d2a !== d2b) return d2a - d2b;
        
        const d3a = Number(a.die3), d3b = Number(b.die3);
        if (d3a !== d3b) return d3a - d3b;
        
        const d4a = Number(a.die4), d4b = Number(b.die4);
        if (d4a !== d4b) return d4a - d4b;
        
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
