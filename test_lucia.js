import { lucia } from "./src/auth.js";

async function test() {
    const { default: db } = await import("./src/db/index.js");
    const sessionRes = await db.execute("SELECT id FROM session LIMIT 1");
    if (sessionRes.rows.length === 0) {
        console.log("No sessions");
        process.exit(0);
    }
    const sessionId = sessionRes.rows[0].id;
    const { user, session } = await lucia.validateSession(sessionId);
    console.log("User from Lucia:", user);
    process.exit(0);
}
test();
