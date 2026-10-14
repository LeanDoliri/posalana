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
            
            // Dice are exactly the same values in the exact same order
            if (
                Number(a.die1) === Number(b.die1) &&
                Number(a.die2) === Number(b.die2) &&
                Number(a.die3) === Number(b.die3) &&
                Number(a.die4) === Number(b.die4)
            ) {
                lomitoActivated = true;
                const nameA = a.display_name || a.username || "Usuario";
                const nameB = b.display_name || b.username || "Usuario";
                if (!lomitoPlayers.includes(nameA)) lomitoPlayers.push(nameA);
                if (!lomitoPlayers.includes(nameB)) lomitoPlayers.push(nameB);
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
