export async function sendDiscordRoll(
    displayName: string,
    dice: number[],
    lomitoActivated: boolean,
    lomitoPlayers: string[]
) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.warn("DISCORD_WEBHOOK_URL is not configured.");
        return;
    }

    const diceStr = dice.join(" - ");
    let content = "";
    let embeds: any[] = [];

    if (lomitoActivated && lomitoPlayers.length > 0) {
        // Lomito Alert!
        content = "🥪🎉 @here **¡CLÁUSULA LOMITO ACTIVADA!** 🥪🎉";
        embeds = [{
            title: "🥪 ¡Doble Tirada Idéntica Detectada! 🥪",
            description: `**${lomitoPlayers.join(" y ")}** han sacado exactamente los mismos dados: **${diceStr}**.\n\n¡Hoy se almuerzan lomitos con papas garantizados por **LUTVIA**! 🍟🥪`,
            color: 13400063, // Soft purple color (Hex: #CC66FF)
            footer: {
                text: "POSALANA • Cláusula Lomito"
            },
            timestamp: new Date().toISOString()
        }];
    } else {
        // Standard notification
        embeds = [{
            title: "🎲 ¡Nueva Tirada Registrada!",
            description: `**${displayName}** sacó: **${diceStr}**\n\n👉 ¿Y vos? ¿Zafás o lavás? Entrá a probar tu suerte ahora: https://posalana.vercel.app/`,
            color: 52428, // Cyan color (Hex: #00CCCC)
            footer: {
                text: "POSALANA • Suerte del Día"
            },
            timestamp: new Date().toISOString()
        }];
    }

    try {
        const res = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content, embeds })
        });
        if (!res.ok) {
            console.error("Failed to send Discord notification:", await res.text());
        }
    } catch (err) {
        console.error("Error sending Discord notification:", err);
    }
}

export async function sendDiscordVerdict(
    dateStr: string,
    choresAssigned: {
        lava: string[];
        saca: string[];
        pone: string[];
        zafaron: string[];
        exentos: string[];
    }
) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.warn("DISCORD_WEBHOOK_URL is not configured.");
        return;
    }

    const lavaStr = choresAssigned.lava.length > 0 ? choresAssigned.lava.join(", ") : "Nadie";
    const sacaStr = choresAssigned.saca.length > 0 ? choresAssigned.saca.join(", ") : "Nadie";
    const poneStr = choresAssigned.pone.length > 0 ? choresAssigned.pone.join(", ") : "Nadie";
    const zafaronStr = choresAssigned.zafaron.length > 0 ? choresAssigned.zafaron.join(", ") : "Ninguno";
    const exentosStr = choresAssigned.exentos.length > 0 ? choresAssigned.exentos.join(", ") : "Ninguno";

    const embed = {
        title: `🏆 VEREDICTO FINAL - ${dateStr}`,
        description: "El destino ha hablado. Aquí está la distribución oficial de tareas para hoy:",
        color: 15346264, // Primary pink color (Hex: #EA2A58)
        fields: [
            {
                name: "🧽 LAVA",
                value: `**${lavaStr}**`,
                inline: false
            },
            {
                name: "🗑️ SACA",
                value: `**${sacaStr}**`,
                inline: false
            },
            {
                name: "🍽️ PONE",
                value: `**${poneStr}**`,
                inline: false
            },
            {
                name: "🎉 ZAFARON",
                value: zafaronStr,
                inline: false
            },
            {
                name: "🛡️ EXENTOS HOY",
                value: exentosStr,
                inline: false
            }
        ],
        footer: {
            text: "👉 Mirá todo el historial y estadísticas en detalle en la app: https://posalana.vercel.app/"
        },
        timestamp: new Date().toISOString()
    };

    try {
        const res = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ embeds: [embed] })
        });
        if (!res.ok) {
            console.error("Failed to send Discord verdict:", await res.text());
        }
    } catch (err) {
        console.error("Error sending Discord verdict:", err);
    }
}
