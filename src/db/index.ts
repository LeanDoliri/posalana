import { createClient } from "@libsql/client";

const db = createClient({
  url: "file:sqlite.db",
});

// Initialize database schema
db.executeMultiple(`
  CREATE TABLE IF NOT EXISTS user (
      id TEXT NOT NULL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      avatar_url TEXT
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
`).catch(console.error);

export default db;
