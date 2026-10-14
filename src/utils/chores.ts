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

// Cómo se ve cada tarea con el sistema de diseño de Lutvia (perfil POSALANA).
// - etiqueta: el matiz al 15 % del color de su sílaba, siempre con texto lutvia-oscuro.
// - dado: el dado que decide va en el color de su sílaba (el estado también se dice en texto).
// - barra: acento gráfico (borde) del color de la sílaba.
export const choreStyles: Record<string, { etiqueta: string; dado: string; barra: string }> = {
    PO: { etiqueta: "bg-lutvia-rosa/15", dado: "text-lutvia-rosa", barra: "border-lutvia-rosa" },
    SA: { etiqueta: "bg-lutvia-cyan/15", dado: "text-lutvia-cyan", barra: "border-lutvia-cyan" },
    LA: { etiqueta: "bg-lutvia-violeta/15", dado: "text-lutvia-violeta", barra: "border-lutvia-violeta" },
    NA: { etiqueta: "bg-lutvia-gris", dado: "text-lutvia-texto-suave", barra: "border-lutvia-oscuro-16" },
};
