import { createClient } from "@libsql/client";

const dbUrl = process.env.DATABASE_URL || "file:sqlite.db";

const db = createClient({
  url: dbUrl,
});

// Initialize database schema
db.executeMultiple(`
  CREATE TABLE IF NOT EXISTS user (
      id TEXT NOT NULL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS session (
      id TEXT NOT NULL PRIMARY KEY,
      expires_at INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES user(id)
  );

  CREATE TABLE IF NOT EXISTS roll (
      id TEXT NOT NULL PRIMARY KEY,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      die1 INTEGER NOT NULL,
      die2 INTEGER NOT NULL,
      die3 INTEGER NOT NULL,
      die4 INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES user(id),
      UNIQUE(user_id, date)
  );

  CREATE TABLE IF NOT EXISTS exemption (
      id TEXT NOT NULL PRIMARY KEY,
      user_id TEXT NOT NULL,
      season_id TEXT NOT NULL,
      chore_code TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES user(id),
      UNIQUE(user_id, season_id, chore_code)
  );

  CREATE TABLE IF NOT EXISTS manual_points (
      id TEXT NOT NULL PRIMARY KEY,
      user_id TEXT NOT NULL,
      season_id TEXT NOT NULL,
      chore_code TEXT NOT NULL,
      points INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES user(id),
      UNIQUE(user_id, season_id, chore_code)
  );

  CREATE TABLE IF NOT EXISTS settings (
      key TEXT NOT NULL PRIMARY KEY,
      value TEXT NOT NULL
  );
`).catch(console.error);

// Migration: Add 'role' column if it doesn't exist, and make ldoliri admin
(async () => {
  try {
      await db.execute("ALTER TABLE user ADD COLUMN role TEXT DEFAULT 'user'");
  } catch (e) {
      // Column probably already exists, ignore
  }

  try {
      await db.execute("ALTER TABLE roll ADD COLUMN time TEXT");
  } catch (e) {
      // Column probably already exists, ignore
  }
  
  try {
      await db.execute({
          sql: "UPDATE user SET role = 'admin' WHERE username = ?",
          args: ["ldoliri"]
      });
  } catch (e) {
      console.error("Failed to upgrade ldoliri to admin:", e);
  }
})();

export default db;
