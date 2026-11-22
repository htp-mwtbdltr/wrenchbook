"""SQLite storage. The database and uploaded files both live under /data."""
import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path

DB_PATH = os.environ.get("WRENCHBOOK_DB", "/data/wrenchbook.db")
FILES_DIR = Path(os.environ.get("WRENCHBOOK_FILES", str(Path(DB_PATH).parent / "files")))

SCHEMA = """
CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY,
    kind TEXT NOT NULL DEFAULT 'car',
    name TEXT NOT NULL,
    year TEXT NOT NULL DEFAULT '',
    make TEXT NOT NULL DEFAULT '',
    model TEXT NOT NULL DEFAULT '',
    trim TEXT NOT NULL DEFAULT '',
    engine TEXT NOT NULL DEFAULT '',
    vin TEXT NOT NULL DEFAULT '',
    plate TEXT NOT NULL DEFAULT '',
    color TEXT NOT NULL DEFAULT '',
    usage_unit TEXT NOT NULL DEFAULT 'mi',
    purchase_date TEXT NOT NULL DEFAULT '',
    purchase_price REAL,
    purchase_reading REAL,
    location TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    photo_id INTEGER,
    archived INTEGER NOT NULL DEFAULT 0,
    sort INTEGER NOT NULL DEFAULT 0,
    created TEXT,
    updated TEXT
);
CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    template TEXT NOT NULL DEFAULT 'custom',
    title TEXT NOT NULL,
    columns TEXT NOT NULL DEFAULT '[]',
    rows TEXT NOT NULL DEFAULT '[]',
    note TEXT NOT NULL DEFAULT '',
    sort INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    value REAL NOT NULL,
    created TEXT
);
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    reading REAL,
    category TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    cost REAL,
    performed_by TEXT NOT NULL DEFAULT '',
    parts TEXT NOT NULL DEFAULT '[]',
    created TEXT,
    updated TEXT
);
CREATE TABLE IF NOT EXISTS guides (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    tools TEXT NOT NULL DEFAULT '',
    parts TEXT NOT NULL DEFAULT '',
    difficulty TEXT NOT NULL DEFAULT '',
    duration TEXT NOT NULL DEFAULT '',
    created TEXT,
    updated TEXT
);
CREATE TABLE IF NOT EXISTS guide_assets (
    guide_id INTEGER NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    PRIMARY KEY (guide_id, asset_id)
);
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    every_dist REAL,
    every_months INTEGER,
    notes TEXT NOT NULL DEFAULT '',
    guide_id INTEGER REFERENCES guides(id) ON DELETE SET NULL,
    sort INTEGER NOT NULL DEFAULT 0,
    created TEXT
);
CREATE TABLE IF NOT EXISTS log_tasks (
    log_id INTEGER NOT NULL REFERENCES logs(id) ON DELETE CASCADE,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    PRIMARY KEY (log_id, task_id)
);
CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY,
    asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
    log_id INTEGER REFERENCES logs(id) ON DELETE CASCADE,
    guide_id INTEGER REFERENCES guides(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    mime TEXT NOT NULL DEFAULT 'application/octet-stream',
    size INTEGER NOT NULL DEFAULT 0,
    stored TEXT NOT NULL,
    caption TEXT NOT NULL DEFAULT '',
    created TEXT
);
CREATE INDEX IF NOT EXISTS logs_asset ON logs(asset_id, date);
CREATE INDEX IF NOT EXISTS readings_asset ON readings(asset_id, date);
CREATE INDEX IF NOT EXISTS sections_asset ON sections(asset_id, sort);
CREATE INDEX IF NOT EXISTS tasks_asset ON tasks(asset_id, sort);
"""


def now():
    return datetime.now().isoformat(timespec="seconds")


@contextmanager
def db():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init():
    Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)
    FILES_DIR.mkdir(parents=True, exist_ok=True)
    with db() as conn:
        conn.execute("PRAGMA journal_mode = WAL")
        conn.executescript(SCHEMA)
