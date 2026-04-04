import requests
import os
import json
from datetime import datetime, timezone
from urllib.parse import quote

BASE_URL = "https://www.space-track.org"

USERNAME = os.getenv("SPACETRACK_USER")
PASSWORD = os.getenv("SPACETRACK_PASS")

CONSTELLATIONS = {
    "Starlink": {
        "search_terms": ["STARLINK"],    
        "name_operator": "~~",  # Fuzzy match
        "filters": {
            "country_code": "US",
            "object_type": "PAYLOAD"
        }
    },
    "Kuiper": {
        "search_terms": ["KUIPER"],
        "filters": {
            "country_code": "US",
            "object_type": "PAYLOAD"
        }
    },
    "Qianfan": {
        "search_terms": ["QIANFAN"],
        "filters": {
            "country_code": "PRC",
            "object_type": "PAYLOAD"
        }
    },
    "Guowang": {
        "search_terms": ["HULIANWANG", "GUOWANG", "GW"],
        "filters": {
            "country_code": "PRC",
            "object_type": "PAYLOAD"
        }
    },
    "OneWeb": {
        "search_terms": ["ONEWEB"],
        "filters": {
            "country_code": "UK",
            "object_type": "PAYLOAD"
        }
    },
    # I think Jonathan's Space Page has two extra SSN S24925 and S24926 (these don't exist on space-track)
    "Iridium": {
        "search_terms": ["IRIDIUM"],
        "filters": {
            "country_code": "US",
            "object_type": "PAYLOAD"
        }
    },
    "Globalstar": {
        "search_terms": ["GLOBALSTAR"],
        "filters": {
            "object_type": "PAYLOAD"
        }
    },
    "Orbcomm": {
        "search_terms": ["ORBCOMM"],
        "filters": {
            "country_code": "ORB",
            "object_type": "PAYLOAD"
        }
    },
    # Inclined to say Jonathan's Space Page is off here too, undercounting some on 3/4/2024, for example
    "Spire Global": {
        "search_terms": ["LEMUR","ARDUSAT"],
        "filters": {
            "object_type": "PAYLOAD",
            "min_launch_date": "2013-01-01",
        }
    },
    "Planet Labs": {
        "search_terms": ["DOVE PIONEER","DOVE 1","DOVE 2","DOVE 3","DOVE 4","FLOCK","PELICAN","TANAGER"],
        "filters": {
            "object_type": "PAYLOAD"
        }
    },
    "Starshield": {
        "search_terms": ["USA"],
        "name_operator": ">",   # Starts-with match
        "filters": {
            "min_launch_date": "2022-01-01",
            "country_code": "US",
            "object_type": "PAYLOAD",
        }
    },
    "Proliferated Warfighter Space Architecture (PWSA)": {
        "search_terms": ["CHECKMATE","WILDFIRE","RAPTOR","SDA_","BB 1","BB 2","BB3","BB4"],
        "filters": {
            "country_code": "US",
            "object_type": "PAYLOAD"
        }
    },
    "Yaogan": {
        "search_terms": ["YAOGAN"],
        "filters": {
            "country_code": "PRC",
            "object_type": "PAYLOAD"
        }
    },
    # tough to filter this one, lots of unknown objects
    "Jilin": {
        "search_terms": ["LQSAT","LINGQIAO","JILIN"],
        "filters": {
            "country_code": "PRC",
            "object_type": "PAYLOAD"
        }
    },
}

session = requests.Session()

def login():
    login_url = BASE_URL + "/ajaxauth/login"
    payload = {
        "identity": USERNAME,
        "password": PASSWORD
    }
    r = session.post(login_url, data=payload)
    r.raise_for_status()

def build_query_url():

    gt = quote(">")  # This becomes %3E
    fuzzy = quote("~~") # This becomes %7E%7E
    space = quote(" ") # This becomes %20

    base = BASE_URL + "/basicspacedata/query/class/gp/"

    all_terms = []
    min_dates = []
    for config in CONSTELLATIONS.values():
        raw_op = config.get("name_operator", "~~")
        op = gt if raw_op == ">" else fuzzy
        for term in config["search_terms"]:
            all_terms.append(f"{op}{term}")

        if "min_launch_date" in config.get("filters", {}):
            min_dates.append(config["filters"]["min_launch_date"])

    term_string = ",".join(all_terms)

    date_filter = f"LAUNCH_DATE/{gt}{min(min_dates)}/" if min_dates else ""

    query = (
        f"OBJECT_NAME/{term_string}/"
        f"{date_filter}"
        "DECAY_DATE/null-val/"
        "OBJECT_TYPE/PAYLOAD/"
        f"orderby/LAUNCH_DATE{space}desc/"
        # "limit/10000/"  # High limit to avoid truncation
        "format/json"
    )

    full_url = base + query
    print(f"Query URL: {full_url}")

    return full_url

def query_all():

    url = build_query_url()

    r = session.get(url)
    r.raise_for_status()

    return r.json()

def passes_filters(obj, config):

    filters = (config or {}).get("filters", {})

    # --- MIN LAUNCH DATE ---
    if "min_launch_date" in filters:
        launch_date = obj.get("LAUNCH_DATE")
        if not launch_date or str(launch_date)[:10] < filters["min_launch_date"]:
            return False

    # --- COUNTRY CODE ---
    if "country_code" in filters:
        if obj.get("COUNTRY_CODE") != filters["country_code"]:
            return False

    # --- OBJECT TYPE ---
    if "object_type" in filters:
        if obj.get("OBJECT_TYPE") != filters["object_type"]:
            return False

    return True

def classify_and_count(data):

    print(f"--- API returned {len(data)} total objects ---")
    print("Listing all object names:")
    for obj in data:
        print(f" > {obj.get('OBJECT_NAME')}")
    print("--- End of Name List ---\n")

    counts = {
        name: set()
        for name in CONSTELLATIONS.keys()
    }
    starshield_matches = []

    for obj in data:

        name_str = obj["OBJECT_NAME"].upper()
        norad = obj["NORAD_CAT_ID"]

        if name_str.startswith("USA"):
            # Extract number: "USA 321" -> 321
            parts = name_str.split()
            if len(parts) > 1 and parts[1].isdigit():
                usa_num = int(parts[1])
                if usa_num >= 320 and passes_filters(obj, CONSTELLATIONS["Starshield"]):
                    counts["Starshield"].add(norad)
                    continue

        for constellation, config in CONSTELLATIONS.items():

            # --- match search terms ---
            if not any(term in name_str for term in config["search_terms"]):
                continue

            # --- apply filters ---
            if not passes_filters(obj, config):
                continue

            counts[constellation].add(norad)
            break

    print(f"\n--- Found {len(starshield_matches)} Starshield satellites ---")
    print(f"Sample Names: {starshield_matches[:15]}...") 

    return {
        key: len(val)
        for key, val in counts.items()
    }

def main():

    login()

    data = query_all()

    counts = classify_and_count(data)

    results = {
        name: {
            "total_in_orbit": count
        }
        for name, count in counts.items()
    }

    output = {
        "last_updated_utc": datetime.now(timezone.utc).isoformat(),
        "constellations": results
    }

    with open("data/satellite_counts.json", "w") as f:
        json.dump(output, f, indent=2)

    print(results)

if __name__ == "__main__":
    main()
    