import db from './src/db/index.js';

async function check() {
    const res = await db.execute("SELECT id, username, display_name FROM user");
    console.log("Users:", res.rows);
    process.exit(0);
}
check();
