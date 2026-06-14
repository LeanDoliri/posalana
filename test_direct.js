import { createClient } from "@libsql/client";

async function run() {
    const db = createClient({ url: "file:sqlite.db" });
    const res = await db.execute("PRAGMA table_info(user)");
    console.log("Columns in user table:", res.rows.map(r => r.name));
    
    const userRes = await db.execute("SELECT * FROM user");
    console.log("Users:", userRes.rows);
}
run();
