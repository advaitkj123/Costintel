import sqlite3
import os

db_path = 'sql_app.db'
if os.path.exists(db_path):
    try:
        with sqlite3.connect(db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("PRAGMA table_info(anomalies)")
            columns = [c[1] for c in cursor.fetchall()]
            if 'email_sent' not in columns:
                print("Adding email_sent column...")
                conn.execute("ALTER TABLE anomalies ADD COLUMN email_sent BOOLEAN DEFAULT 0")
                print("email_sent added.")
            if 'severity' not in columns:
                print("Adding severity column...")
                conn.execute("ALTER TABLE anomalies ADD COLUMN severity VARCHAR(50) DEFAULT 'Medium'")
                print("severity added.")
            else:
                print("Column email_sent already exists.")
    except Exception as e:
        print(f"Error: {e}")
else:
    print(f"Database not found at {db_path}")
