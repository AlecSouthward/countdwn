"""Countdwn: stdlib-only server. One SQLite file, four endpoints, one static page."""
import json
import os
import re
import sqlite3
from datetime import date
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

NOT_FOUND_MSG = "Not found."

DB_PATH = os.environ.get("DB_PATH", "countdwn.db")
HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8080"))
INDEX = Path(__file__).with_name("index.html")

SCHEMA = """
CREATE TABLE IF NOT EXISTS countdowns (
  id         INTEGER PRIMARY KEY,
  title      TEXT NOT NULL,
  target     TEXT NOT NULL,
  start      TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
"""


def run(sql, args=()):
    """Run one statement on a short-lived connection. Returns (rows, lastrowid, rowcount)."""
    con = sqlite3.connect(DB_PATH)
    try:
        con.row_factory = sqlite3.Row
        cur = con.execute(sql, args)
        rows = [dict(r) for r in cur.fetchall()]
        con.commit()
        return rows, cur.lastrowid, cur.rowcount
    finally:
        con.close()


def clean(data):
    if not isinstance(data, dict):
        raise ValueError("Invalid request.")  # noqa: TRY004 - ValueError maps to a 400
    title = str(data.get("title", "")).strip()
    if not title or len(title) > 200:
        raise ValueError("Title is required (max 200 characters).")
    try:
        target = date.fromisoformat(str(data.get("target", "")))
        start = date.fromisoformat(data["start"]) if data.get("start") else date.today()
    except ValueError:
        raise ValueError("Dates must be YYYY-MM-DD.")
    if start > target:
        raise ValueError("Start date must be on or before the target date.")
    return title, target.isoformat(), start.isoformat()


def get_one(item_id):
    rows, _, _ = run("SELECT id, title, target, start FROM countdowns WHERE id = ?", (item_id,))
    return rows[0] if rows else None


class Handler(BaseHTTPRequestHandler):
    def send(self, code, body=None, ctype="application/json"):
        if body is None:
            payload = b""
        elif isinstance(body, bytes):
            payload = body
        else:
            payload = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def item_id(self):
        m = re.fullmatch(r"/api/countdowns/(\d+)", self.path.split("?")[0])
        return int(m.group(1)) if m else None

    def read_json(self):
        n = int(self.headers.get("Content-Length") or 0)
        if n > 10_000:
            raise ValueError("Request too large.")
        return json.loads(self.rfile.read(n) or b"{}")

    def do_GET(self):
        path = self.path.split("?")[0]
        if path in ("/", "/index.html"):
            return self.send(200, INDEX.read_bytes(), "text/html; charset=utf-8")
        if path == "/api/countdowns":
            rows, _, _ = run("SELECT id, title, target, start FROM countdowns ORDER BY target")
            return self.send(200, rows)
        self.send(404, {"error": NOT_FOUND_MSG})

    def do_POST(self):
        if self.path.split("?")[0] != "/api/countdowns":
            return self.send(404, {"error": NOT_FOUND_MSG})
        try:
            title, target, start = clean(self.read_json())
        except ValueError as e:
            return self.send(400, {"error": str(e)})
        _, new_id, _ = run(
            "INSERT INTO countdowns (title, target, start) VALUES (?, ?, ?)",
            (title, target, start),
        )
        self.send(201, get_one(new_id))

    def do_PUT(self):
        item_id = self.item_id()
        if item_id is None:
            return self.send(404, {"error": NOT_FOUND_MSG})
        try:
            title, target, start = clean(self.read_json())
        except ValueError as e:
            return self.send(400, {"error": str(e)})
        _, _, n = run(
            "UPDATE countdowns SET title = ?, target = ?, start = ? WHERE id = ?",
            (title, target, start, item_id),
        )
        if n == 0:
            return self.send(404, {"error": NOT_FOUND_MSG})
        self.send(200, get_one(item_id))

    def do_DELETE(self):
        item_id = self.item_id()
        if item_id is None:
            return self.send(404, {"error": NOT_FOUND_MSG})
        _, _, n = run("DELETE FROM countdowns WHERE id = ?", (item_id,))
        self.send(204 if n else 404, None if n else {"error": NOT_FOUND_MSG})


def init_db():
    con = sqlite3.connect(DB_PATH)
    con.execute("PRAGMA journal_mode=WAL")
    con.execute(SCHEMA)
    con.commit()
    con.close()


if __name__ == "__main__":
    init_db()
    print(f"Countdwn listening on http://{HOST}:{PORT}  (db: {DB_PATH})")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
