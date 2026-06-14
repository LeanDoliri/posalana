import { createClient } from "@libsql/client";
import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";

async function run() {
    const db = createClient({ url: "file:sqlite.db" });
    const adapter = new LibSQLAdapter(db, {
        user: "user",
        session: "session"
    });
    
    // get a session
    const res = await db.execute("SELECT id FROM session LIMIT 1");
    if (res.rows.length === 0) return console.log("No session");
    const sessionId = res.rows[0].id;
    
    const [session, user] = await adapter.getSessionAndUser(sessionId);
    console.log("Session:", session);
    console.log("User:", user);
}
run();
