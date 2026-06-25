"""
Synthetic Shipment Dataset Generator

Distribution Logic:
1. Delay rates vary by carrier reliability:
   - DHL (Low risk)
   - FedEx (Medium risk)
   - BlueDart (High risk)

2. Route complexity:
   International routes have higher delays.

3. Cargo sensitivity:
   Perishables and Pharmaceuticals are more delay-sensitive.

4. Shipment mode:
   Sea > Rail > Road > Air in terms of delay probability.

This simulates real-world supply chain behavior.
"""

import pandas as pd
import numpy as np
from faker import Faker
from datetime import timedelta
import random

fake = Faker()
np.random.seed(42)
random.seed(42)

NUM_RECORDS = 1000

countries = [
    "India", "USA", "Germany", "China", "Japan",
    "France", "Brazil", "Australia", "Canada", "UAE"
]

carriers = {
    "DHL": 0.10,
    "FedEx": 0.18,
    "BlueDart": 0.28,
    "Maersk": 0.22,
    "UPS": 0.15
}

shipment_modes = {
    "Air": 0.08,
    "Sea": 0.25,
    "Road": 0.15,
    "Rail": 0.18
}

cargo_categories = {
    "Electronics": 0.12,
    "Pharmaceuticals": 0.20,
    "Perishables": 0.25,
    "Industrial": 0.14,
    "Consumer Goods": 0.10
}

statuses = [
    "Delivered",
    "In Transit",
    "Delayed",
    "Held at Customs",
    "Lost"
]

data = []

for i in range(NUM_RECORDS):

    shipment_id = f"SHP-{i+1:04d}"

    origin = random.choice(countries)
    destination = random.choice([c for c in countries if c != origin])

    carrier = random.choice(list(carriers.keys()))
    mode = random.choice(list(shipment_modes.keys()))
    cargo = random.choice(list(cargo_categories.keys()))

    weight = round(np.random.uniform(100, 5000), 2)
    volume = round(np.random.uniform(1, 50), 2)
    declared_value = round(weight * np.random.uniform(10, 50), 2)

    scheduled_departure = fake.date_between(start_date="-60d", end_date="-20d")
    actual_departure = scheduled_departure + timedelta(days=np.random.randint(0, 3))

    transit_days = {
        "Air": np.random.randint(2, 7),
        "Sea": np.random.randint(15, 35),
        "Road": np.random.randint(5, 15),
        "Rail": np.random.randint(7, 20)
    }

    scheduled_delivery = scheduled_departure + timedelta(days=transit_days[mode])

    # Delay probability calculation
    base_delay = (
        carriers[carrier]
        + shipment_modes[mode]
        + cargo_categories[cargo]
    )

    if origin != destination:
        base_delay += 0.05

    is_delayed = 1 if random.random() < base_delay else 0

    if is_delayed:
        delay_days = np.random.randint(1, 15)
    else:
        delay_days = np.random.randint(-3, 1)

    customs_cleared = random.choice([True, False])

    # Status logic
    if is_delayed:
        status = random.choices(
            ["Delayed", "Held at Customs", "Delivered"],
            weights=[50, 20, 30]
        )[0]
    else:
        status = random.choices(
            ["Delivered", "In Transit", "Lost"],
            weights=[75, 20, 5]
        )[0]

    if status == "In Transit":
        actual_delivery = None
    else:
        actual_delivery = scheduled_delivery + timedelta(days=delay_days)

    data.append({
        "shipment_id": shipment_id,
        "origin_country": origin,
        "destination_country": destination,
        "carrier_name": carrier,
        "shipment_mode": mode,
        "cargo_category": cargo,
        "weight_kg": weight,
        "volume_cbm": volume,
        "declared_value_usd": declared_value,
        "scheduled_departure_date": scheduled_departure,
        "actual_departure_date": actual_departure,
        "scheduled_delivery_date": scheduled_delivery,
        "actual_delivery_date": actual_delivery,
        "customs_cleared": customs_cleared,
        "delay_days": delay_days,
        "is_delayed": is_delayed,
        "status": status
    })

df = pd.DataFrame(data)

df.to_csv("shipment_data.csv", index=False)

print("shipment_data.csv generated successfully!")
print(df.head())
print("\nDataset shape:", df.shape)
print("\nDelay Distribution:")
print(df["is_delayed"].value_counts())