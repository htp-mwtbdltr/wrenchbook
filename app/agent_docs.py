"""Text for LLMs: the copy-paste research prompt for one asset, and /llms.txt for agents that use the API."""
import json

from . import presets

UNIT_WORDS = {"mi": "miles", "km": "kilometres", "hr": "engine hours"}



EXAMPLE_TEXT = """{
  "asset": {"engine": "2.4L I4 K24Z7"},
  "sections": [
    {"title": "Fluids", "columns": ["Fluid", "Type / spec", "Capacity"],
     "rows": [["Engine oil", "SAE 0W-20 full synthetic", "4.4 qt with filter"]]},
    {"title": "Parts", "columns": ["Part", "Part number", "Notes"],
     "rows": [["Oil filter", "15400-PLM-A02", "OEM"]]}
  ],
  "tasks": [{"name": "Oil & filter change", "category": "Oil change", "every_dist": 5000, "every_months": 6}],
  "sources": ["https://example.com/owners-manual.pdf"]
}"""


def section_guide():
    return "\n".join(f'  - "{t["title"]}": {json.dumps(t["columns"])}'
                     for k, t in presets.SECTION_TEMPLATES.items() if k != "custom")


def asset_prompt(a, sections):
    kind = presets.kind_preset(a["kind"])["label"]
    ident = " ".join(x for x in (a["year"], a["make"], a["model"], a["trim"]) if x) or a["name"]
    unit = a["usage_unit"]
    facts = [f"What it is: {ident} ({kind.lower() if kind[1:2].islower() else kind})"]
    if a["engine"]:
        facts.append(f"Engine: {a['engine']}")
    if a["vin"]:
        facts.append(f"{'VIN' if presets.kind_preset(a['kind'])['group'] == 'vehicle' else 'Model/serial number'}: {a['vin']}")
    if a["name"] != ident:
        facts.append(f"I call it: {a['name']}")
    current = []
    for s in sections:
        rows = [r for r in s["rows"] if any(r[1:])]
        if rows:
            current.append(f"{s['title']} ({' | '.join(s['columns'])}):")
            current += [f"  {' | '.join(c or '-' for c in r)}" for r in rows]
    if unit in UNIT_WORDS:
        task_rule = (f'- "tasks": the manufacturer\'s maintenance schedule. "every_dist" is in {UNIT_WORDS[unit]} '
                     f'(leave it out for time-only items) and "every_months" is in months.')
    else:
        task_rule = '- "tasks": the manufacturer\'s maintenance schedule. This one is tracked by date only, so use "every_months" and leave out "every_dist".'
    return f"""I keep a maintenance manual for my {ident}. Please research it and fill in its spec sheet.

{chr(10).join(facts)}

Use web search if you can. Prefer the owner's manual, OEM parts catalogs and manufacturer documents; parts retailers are fine for part numbers. Only use what you actually find: I'd rather have gaps than guesses.

Reply with ONLY a JSON object (no commentary, no code fence needed) in this shape:

{EXAMPLE_TEXT}

Rules:
- "sections": use these titles and columns where they fit, and add other sections if useful (e.g. "Belts", "Battery & electrical"):
{section_guide()}
- The first column of each row is its label (e.g. "Engine oil"). A row whose label I already have updates that row.
- Leave out anything you can't find. Never make up part numbers.
- If a value is probable but not confirmed, add " (unconfirmed)" after it.
- "asset": only fields you're confident about: year, make, model, trim, engine, notes.
{task_rule}
- "sources": the URLs you used.

What's already on file (fill the gaps, and tell me in the values if something looks wrong):
{chr(10).join(current) if current else "(nothing yet)"}
"""


def llms_txt(base):
    kinds = ", ".join(f'"{k}"' for k in presets.KINDS)
    return f"""# Wrenchbook

> Self-hosted maintenance manual and service log for vehicles and equipment (cars, trucks, mowers, snowblowers,
> generators…). JSON API. No auth, unless the owner set a password (HTTP Basic, any username).

Base URL: {base}

## Read
- GET /api/assets: everything in the garage (id, name, kind, year/make/model, current reading, overdue counts)
- GET /api/assets/{{id}}: one asset with its spec sheet ("sections"), schedule ("tasks"), service log ("logs"), guides and files
- GET /api/assets/{{id}}/prompt: a research brief for that asset, including what's already on file
- GET /api/vin/{{vin}}: NHTSA VIN decode -> year, make, model, trim, engine and a suggested kind (road vehicles only)
- GET /api/meta: valid kinds, section templates, log categories, units
- GET /api/search?q=...: search spec sheets, VINs, service log and guides

## Write
- POST /api/import: create a new asset with its specs in one call.
  {{"asset": {{"name": "...", "kind": "...", "year": "", "make": "", "model": "", "trim": "", "engine": "", "vin": "",
             "plate": "", "usage_unit": "mi|km|hr|none", "notes": ""}},
   "sections": [...], "tasks": [...], "sources": [...]}}
  Add "template": true to also start from the kind's built-in sections and intervals.
  For equipment, put the model/serial number in "vin". Use usage_unit "none" for machines with no hour meter.
- POST /api/assets/{{id}}/import: merge specs into an existing asset. Same body; "asset" fields are optional.
  - Sections match by title and rows by their first cell (case-insensitive). Anything unmatched is added.
  - Existing non-empty values are kept unless you pass "overwrite": true.
  - Add ?dry_run=true to get the summary of changes without saving anything.
- POST /api/assets/{{id}}/logs: add a service-log entry
  {{"date": "YYYY-MM-DD", "reading": 84210, "category": "Oil change", "title": "...", "notes": "markdown",
   "cost": 42.50, "performed_by": "DIY", "parts": [{{"name": "", "number": "", "qty": "1", "cost": 8.99}}], "task_ids": [3]}}
- POST /api/files?asset_id={{id}}&name=manual.pdf&caption=...: upload a file as the raw request body with its Content-Type
  (e.g. the owner's or parts manual PDF)

## Spec sheet sections
Each section is {{"title", "columns", "rows"}}; rows are arrays in column order and the first cell is the row's label.
Standard sections:
{section_guide()}
Kinds: {kinds}
Task shape: {{"name", "category", "every_dist" (in the asset's usage unit), "every_months", "notes"}}; give at least one interval.

## Ground rules
- Research from real sources: owner's manuals, OEM parts catalogs, manufacturer sites. Leave things out instead of guessing,
  and never make up part numbers.
- Add " (unconfirmed)" to values that are probable but not verified.
- Include "sources"; they're appended to the asset's notes.
- Do a dry run first and show the user what will change before you import.
"""
