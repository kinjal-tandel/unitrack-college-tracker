import sqlite3
conn = sqlite3.connect('database.db')
cursor = conn.cursor()
cursor.execute('''
               CREATE TABLE IF NOT EXISTS assignments (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               user_id INTEGER,
               name TEXT NOT NULL,
               due TEXT,
               status TEXT DEFAULT 'Pending'
               )
               ''')
cursor.execute('''
               CREATE TABLE IF NOT EXISTS expenses (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               user_id INTEGER,
               name TEXT NOT NULL,
               amount REAL NOT NULL
               )
               ''')
cursor.execute('''
               CREATE TABLE IF NOT EXISTS classes (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               user_id INTEGER,
               subject TEXT NOT NULL,
               day TEXT,
               time TEXT
               )
               ''')
cursor.execute('''
               CREATE TABLE IF NOT EXISTS attendance (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               user_id INTEGER,
               subject TEXT NOT NULL,
               held REAL,
               attended REAL
               )
               ''')
cursor.execute('''
               CREATE TABLE IF NOT EXISTS subjects (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               user_id INTEGER,
               name TEXT NOT NULL,
               credit REAL,
               grade REAL
               )
               ''')
cursor.execute('''
               CREATE TABLE IF NOT EXISTS users (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               username TEXT UNIQUE NOT NULL,
               password TEXT NOT NULL
               )
               ''')
conn.commit()
conn.close()
print("Database and table created sucessfully!")