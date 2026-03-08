import requests
import pandas as pd
import json
import os
from datetime import datetime, timezone
from io import StringIO
from zoneinfo import ZoneInfo

# Helper function to flatten multi-level column names in a DataFrame
def flatten_columns(df):

    # Create a new list to hold the flattened column names
    new_cols = []

    # Loop through each column in the DataFrame
    for col in df.columns:

        # Check if the column is a tuple (indicating multi-level columns)
        if isinstance(col, tuple):

            # join multi-level column names
            col = " ".join([str(c) for c in col if str(c) != "nan"]).strip()

        # Append the flattened column name to the new_cols list
        new_cols.append(str(col))

    # Assign the new flattened column names back to the DataFrame
    df.columns = new_cols
    return df

# Function to find the summary table in the HTML content
def find_summary_table(html):

    # Use pandas to read all tables from the HTML content
    tables = pd.read_html(StringIO(html))

    # Loop through the tables to find the one that contains both "Total Sats Launched" and "Total In Orbit" columns
    for table in tables:

        # Flatten the columns in case they are multi-level (e.g., from merged headers)
        table = flatten_columns(table)

        # Get the list of column names for the current table
        cols = table.columns.tolist()

        # Check if both required columns are present in the current table
        if any("Total Sats Launched" in c for c in cols) and \
           any("Total In Orbit" in c for c in cols):

            return table

    raise ValueError("Summary table not found")

# Function to extract the total counts of launched and in-orbit satellites from the DataFrame
def extract_totals(df):

    # Initialize variables to hold the column names for launched and in orbit counts
    launched_col = None
    orbit_col = None

    # Loop through the columns to find the relevant ones
    for c in df.columns:
        if "Total Sats Launched" in c:
            launched_col = c
        if "Total In Orbit" in c:
            orbit_col = c

    # Check if both columns were found; if not, raise an error
    if launched_col is None or orbit_col is None:
        raise ValueError("Required columns not found")

    # Loop through the rows to find the "Total" row and extract the counts
    for _, row in df.iterrows():

        # Check if the first cell in the row indicates it's the "Total" row
        if str(row.iloc[0]).strip().lower() == "total":

            # Extract the counts for launched and in orbit satellites, converting them to integers
            launched = int(row[launched_col])
            in_orbit = int(row[orbit_col])

            return launched, in_orbit

    raise ValueError("Total row not found")

# Function to scrape the constellation data from the given URL
def scrape_constellation(url):
    # Fetch the webpage content
    r = requests.get(url)
    r.raise_for_status()

    # Extract the table and the specific metrics
    df = find_summary_table(r.text)
    launched, orbit = extract_totals(df)

    return {
        "total_launched": launched,
        "total_in_orbit": orbit
    }

# Mapping of constellation names to their specific tracking pages
constellations = {
    "Starlink": "https://planet4589.org/space/con/star/stats.html",
    "Kuiper": "https://planet4589.org/space/con/kp1/stats.html",
    "Qianfan": "https://planet4589.org/space/con/qf/stats.html"
}

results = {}

# Process each URL and store results in a dictionary
for name, url in constellations.items():
    try:
        results[name] = scrape_constellation(url)
        print(f"{name} scraped successfully")
    except Exception as e:
        print(f"Error scraping {name}: {e}")

# Prepare the final data structure with a timestamp
output = {
    # .now(timezone.utc) creates a "timezone-aware" object
    # "last_updated_utc": datetime.now(timezone.utc).isoformat(),
    "last_updated_utc": datetime.now(ZoneInfo("America/New_York")).strftime("%Y-%m-%d %I:%M:%S %p %Z"),
    "constellations": results
}

# Output directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(BASE_DIR, "..", "data", "satellite_counts.json")
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Write the data to a JSON file with pretty-printing
with open(output_path, "w") as f:
    json.dump(output, f, indent=2)

# Print a message indicating where the JSON file has been written
print(f"JSON file written to {os.path.abspath(output_path)}")