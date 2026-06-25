"""
MongoDB chosen because:
1. JSON imports directly without schema conversion
2. Flexible for shipment record variations
3. Easier aggregation for analytics endpoints
"""

import json
import pandas as pd
from db import (
    shipments_collection,
    carriers_collection,
    routes_collection
)

# Load shipment predictions
def load_shipments():
    if shipments_collection.count_documents({}) == 0:
        with open("pipeline_output.json", "r") as f:
            data = json.load(f)

        shipments_collection.insert_many(data)
        print("Shipments loaded into MongoDB.")
    else:
        print("Shipments already exist.")

# Load carrier anomalies
def load_carriers():
    if carriers_collection.count_documents({}) == 0:
        df = pd.read_csv("models/carrier_anomalies.csv")

        carriers_collection.insert_many(
            df.to_dict("records")
        )

        print("Carrier anomalies loaded.")
    else:
        print("Carriers already exist.")

# Load route risk scores
def load_routes():
    if routes_collection.count_documents({}) == 0:
        df = pd.read_csv("models/route_risk_scores.csv")

        routes_collection.insert_many(
            df.to_dict("records")
        )

        print("Route risks loaded.")
    else:
        print("Routes already exist.")

# Initialize database
def initialize_database():
    print("Starting database initialization...")

    load_shipments()
    load_carriers()
    load_routes()

    print("Database initialization complete.")

# Run directly
if __name__ == "__main__":
    initialize_database()