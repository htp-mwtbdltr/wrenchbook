"""Wrenchbook: maintenance manual and service log for vehicles and equipment."""
import base64
import calendar
import json
import mimetypes
import os
import re
import secrets
import uuid
from datetime import date
from pathlib import Path

from fastapi import Body, FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from markdown_it import MarkdownIt
from mdit_py_plugins.tasklists import tasklists_plugin

from . import db as store
from . import presets
from .db import FILES_DIR, db, now

STATIC = Path(__file__).parent / "static"
APP_PASSWORD = os.environ.get("WRENCHBOOK_PASSWORD", "")
MAX_UPLOAD = int(os.environ.get("WRENCHBOOK_MAX_UPLOAD_MB", "50")) * 1024 * 1024

ASSET_TEXT = ["kind", "name", "year", "make", "model", "trim", "engine", "vin", "plate", "color", "usage_unit",
              "purchase_date", "location", "notes"]
ASSET_NUM = ["purchase_price", "purchase_reading"]
GUIDE_TEXT = ["title", "summary", "body", "tools", "parts", "difficulty", "duration"]

md = MarkdownIt("commonmark", {"html": False, "linkify": False}).enable(["table", "strikethrough"]).use(
    tasklists_plugin, enabled=False)

app = FastAPI(title="Wrenchbook", docs_url=None, redoc_url=None)
store.init()


@app.middleware("http")
async def basic_auth(request: Request, call_next):
    """Optional single-password protection (any username)."""
    if APP_PASSWORD:
        ok = False
        header = request.headers.get("authorization", "")
        if header.startswith("Basic "):
            try:
                _, _, pw = base64.b64decode(header[6:]).decode().partition(":")
                ok = secrets.compare_digest(pw, APP_PASSWORD)
            except Exception:
                ok = False
        if not ok:
            return Response(status_code=401, headers={"WWW-Authenticate": 'Basic realm="Wrenchbook"'})
    return await call_next(request)


# ---------------------------------------------------------------- helpers

def clean(v):
    return str(v).strip() if v is not None else ""


def num(v):
    if v is None or v == "":
        return None
    try:
        return float(str(v).replace(",", "").strip())
    except ValueError:
        raise HTTPException(400, f"Not a number: {v}")


def intnum(v):
    n = num(v)
    return int(n) if n is not None else None


def iso_date(v, required=False):
    v = clean(v)
    if not v:
        if required:
            raise HTTPException(400, "Date is required")
        return ""
    try:
        return date.fromisoformat(v).isoformat()
    except ValueError:
        raise HTTPException(400, f"Bad date: {v}")


def render(text):
    return md.render(text or "")


def add_months(d, months):
    m = d.month - 1 + months
    y = d.year + m // 12
    m = m % 12 + 1
    return date(y, m, min(d.day, calendar.monthrange(y, m)[1]))


def get_or_404(conn, table, id_):
    row = conn.execute(f"SELECT * FROM {table} WHERE id = ?", (id_,)).fetchone()
    if not row:
        raise HTTPException(404, f"{table[:-1].capitalize()} not found")
    return row


def current_reading(conn, asset_id):
    row = conn.execute(
        """SELECT MAX(v) FROM (SELECT value AS v FROM readings WHERE asset_id = ?
           UNION ALL SELECT reading FROM logs WHERE asset_id = ? AND reading IS NOT NULL
           UNION ALL SELECT purchase_reading FROM assets WHERE id = ? AND purchase_reading IS NOT NULL)""",
        (asset_id, asset_id, asset_id)).fetchone()
    return row[0]


def file_row(r):
    return {"id": r["id"], "asset_id": r["asset_id"], "log_id": r["log_id"], "guide_id": r["guide_id"],
            "name": r["name"], "mime": r["mime"], "size": r["size"], "caption": r["caption"], "created": r["created"],
            "url": f"/files/{r['id']}", "is_image": r["mime"].startswith("image/")}


def unlink_files(conn, where, params):
    for r in conn.execute(f"SELECT stored FROM files WHERE {where}", params).fetchall():
        try:
            (FILES_DIR / r["stored"]).unlink()
        except FileNotFoundError:
            pass


def asset_dict(r):
    d = dict(r)
    d["photo_url"] = f"/files/{r['photo_id']}" if r["photo_id"] else None
    d["title"] = " ".join(x for x in (r["year"], r["make"], r["model"], r["trim"]) if x)
    return d


def section_dict(r):
    d = dict(r)
    d["columns"] = json.loads(r["columns"])
    d["rows"] = json.loads(r["rows"])
    return d


def log_dict(r, conn, with_files=True):
    d = dict(r)
    d["parts"] = json.loads(r["parts"] or "[]")
    d["notes_html"] = render(r["notes"])
    d["task_ids"] = [x[0] for x in conn.execute("SELECT task_id FROM log_tasks WHERE log_id = ?", (r["id"],))]
    if with_files:
        d["files"] = [file_row(f) for f in conn.execute("SELECT * FROM files WHERE log_id = ? ORDER BY id", (r["id"],))]
    return d


def task_statuses(conn, asset_id, current=None, today=None):
    """Each scheduled task with its last service and when it's next due."""
    today = today or date.today()
    if current is None:
        current = current_reading(conn, asset_id)
    out = []
    for t in conn.execute("SELECT * FROM tasks WHERE asset_id = ? ORDER BY sort, id", (asset_id,)).fetchall():
        d = dict(t)
        last = conn.execute(
            """SELECT l.id, l.date, l.reading, l.title FROM logs l JOIN log_tasks lt ON lt.log_id = l.id
               WHERE lt.task_id = ? ORDER BY l.date DESC, l.id DESC LIMIT 1""", (t["id"],)).fetchone()
        d["last"] = dict(last) if last else None
        # The latest reading recorded with this task, for distance intervals (the latest entry may lack one)
        last_reading = conn.execute(
            """SELECT l.reading FROM logs l JOIN log_tasks lt ON lt.log_id = l.id
               WHERE lt.task_id = ? AND l.reading IS NOT NULL ORDER BY l.date DESC, l.id DESC LIMIT 1""",
            (t["id"],)).fetchone()
        d["due_reading"] = d["due_date"] = d["remaining"] = d["days_left"] = None
        status = "never"
        if last:
            status = "ok"
            if t["every_dist"] and last_reading:
                d["due_reading"] = last_reading[0] + t["every_dist"]
                if current is not None:
                    d["remaining"] = d["due_reading"] - current
            if t["every_months"]:
                due = add_months(date.fromisoformat(last["date"]), t["every_months"])
                d["due_date"] = due.isoformat()
                d["days_left"] = (due - today).days
            overdue = (d["remaining"] is not None and d["remaining"] <= 0) or (
                d["days_left"] is not None and d["days_left"] < 0)
            soon_dist = d["remaining"] is not None and d["remaining"] <= t["every_dist"] * 0.1
            soon_days = d["days_left"] is not None and d["days_left"] <= max(7, min(30, t["every_months"] * 3))
            if overdue:
                status = "overdue"
            elif soon_dist or soon_days:
                status = "soon"
        d["status"] = status
        out.append(d)
    return out


def asset_summary(conn, r):
    d = asset_dict(r)
    cur = current_reading(conn, r["id"])
    d["current_reading"] = cur
    tasks = task_statuses(conn, r["id"], cur)
    d["overdue"] = sum(t["status"] == "overdue" for t in tasks)
    d["soon"] = sum(t["status"] == "soon" for t in tasks)
    d["task_count"] = len(tasks)
    d["never"] = sum(t["status"] == "never" for t in tasks)
    last = conn.execute("SELECT date, title FROM logs WHERE asset_id = ? ORDER BY date DESC, id DESC LIMIT 1",
                        (r["id"],)).fetchone()
    d["last_service"] = dict(last) if last else None
    d["log_count"] = conn.execute("SELECT COUNT(*) FROM logs WHERE asset_id = ?", (r["id"],)).fetchone()[0]
    return d


# ---------------------------------------------------------------- meta / dashboard

@app.get("/api/meta")
def get_meta():
    with db() as conn:
        used = [r[0] for r in conn.execute(
            "SELECT DISTINCT category FROM logs WHERE category != '' UNION SELECT DISTINCT category FROM tasks WHERE category != ''")]
    m = presets.meta()
    m["categories"] = m["categories"] + sorted(set(used) - set(m["categories"]))
    return m


@app.get("/api/dashboard")
def dashboard():
    today = date.today()
    with db() as conn:
        assets = [asset_summary(conn, r) for r in conn.execute(
            "SELECT * FROM assets ORDER BY archived, sort, name COLLATE NOCASE")]
        attention = []
        for a in assets:
            if a["archived"]:
                continue
            for t in task_statuses(conn, a["id"], a["current_reading"], today):
                if t["status"] in ("overdue", "soon"):
                    attention.append({**t, "asset_name": a["name"], "asset_kind": a["kind"], "usage_unit": a["usage_unit"]})
        attention.sort(key=lambda t: (t["status"] != "overdue", t["days_left"] if t["days_left"] is not None else 99999))
        recent = [{**log_dict(r, conn, False), "asset_name": r["asset_name"], "usage_unit": r["usage_unit"]}
                  for r in conn.execute(
                      """SELECT l.*, a.name AS asset_name, a.usage_unit FROM logs l JOIN assets a ON a.id = l.asset_id
                         ORDER BY l.date DESC, l.id DESC LIMIT 8""")]
        year = str(today.year)
        spend = conn.execute("SELECT COALESCE(SUM(cost), 0), COUNT(*) FROM logs WHERE substr(date, 1, 4) = ?",
                             (year,)).fetchone()
    return {"assets": assets, "attention": attention, "recent": recent,
            "year": year, "spend_year": spend[0], "jobs_year": spend[1]}


# ---------------------------------------------------------------- assets

def asset_values(data, partial=False):
    vals = {}
    for k in ASSET_TEXT:
        if k in data or not partial:
            vals[k] = clean(data.get(k))
    for k in ASSET_NUM:
        if k in data or not partial:
            vals[k] = num(data.get(k))
    if "purchase_date" in vals:
        vals["purchase_date"] = iso_date(vals["purchase_date"])
    if "kind" in vals and vals["kind"] not in presets.KINDS:
        vals["kind"] = "other"
    if "usage_unit" in vals and vals["usage_unit"] not in presets.UNITS:
        vals["usage_unit"] = presets.kind_preset(vals.get("kind", "other"))["unit"]
    if "name" in vals and not vals["name"]:
        raise HTTPException(400, "Name is required")
    if "archived" in data:
        vals["archived"] = 1 if data["archived"] else 0
    if "photo_id" in data:
        vals["photo_id"] = intnum(data["photo_id"])
    return vals


def apply_template(conn, asset_id, kind, sections=True, tasks=True):
    p = presets.kind_preset(kind)
    if sections:
        for i, (tkey, labels) in enumerate(p["sections"]):
            t = presets.SECTION_TEMPLATES[tkey]
            rows = [[label] + [""] * (len(t["columns"]) - 1) for label in labels]
            conn.execute("INSERT INTO sections (asset_id, template, title, columns, rows, sort) VALUES (?,?,?,?,?,?)",
                         (asset_id, tkey, t["title"], json.dumps(t["columns"]), json.dumps(rows), i))
    if tasks:
        for i, (name, cat, dist, months) in enumerate(p["tasks"]):
            if p["unit"] == "none":
                dist = None
            if dist is None and months is None:
                continue
            conn.execute("INSERT INTO tasks (asset_id, name, category, every_dist, every_months, sort, created) VALUES (?,?,?,?,?,?,?)",
                         (asset_id, name, cat, dist, months, i, now()))


@app.get("/api/assets")
def list_assets():
    with db() as conn:
        return [asset_summary(conn, r) for r in conn.execute("SELECT * FROM assets ORDER BY archived, sort, name COLLATE NOCASE")]


@app.post("/api/assets")
def create_asset(data: dict = Body(...)):
    vals = asset_values(data)
    if not data.get("usage_unit"):
        vals["usage_unit"] = presets.kind_preset(vals["kind"])["unit"]
    vals["created"] = vals["updated"] = now()
    with db() as conn:
        cols = ", ".join(vals)
        cur = conn.execute(f"INSERT INTO assets ({cols}) VALUES ({', '.join('?' * len(vals))})", list(vals.values()))
        aid = cur.lastrowid
        if data.get("template", True):
            apply_template(conn, aid, vals["kind"])
        return {"id": aid}


@app.get("/api/assets/{aid}")
def get_asset(aid: int):
    with db() as conn:
        r = get_or_404(conn, "assets", aid)
        d = asset_summary(conn, r)
        d["sections"] = [section_dict(s) for s in conn.execute(
            "SELECT * FROM sections WHERE asset_id = ? ORDER BY sort, id", (aid,))]
        d["tasks"] = task_statuses(conn, aid, d["current_reading"])
        d["logs"] = [log_dict(x, conn) for x in conn.execute(
            "SELECT * FROM logs WHERE asset_id = ? ORDER BY date DESC, id DESC", (aid,))]
        d["readings"] = [dict(x) for x in conn.execute(
            "SELECT * FROM readings WHERE asset_id = ? ORDER BY date DESC, id DESC", (aid,))]
        d["guides"] = guides_query(conn, aid)
        d["files"] = [file_row(f) for f in conn.execute(
            "SELECT * FROM files WHERE asset_id = ? ORDER BY id DESC", (aid,))]
        d["notes_html"] = render(r["notes"])
        return d


@app.put("/api/assets/{aid}")
def update_asset(aid: int, data: dict = Body(...)):
    vals = asset_values(data, partial=True)
    vals["updated"] = now()
    with db() as conn:
        get_or_404(conn, "assets", aid)
        conn.execute(f"UPDATE assets SET {', '.join(f'{k} = ?' for k in vals)} WHERE id = ?", [*vals.values(), aid])
    return {"ok": True}


@app.delete("/api/assets/{aid}")
def delete_asset(aid: int):
    with db() as conn:
        get_or_404(conn, "assets", aid)
        unlink_files(conn, "asset_id = ?", (aid,))
        conn.execute("DELETE FROM assets WHERE id = ?", (aid,))
    return {"ok": True}


@app.post("/api/assets/{aid}/template")
def asset_apply_template(aid: int, data: dict = Body(...)):
    """Add the kind's suggested sections and/or tasks to an existing asset."""
    with db() as conn:
        r = get_or_404(conn, "assets", aid)
        apply_template(conn, aid, data.get("kind") or r["kind"], bool(data.get("sections")), bool(data.get("tasks")))
    return {"ok": True}


@app.post("/api/assets/{aid}/readings")
def add_reading(aid: int, data: dict = Body(...)):
    value = num(data.get("value"))
    if value is None:
        raise HTTPException(400, "Reading is required")
    with db() as conn:
        get_or_404(conn, "assets", aid)
        conn.execute("INSERT INTO readings (asset_id, date, value, created) VALUES (?,?,?,?)",
                     (aid, iso_date(data.get("date")) or date.today().isoformat(), value, now()))
    return {"ok": True}


@app.delete("/api/readings/{rid}")
def delete_reading(rid: int):
    with db() as conn:
        conn.execute("DELETE FROM readings WHERE id = ?", (rid,))
    return {"ok": True}


# ---------------------------------------------------------------- spec sections

def section_values(data):
    cols = [clean(c) for c in data.get("columns") or []]
    if not cols:
        raise HTTPException(400, "A section needs at least one column")
    rows = []
    for row in data.get("rows") or []:
        row = [clean(c) for c in row][:len(cols)]
        row += [""] * (len(cols) - len(row))
        if any(row):
            rows.append(row)
    title = clean(data.get("title")) or "Untitled"
    return title, json.dumps(cols), json.dumps(rows), clean(data.get("note"))


@app.post("/api/assets/{aid}/sections")
def create_section(aid: int, data: dict = Body(...)):
    with db() as conn:
        get_or_404(conn, "assets", aid)
        tkey = data.get("template") or "custom"
        if tkey in presets.SECTION_TEMPLATES and not data.get("columns"):
            t = presets.SECTION_TEMPLATES[tkey]
            data = {"title": data.get("title") or t["title"], "columns": t["columns"], "rows": []}
        title, cols, rows, note = section_values(data)
        sort = conn.execute("SELECT COALESCE(MAX(sort), -1) + 1 FROM sections WHERE asset_id = ?", (aid,)).fetchone()[0]
        cur = conn.execute("INSERT INTO sections (asset_id, template, title, columns, rows, note, sort) VALUES (?,?,?,?,?,?,?)",
                           (aid, tkey, title, cols, rows, note, sort))
        return {"id": cur.lastrowid}


@app.put("/api/sections/{sid}")
def update_section(sid: int, data: dict = Body(...)):
    title, cols, rows, note = section_values(data)
    with db() as conn:
        get_or_404(conn, "sections", sid)
        conn.execute("UPDATE sections SET title = ?, columns = ?, rows = ?, note = ? WHERE id = ?", (title, cols, rows, note, sid))
    return {"ok": True}


@app.post("/api/sections/{sid}/move")
def move_section(sid: int, data: dict = Body(...)):
    delta = -1 if data.get("dir") == "up" else 1
    with db() as conn:
        s = get_or_404(conn, "sections", sid)
        ids = [r[0] for r in conn.execute("SELECT id FROM sections WHERE asset_id = ? ORDER BY sort, id", (s["asset_id"],))]
        i = ids.index(sid)
        j = i + delta
        if 0 <= j < len(ids):
            ids[i], ids[j] = ids[j], ids[i]
        for n, x in enumerate(ids):
            conn.execute("UPDATE sections SET sort = ? WHERE id = ?", (n, x))
    return {"ok": True}


@app.delete("/api/sections/{sid}")
def delete_section(sid: int):
    with db() as conn:
        conn.execute("DELETE FROM sections WHERE id = ?", (sid,))
    return {"ok": True}


# ---------------------------------------------------------------- service schedule

def task_values(data):
    name = clean(data.get("name"))
    if not name:
        raise HTTPException(400, "Task name is required")
    dist, months = num(data.get("every_dist")), intnum(data.get("every_months"))
    if not dist and not months:
        raise HTTPException(400, "Set a distance/hours interval, a months interval, or both")
    return {"name": name, "category": clean(data.get("category")), "every_dist": dist or None,
            "every_months": months or None, "notes": clean(data.get("notes")), "guide_id": intnum(data.get("guide_id"))}


@app.post("/api/assets/{aid}/tasks")
def create_task(aid: int, data: dict = Body(...)):
    vals = task_values(data)
    with db() as conn:
        get_or_404(conn, "assets", aid)
        sort = conn.execute("SELECT COALESCE(MAX(sort), -1) + 1 FROM tasks WHERE asset_id = ?", (aid,)).fetchone()[0]
        cur = conn.execute(
            "INSERT INTO tasks (asset_id, name, category, every_dist, every_months, notes, guide_id, sort, created) VALUES (?,?,?,?,?,?,?,?,?)",
            (aid, *vals.values(), sort, now()))
        return {"id": cur.lastrowid}


@app.put("/api/tasks/{tid}")
def update_task(tid: int, data: dict = Body(...)):
    vals = task_values(data)
    with db() as conn:
        get_or_404(conn, "tasks", tid)
        conn.execute(f"UPDATE tasks SET {', '.join(f'{k} = ?' for k in vals)} WHERE id = ?", [*vals.values(), tid])
    return {"ok": True}


@app.delete("/api/tasks/{tid}")
def delete_task(tid: int):
    with db() as conn:
        conn.execute("DELETE FROM tasks WHERE id = ?", (tid,))
    return {"ok": True}


# ---------------------------------------------------------------- service log

def log_values(data):
    title = clean(data.get("title")) or clean(data.get("category"))
    if not title:
        raise HTTPException(400, "Give the entry a title or category")
    parts = []
    for p in data.get("parts") or []:
        item = {"name": clean(p.get("name")), "number": clean(p.get("number")),
                "qty": clean(p.get("qty")), "cost": num(p.get("cost"))}
        if item["name"] or item["number"]:
            parts.append(item)
    return {"date": iso_date(data.get("date"), required=True), "reading": num(data.get("reading")),
            "category": clean(data.get("category")), "title": title, "notes": data.get("notes") or "",
            "cost": num(data.get("cost")), "performed_by": clean(data.get("performed_by")), "parts": json.dumps(parts)}


def set_log_tasks(conn, log_id, asset_id, task_ids):
    conn.execute("DELETE FROM log_tasks WHERE log_id = ?", (log_id,))
    valid = {r[0] for r in conn.execute("SELECT id FROM tasks WHERE asset_id = ?", (asset_id,))}
    for t in task_ids or []:
        if int(t) in valid:
            conn.execute("INSERT OR IGNORE INTO log_tasks (log_id, task_id) VALUES (?, ?)", (log_id, int(t)))


@app.get("/api/logs")
def list_logs(asset_id: int = None, category: str = None, year: str = None, q: str = None):
    where, params = [], []
    if asset_id:
        where.append("l.asset_id = ?"); params.append(asset_id)
    if category:
        where.append("l.category = ?"); params.append(category)
    if year:
        where.append("substr(l.date, 1, 4) = ?"); params.append(year)
    if q:
        where.append("(l.title LIKE ? OR l.notes LIKE ? OR l.parts LIKE ? OR l.performed_by LIKE ?)")
        params += [f"%{q}%"] * 4
    sql = """SELECT l.*, a.name AS asset_name, a.usage_unit, a.kind AS asset_kind FROM logs l
             JOIN assets a ON a.id = l.asset_id"""
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY l.date DESC, l.id DESC"
    with db() as conn:
        rows = conn.execute(sql, params).fetchall()
        years = [r[0] for r in conn.execute("SELECT DISTINCT substr(date, 1, 4) FROM logs ORDER BY 1 DESC")]
        return {"logs": [{**log_dict(r, conn), "asset_name": r["asset_name"], "usage_unit": r["usage_unit"],
                          "asset_kind": r["asset_kind"]} for r in rows], "years": years}


@app.post("/api/assets/{aid}/logs")
def create_log(aid: int, data: dict = Body(...)):
    vals = log_values(data)
    with db() as conn:
        get_or_404(conn, "assets", aid)
        vals["created"] = vals["updated"] = now()
        cur = conn.execute(f"INSERT INTO logs (asset_id, {', '.join(vals)}) VALUES (?, {', '.join('?' * len(vals))})",
                           [aid, *vals.values()])
        set_log_tasks(conn, cur.lastrowid, aid, data.get("task_ids"))
        return {"id": cur.lastrowid}


@app.put("/api/logs/{lid}")
def update_log(lid: int, data: dict = Body(...)):
    vals = log_values(data)
    vals["updated"] = now()
    with db() as conn:
        r = get_or_404(conn, "logs", lid)
        conn.execute(f"UPDATE logs SET {', '.join(f'{k} = ?' for k in vals)} WHERE id = ?", [*vals.values(), lid])
        set_log_tasks(conn, lid, r["asset_id"], data.get("task_ids"))
    return {"ok": True}


@app.delete("/api/logs/{lid}")
def delete_log(lid: int):
    with db() as conn:
        unlink_files(conn, "log_id = ?", (lid,))
        conn.execute("DELETE FROM logs WHERE id = ?", (lid,))
    return {"ok": True}


# ---------------------------------------------------------------- guides

def guides_query(conn, asset_id=None):
    sql = "SELECT g.* FROM guides g"
    params = []
    if asset_id:
        # Guides for this asset plus general guides that aren't tied to any asset
        sql += """ WHERE g.id IN (SELECT guide_id FROM guide_assets WHERE asset_id = ?)
                   OR g.id NOT IN (SELECT guide_id FROM guide_assets)"""
        params.append(asset_id)
    sql += " ORDER BY g.title COLLATE NOCASE"
    out = []
    for g in conn.execute(sql, params).fetchall():
        d = {k: g[k] for k in ("id", "title", "summary", "difficulty", "duration", "updated")}
        d["assets"] = [dict(a) for a in conn.execute(
            "SELECT a.id, a.name, a.kind FROM assets a JOIN guide_assets ga ON ga.asset_id = a.id WHERE ga.guide_id = ? ORDER BY a.name",
            (g["id"],))]
        out.append(d)
    return out


def save_guide_links(conn, gid, data):
    conn.execute("DELETE FROM guide_assets WHERE guide_id = ?", (gid,))
    for a in data.get("asset_ids") or []:
        conn.execute("INSERT OR IGNORE INTO guide_assets (guide_id, asset_id) SELECT ?, id FROM assets WHERE id = ?", (gid, int(a)))
    # Claim images uploaded from the editor before the guide had an id
    for fid in re.findall(r"/files/(\d+)", data.get("body") or ""):
        conn.execute("UPDATE files SET guide_id = ? WHERE id = ? AND guide_id IS NULL AND asset_id IS NULL AND log_id IS NULL",
                     (gid, int(fid)))


@app.get("/api/guides")
def list_guides():
    with db() as conn:
        return guides_query(conn)


@app.get("/api/guides/{gid}")
def get_guide(gid: int):
    with db() as conn:
        g = dict(get_or_404(conn, "guides", gid))
        g["body_html"] = render(g["body"])
        g["asset_ids"] = [r[0] for r in conn.execute("SELECT asset_id FROM guide_assets WHERE guide_id = ?", (gid,))]
        g["assets"] = [dict(a) for a in conn.execute(
            "SELECT a.id, a.name, a.kind FROM assets a JOIN guide_assets ga ON ga.asset_id = a.id WHERE ga.guide_id = ? ORDER BY a.name", (gid,))]
        g["tasks"] = [dict(t) for t in conn.execute(
            "SELECT t.id, t.name, t.asset_id, a.name AS asset_name FROM tasks t JOIN assets a ON a.id = t.asset_id WHERE t.guide_id = ?", (gid,))]
        g["files"] = [file_row(f) for f in conn.execute("SELECT * FROM files WHERE guide_id = ? ORDER BY id", (gid,))]
        return g


@app.post("/api/guides")
def create_guide(data: dict = Body(...)):
    vals = {k: (data.get(k) or "") if k == "body" else clean(data.get(k)) for k in GUIDE_TEXT}
    if not vals["title"]:
        raise HTTPException(400, "Title is required")
    vals["created"] = vals["updated"] = now()
    with db() as conn:
        cur = conn.execute(f"INSERT INTO guides ({', '.join(vals)}) VALUES ({', '.join('?' * len(vals))})", list(vals.values()))
        save_guide_links(conn, cur.lastrowid, data)
        return {"id": cur.lastrowid}


@app.put("/api/guides/{gid}")
def update_guide(gid: int, data: dict = Body(...)):
    vals = {k: (data.get(k) or "") if k == "body" else clean(data.get(k)) for k in GUIDE_TEXT}
    if not vals["title"]:
        raise HTTPException(400, "Title is required")
    vals["updated"] = now()
    with db() as conn:
        get_or_404(conn, "guides", gid)
        conn.execute(f"UPDATE guides SET {', '.join(f'{k} = ?' for k in vals)} WHERE id = ?", [*vals.values(), gid])
        save_guide_links(conn, gid, data)
    return {"ok": True}


@app.delete("/api/guides/{gid}")
def delete_guide(gid: int):
    with db() as conn:
        unlink_files(conn, "guide_id = ? AND asset_id IS NULL", (gid,))
        conn.execute("DELETE FROM guides WHERE id = ?", (gid,))
    return {"ok": True}


@app.post("/api/render")
def render_preview(data: dict = Body(...)):
    return {"html": render(data.get("text") or "")}


# ---------------------------------------------------------------- files

@app.post("/api/files")
async def upload_file(request: Request, name: str, asset_id: int = None, log_id: int = None, guide_id: int = None,
                      caption: str = ""):
    body = await request.body()
    if not body:
        raise HTTPException(400, "Empty file")
    if len(body) > MAX_UPLOAD:
        raise HTTPException(413, f"File is larger than {MAX_UPLOAD // 1024 // 1024} MB")
    name = Path(name).name or "file"
    mime = request.headers.get("content-type") or ""
    if not mime or mime == "application/octet-stream":
        mime = mimetypes.guess_type(name)[0] or "application/octet-stream"
    stored = uuid.uuid4().hex + Path(name).suffix.lower()[:10]
    with db() as conn:
        if log_id:
            asset_id = get_or_404(conn, "logs", log_id)["asset_id"]
        (FILES_DIR / stored).write_bytes(body)
        cur = conn.execute(
            "INSERT INTO files (asset_id, log_id, guide_id, name, mime, size, stored, caption, created) VALUES (?,?,?,?,?,?,?,?,?)",
            (asset_id, log_id, guide_id, name, mime, len(body), stored, clean(caption), now()))
        return file_row(conn.execute("SELECT * FROM files WHERE id = ?", (cur.lastrowid,)).fetchone())


@app.get("/files/{fid}")
def get_file(fid: int, download: bool = False):
    with db() as conn:
        f = get_or_404(conn, "files", fid)
    path = FILES_DIR / f["stored"]
    if not path.exists():
        raise HTTPException(404, "File missing on disk")
    inline = not download and (f["mime"].startswith("image/") or f["mime"] in ("application/pdf", "text/plain"))
    return FileResponse(path, media_type=f["mime"], filename=f["name"],
                        content_disposition_type="inline" if inline else "attachment",
                        headers={"Cache-Control": "private, max-age=86400"})


@app.put("/api/files/{fid}")
def update_file(fid: int, data: dict = Body(...)):
    with db() as conn:
        get_or_404(conn, "files", fid)
        conn.execute("UPDATE files SET caption = ? WHERE id = ?", (clean(data.get("caption")), fid))
    return {"ok": True}


@app.delete("/api/files/{fid}")
def delete_file(fid: int):
    with db() as conn:
        unlink_files(conn, "id = ?", (fid,))
        conn.execute("UPDATE assets SET photo_id = NULL WHERE photo_id = ?", (fid,))
        conn.execute("DELETE FROM files WHERE id = ?", (fid,))
    return {"ok": True}


# ---------------------------------------------------------------- search / export

@app.get("/api/search")
def search(q: str):
    q = q.strip()
    if len(q) < 2:
        return {"assets": [], "specs": [], "logs": [], "guides": []}
    like = f"%{q}%"
    ql = q.lower()
    with db() as conn:
        assets = [asset_dict(r) for r in conn.execute(
            """SELECT * FROM assets WHERE name LIKE ? OR make LIKE ? OR model LIKE ? OR vin LIKE ? OR plate LIKE ?
               OR engine LIKE ? OR notes LIKE ? ORDER BY name""", [like] * 7)]
        specs = []
        for s in conn.execute(
                """SELECT s.*, a.name AS asset_name FROM sections s JOIN assets a ON a.id = s.asset_id
                   WHERE s.rows LIKE ? OR s.title LIKE ? ORDER BY a.name, s.sort""", (like, like)):
            rows = json.loads(s["rows"])
            hits = [r for r in rows if any(ql in c.lower() for c in r)] or (rows if ql in s["title"].lower() else [])
            if hits:
                specs.append({"asset_id": s["asset_id"], "asset_name": s["asset_name"], "section_id": s["id"],
                              "title": s["title"], "columns": json.loads(s["columns"]), "rows": hits})
        logs = [{**log_dict(r, conn, False), "asset_name": r["asset_name"], "usage_unit": r["usage_unit"]} for r in conn.execute(
            """SELECT l.*, a.name AS asset_name, a.usage_unit FROM logs l JOIN assets a ON a.id = l.asset_id
               WHERE l.title LIKE ? OR l.notes LIKE ? OR l.parts LIKE ? OR l.category LIKE ? OR l.performed_by LIKE ?
               ORDER BY l.date DESC LIMIT 50""", [like] * 5)]
        guide_ids = {r[0] for r in conn.execute(
            "SELECT id FROM guides WHERE title LIKE ? OR summary LIKE ? OR body LIKE ? OR tools LIKE ? OR parts LIKE ?", [like] * 5)}
        guides = [g for g in guides_query(conn) if g["id"] in guide_ids]
    return {"assets": assets, "specs": specs, "logs": logs, "guides": guides}


@app.get("/api/export")
def export():
    out = {"app": "wrenchbook", "exported": now()}
    with db() as conn:
        for t in ("assets", "sections", "readings", "logs", "tasks", "log_tasks", "guides", "guide_assets", "files"):
            out[t] = [dict(r) for r in conn.execute(f"SELECT * FROM {t}")]
    return JSONResponse(out, headers={"Content-Disposition": f'attachment; filename="wrenchbook-{date.today()}.json"'})


# ---------------------------------------------------------------- static

app.mount("/static", StaticFiles(directory=STATIC), name="static")


@app.get("/")
def index():
    return FileResponse(STATIC / "index.html", headers={"Cache-Control": "no-cache"})
