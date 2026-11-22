"""Built-in kinds, spec-sheet templates and service-interval suggestions.

Everything here is only a starting point: sections, columns, rows and tasks are all editable per asset.
"""

# Spec-sheet section templates. `rows` are the labels pre-filled in the first column.
SECTION_TEMPLATES = {
    "parts": {"title": "Parts", "columns": ["Part", "Part number", "Notes"]},
    "fluids": {"title": "Fluids", "columns": ["Fluid", "Type / spec", "Capacity"]},
    "fasteners": {"title": "Bolts & sockets", "columns": ["Component", "Thread", "Socket", "Torque"]},
    "tires": {"title": "Tires & wheels", "columns": ["Position", "Tire size", "Wheel", "Pressure"]},
    "bulbs": {"title": "Bulbs", "columns": ["Location", "Bulb", "Notes"]},
    "belts": {"title": "Belts", "columns": ["Belt", "Part number", "Size", "Notes"]},
    "electrical": {"title": "Battery & electrical", "columns": ["Item", "Spec", "Notes"]},
    "custom": {"title": "Notes", "columns": ["Item", "Value", "Notes"]},
}

CATEGORIES = [
    "Oil change", "Brakes", "Tires", "Tire rotation", "Filters", "Fluids", "Battery", "Electrical", "Bulbs",
    "Wipers", "Suspension", "Steering", "Engine", "Transmission", "Drivetrain", "Cooling", "Exhaust",
    "Belts", "Spark plugs", "Blades", "Inspection", "Seasonal", "Body", "Repair", "Other",
]

_CAR_SECTIONS = [
    ("parts", ["Oil filter", "Engine air filter", "Cabin air filter", "Wiper blade (driver)", "Wiper blade (passenger)"]),
    ("fluids", ["Engine oil", "Transmission", "Brake fluid", "Coolant"]),
    ("fasteners", ["Oil drain plug", "Transmission drain plug", "Wheel lug nuts"]),
    ("tires", ["Front", "Rear", "Spare"]),
    ("bulbs", ["Headlight – low beam", "Headlight – high beam", "Front turn signal", "Front side marker", "Fog light",
               "Rear turn signal", "Tail / brake light", "Reverse light", "License plate light"]),
]
_CAR_TASKS = [
    ("Oil & filter change", "Oil change", 5000, 6),
    ("Tire rotation", "Tire rotation", 5000, 6),
    ("Engine air filter", "Filters", 15000, 12),
    ("Cabin air filter", "Filters", 15000, 12),
    ("Brake inspection", "Brakes", 15000, 12),
    ("Brake fluid flush", "Brakes", None, 36),
    ("Transmission fluid", "Transmission", 30000, None),
    ("Coolant flush", "Cooling", 100000, 120),
    ("Wiper blades", "Wipers", None, 12),
]
_SMALL_ENGINE_FLUIDS = ["Engine oil", "Fuel"]

KINDS = {
    "car": {"label": "Car", "unit": "mi", "group": "vehicle", "sections": _CAR_SECTIONS, "tasks": _CAR_TASKS},
    "suv": {"label": "SUV / crossover", "unit": "mi", "group": "vehicle", "sections": _CAR_SECTIONS, "tasks": _CAR_TASKS},
    "van": {"label": "Van / minivan", "unit": "mi", "group": "vehicle", "sections": _CAR_SECTIONS, "tasks": _CAR_TASKS},
    "truck": {
        "label": "Truck", "unit": "mi", "group": "vehicle",
        "sections": [
            ("parts", ["Oil filter", "Engine air filter", "Cabin air filter", "Oil drain plug", "Oil drain plug gasket"]),
            ("fluids", ["Engine oil", "Transmission", "Transfer case", "Front differential", "Rear differential",
                        "Brake fluid", "Power steering", "Coolant"]),
            ("fasteners", ["Oil drain plug", "Transmission drain plug", "Transfer case drain plug", "Wheel lug nuts"]),
            ("tires", ["Front", "Rear", "Spare"]),
            ("bulbs", ["Headlight", "Front turn signal", "Front side marker", "Fog light", "Rear turn / brake / tail",
                       "High-mount brake light", "Reverse light", "License plate light"]),
        ],
        "tasks": _CAR_TASKS + [
            ("Differential fluid", "Drivetrain", 30000, None),
            ("Transfer case fluid", "Drivetrain", 30000, None),
        ],
    },
    "motorcycle": {
        "label": "Motorcycle", "unit": "mi", "group": "vehicle",
        "sections": [
            ("parts", ["Oil filter", "Air filter", "Spark plugs", "Chain", "Front sprocket", "Rear sprocket", "Brake pads (front)", "Brake pads (rear)"]),
            ("fluids", ["Engine oil", "Brake fluid", "Coolant", "Fork oil"]),
            ("fasteners", ["Oil drain plug", "Axle nut (front)", "Axle nut (rear)"]),
            ("tires", ["Front", "Rear"]),
            ("bulbs", ["Headlight", "Turn signals", "Tail / brake light"]),
        ],
        "tasks": [
            ("Oil & filter change", "Oil change", 3000, 12),
            ("Chain clean & lube", "Drivetrain", 500, None),
            ("Brake fluid flush", "Brakes", None, 24),
            ("Spark plugs", "Spark plugs", 8000, None),
            ("Air filter", "Filters", 6000, 12),
        ],
    },
    "atv": {
        "label": "ATV / UTV", "unit": "hr", "group": "vehicle",
        "sections": [
            ("parts", ["Oil filter", "Air filter", "Spark plug", "Drive belt"]),
            ("fluids", ["Engine oil", "Front differential", "Rear differential", "Coolant", "Brake fluid", "Fuel"]),
            ("fasteners", ["Oil drain plug", "Wheel lug nuts"]),
            ("tires", ["Front", "Rear"]),
        ],
        "tasks": [
            ("Oil & filter change", "Oil change", 50, 12),
            ("Air filter", "Filters", 25, 12),
            ("Differential fluid", "Drivetrain", 100, 24),
            ("Spark plug", "Spark plugs", 100, 24),
        ],
    },
    "mower": {
        "label": "Lawn mower", "unit": "hr", "group": "equipment",
        "sections": [
            ("parts", ["Spark plug", "Air filter", "Pre-filter", "Oil filter", "Fuel filter", "Blade(s)"]),
            ("belts", ["Deck belt", "Drive belt"]),
            ("fluids", ["Engine oil", "Fuel"]),
            ("fasteners", ["Blade bolt", "Spark plug", "Oil drain plug"]),
            ("tires", ["Front", "Rear"]),
            ("electrical", ["Battery"]),
        ],
        "tasks": [
            ("Oil change", "Oil change", 50, 12),
            ("Sharpen / balance blades", "Blades", 25, 12),
            ("Air filter", "Filters", 100, 12),
            ("Spark plug", "Spark plugs", 100, 12),
            ("Clean deck & check belts", "Inspection", None, 6),
            ("Winterize (stabilize fuel, charge battery)", "Seasonal", None, 12),
        ],
    },
    "snowblower": {
        "label": "Snowblower", "unit": "hr", "group": "equipment",
        "sections": [
            ("parts", ["Spark plug", "Shear pins", "Scraper bar", "Skid shoes", "Auger cable", "Drive cable"]),
            ("belts", ["Auger belt", "Drive belt"]),
            ("fluids", ["Engine oil", "Fuel", "Auger gearbox"]),
            ("fasteners", ["Shear pin bolts", "Spark plug", "Oil drain plug"]),
            ("tires", ["Left", "Right"]),
        ],
        "tasks": [
            ("Pre-season oil change", "Oil change", 50, 12),
            ("Spark plug", "Spark plugs", 100, 12),
            ("Check shear pins, belts & cables", "Inspection", None, 12),
            ("Lube auger shaft & chassis", "Fluids", 25, 12),
            ("End of season: stabilize / run fuel dry", "Seasonal", None, 12),
        ],
    },
    "generator": {
        "label": "Generator", "unit": "hr", "group": "equipment",
        "sections": [
            ("parts", ["Spark plug", "Air filter", "Oil filter", "Fuel filter"]),
            ("fluids", _SMALL_ENGINE_FLUIDS),
            ("fasteners", ["Oil drain plug", "Spark plug"]),
            ("electrical", ["Rated / surge watts", "Outlets", "Battery (electric start)"]),
        ],
        "tasks": [
            ("Oil change", "Oil change", 100, 12),
            ("Exercise run under load", "Inspection", None, 1),
            ("Air filter", "Filters", 100, 12),
            ("Spark plug", "Spark plugs", 200, 24),
            ("Fresh / stabilized fuel", "Seasonal", None, 6),
        ],
    },
    "small_engine": {
        "label": "Small engine / tool", "unit": "hr", "group": "equipment",
        "sections": [
            ("parts", ["Spark plug", "Air filter", "Fuel filter"]),
            ("fluids", ["Engine oil / 2-stroke mix", "Fuel", "Bar oil"]),
        ],
        "tasks": [
            ("Spark plug", "Spark plugs", None, 12),
            ("Air filter", "Filters", None, 12),
            ("Winterize", "Seasonal", None, 12),
        ],
    },
    "trailer": {
        "label": "Trailer", "unit": "none", "group": "vehicle",
        "sections": [
            ("parts", ["Wheel bearings", "Bearing seals", "Coupler", "Safety chains"]),
            ("fasteners", ["Wheel lug nuts", "Spindle nut"]),
            ("tires", ["Left", "Right", "Spare"]),
            ("bulbs", ["Tail / brake / turn", "Side markers", "License plate light"]),
        ],
        "tasks": [
            ("Repack wheel bearings", "Drivetrain", None, 12),
            ("Check lights & wiring", "Electrical", None, 12),
            ("Tire inspection / pressure", "Tires", None, 6),
        ],
    },
    "boat": {
        "label": "Boat / outboard", "unit": "hr", "group": "vehicle",
        "sections": [
            ("parts", ["Spark plugs", "Fuel/water separator", "Water pump impeller", "Anodes", "Propeller"]),
            ("fluids", ["Engine oil", "Lower unit gear oil", "Fuel"]),
            ("fasteners", ["Prop nut", "Lower unit drain/vent screws"]),
        ],
        "tasks": [
            ("Oil change", "Oil change", 100, 12),
            ("Lower unit gear oil", "Fluids", 100, 12),
            ("Water pump impeller", "Engine", 300, 36),
            ("Winterize", "Seasonal", None, 12),
        ],
    },
    "other": {"label": "Other", "unit": "none", "group": "equipment", "sections": [("parts", []), ("custom", [])], "tasks": []},
}

UNITS = {"mi": "miles", "km": "km", "hr": "hours", "none": "none (date only)"}


def kind_preset(kind):
    return KINDS.get(kind) or KINDS["other"]


def meta():
    return {
        "kinds": [{"key": k, "label": v["label"], "unit": v["unit"], "group": v["group"],
                   "tasks": [{"name": t[0], "category": t[1], "every_dist": t[2], "every_months": t[3]} for t in v["tasks"]]}
                  for k, v in KINDS.items()],
        "templates": [{"key": k, **v} for k, v in SECTION_TEMPLATES.items()],
        "categories": CATEGORIES,
        "units": UNITS,
    }
