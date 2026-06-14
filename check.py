import sqlite3
import sys

try:
    conn = sqlite3.connect('sqlite.db')
    cursor = conn.cursor()
    cursor.execute("PRAGMA table_info(user)")
    columns = cursor.fetchall()
    print("Columns:", columns)
    
    cursor.execute("SELECT id, username, display_name FROM user")
    rows = cursor.fetchall()
    print("Users:", rows)
except Exception as e:
    print(e)
