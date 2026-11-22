# Wrenchbook

A self-hosted maintenance manual and service log for everything with an engine: cars, trucks, mowers, snowblowers,
generators, trailers, boats.

- **Spec sheets.** Each vehicle or machine gets editable sections for parts and part numbers, fluids and capacities,
  bolts, sockets and torque, tires, bulbs, belts and electrical, plus custom sections with any columns.
  Tap a value to copy it. Each spec sheet prints as a one-page reference for the garage wall.
- **Service log.** Each entry records the date, odometer or hours, category, who did the work, cost, parts used
  (part numbers autocomplete from the spec sheet), notes in Markdown, and photos or receipts.
- **Schedule.** Service intervals such as "every 5,000 mi or 6 months", by miles, km, engine hours and/or months.
  Logging an entry against an interval resets it, and the garage dashboard lists anything overdue or coming due.
- **Guides.** Your own repair manual: step-by-step how-tos with photos, tool and part lists and torque tables. A guide
  can be tied to specific machines or left general, and linked from a schedule item.
- **Files.** Each machine has its own photos, receipts and PDF manuals, plus a cover photo.
- **Templates for each kind.** A new snowblower starts with shear pins, belts, spark plug and pre-season tasks; a new car
  starts with filters, fluids, bulbs and the usual intervals. All of it is editable.
- **Search** covers part numbers, bulbs, fluids, VINs, past jobs and guides.

Everything runs in one small container: FastAPI, plain JS with no build step, and SQLite. Light and dark themes.
The layout works on a phone, with a bottom nav bar for use in the garage.

## Deploy

```sh
git clone http://git.proxub/billy/wrenchbook.git
cd wrenchbook
cp .env.example .env             # optional: set WRENCHBOOK_PASSWORD
mkdir -p data                    # or restore a backed-up data/ here first
docker compose up -d --build     # http://<host>:8300
```

The container runs as uid 1000, so `data/` must be writable by that user.
To update: `git pull && docker compose up -d --build`.

To move to another PC, copy `data/` across (stop the container first so the SQLite DB is consistent).

## State NOT in this repo

| What | Where | Notes |
|---|---|---|
| **`data/`** | `./data` → `/data` | `wrenchbook.db` (everything) and `files/` (uploads). Gitignored. **Back it up.** |
| **UI password** (optional) | `.env` → `WRENCHBOOK_PASSWORD=` | Empty = no login (LAN only). Basic auth, any username. |
| **Reverse proxy** | Nginx Proxy Manager | Not set up yet. |

`/api/export` (the **Export** button in the sidebar) downloads a JSON dump of the database. It doesn't include uploaded files.
