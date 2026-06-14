import { lucia } from "./src/auth.js";
import db from "./src/db/index.js";

async function run() {
    const sessionRes = await db.execute("SELECT id, user_id FROM session LIMIT 1");
    if (sessionRes.rows.length === 0) return console.log("No session");
    
    const sessionId = sessionRes.rows[0].id;
    const userId = sessionRes.rows[0].user_id;

    console.log("Found session for user:", userId);

    // Let's validate the session using Lucia directly!
    const { user, session } = await lucia.validateSession(sessionId);
    console.log("Lucia validateSession returned user:", user);
    
}
run();
