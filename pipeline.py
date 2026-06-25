import pandas as pd
import numpy as np
import os
import json
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report, f1_score
from sklearn.metrics import mean_absolute_error

os.makedirs("models", exist_ok=True)

# Load dataset
df = pd.read_csv("shipment_data.csv")

# ==========================================
# FEATURE SELECTION
# ==========================================
features = [
    "origin_country",
    "destination_country",
    "carrier_name",
    "shipment_mode",
    "cargo_category",
    "weight_kg",
    "volume_cbm",
    "declared_value_usd",
    "customs_cleared"
]

categorical_features = [
    "origin_country",
    "destination_country",
    "carrier_name",
    "shipment_mode",
    "cargo_category"
]

numerical_features = [
    "weight_kg",
    "volume_cbm",
    "declared_value_usd",
    "customs_cleared"
]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ],
    remainder="passthrough"
)

# ==========================================
# MODEL 1 — DELAY CLASSIFIER
# ==========================================
"""
Using RandomForest because:
- Handles categorical data well after encoding
- Works better with mixed numerical/categorical features
- Less prone to overfitting than single decision tree
"""

X = df[features]
y = df["is_delayed"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

classifier = Pipeline([
    ("preprocessor", preprocessor),
    ("model", RandomForestClassifier(
        n_estimators=200,
        random_state=42
    ))
])

classifier.fit(X_train, y_train)

y_pred = classifier.predict(X_test)

print("\n===== Delay Classifier Report =====")
print(classification_report(y_test, y_pred))

f1 = f1_score(y_test, y_pred)
print("F1 Score:", round(f1, 4))

joblib.dump(classifier, "models/delay_classifier.pkl")

# ==========================================
# MODEL 2 — DELAY REGRESSOR
# ==========================================
delayed_df = df[df["is_delayed"] == 1]

X_reg = delayed_df[features]
y_reg = delayed_df["delay_days"]

X_train_reg, X_test_reg, y_train_reg, y_test_reg = train_test_split(
    X_reg, y_reg, test_size=0.2, random_state=42
)

regressor = Pipeline([
    ("preprocessor", preprocessor),
    ("model", RandomForestRegressor(
        n_estimators=200,
        random_state=42
    ))
])

regressor.fit(X_train_reg, y_train_reg)

y_pred_reg = regressor.predict(X_test_reg)

mae = mean_absolute_error(y_test_reg, y_pred_reg)

print("\n===== Delay Regressor =====")
print("MAE:", round(mae, 4))

joblib.dump(regressor, "models/delay_regressor.pkl")

# ==========================================
# MODEL 3 — CARRIER ANOMALY DETECTOR
# ==========================================
carrier_stats = df.groupby("carrier_name").agg({
    "delay_days": "mean",
    "is_delayed": "mean",
    "weight_kg": "mean",
    "volume_cbm": "mean",
    "shipment_id": "count"
}).reset_index()

carrier_stats.columns = [
    "carrier_name",
    "average_delay_days",
    "delay_rate_percent",
    "average_weight",
    "average_volume",
    "total_shipments"
]

carrier_stats["delay_rate_percent"] *= 100

iso = IsolationForest(
    contamination=0.2,
    random_state=42
)

carrier_features = carrier_stats[
    [
        "average_delay_days",
        "delay_rate_percent",
        "average_weight",
        "average_volume",
        "total_shipments"
    ]
]

carrier_stats["anomaly_score"] = iso.fit_predict(carrier_features)

carrier_stats["anomaly_flag"] = carrier_stats["anomaly_score"].apply(
    lambda x: "Anomalous" if x == -1 else "Normal"
)

carrier_stats.to_csv("models/carrier_anomalies.csv", index=False)

print("\nCarrier anomalies saved.")

# ==========================================
# MODEL 4 — ROUTE RISK SCORER
# ==========================================
"""
Weights:
40% Delay Rate
30% Avg Delay Days
20% Customs Hold Rate
10% Loss Rate

Reason:
Delay rate impacts business most,
customs and loss are secondary risk factors.
"""

route_stats = df.groupby(
    ["origin_country", "destination_country"]
).agg({
    "is_delayed": "mean",
    "delay_days": "mean",
    "customs_cleared": lambda x: (x == False).mean(),
    "status": lambda x: (x == "Lost").mean()
}).reset_index()

route_stats.columns = [
    "origin_country",
    "destination_country",
    "historical_delay_rate_percent",
    "average_delay_days",
    "customs_hold_rate_percent",
    "loss_rate_percent"
]

route_stats["historical_delay_rate_percent"] *= 100
route_stats["customs_hold_rate_percent"] *= 100
route_stats["loss_rate_percent"] *= 100

route_stats["route_risk_score"] = (
    (route_stats["historical_delay_rate_percent"] * 0.4) +
    (route_stats["average_delay_days"] * 0.3) +
    (route_stats["customs_hold_rate_percent"] * 0.2) +
    (route_stats["loss_rate_percent"] * 0.1)
)

route_stats["route_risk_score"] = route_stats[
    "route_risk_score"
].clip(0, 100)

route_stats.to_csv("models/route_risk_scores.csv", index=False)

print("\nRoute risk scores saved.")

# ==========================================
# PIPELINE OUTPUT JSON
# ==========================================
delay_probs = classifier.predict_proba(df[features])[:, 1]
delay_preds = classifier.predict(df[features])

estimated_delay = []

for idx, pred in enumerate(delay_preds):
    if pred == 1:
        est = regressor.predict(df.iloc[[idx]][features])[0]
        estimated_delay.append(round(float(est), 2))
    else:
        estimated_delay.append(0)

carrier_map = dict(
    zip(
        carrier_stats["carrier_name"],
        carrier_stats["anomaly_flag"]
    )
)

route_map = {
    (row["origin_country"], row["destination_country"]): row["route_risk_score"]
    for _, row in route_stats.iterrows()
}

output = []

for idx, row in df.iterrows():
    output.append({
        "shipment_id": row["shipment_id"],
        "delay_prediction": int(delay_preds[idx]),
        "delay_probability": round(float(delay_probs[idx]), 4),
        "estimated_delay_days": estimated_delay[idx],
        "carrier_anomaly_flag": carrier_map[row["carrier_name"]],
        "route_risk_score": round(
            float(route_map[(row["origin_country"], row["destination_country"])]),
            2
        )
    })

with open("pipeline_output.json", "w") as f:
    json.dump(output, f, indent=4)

print("\nPipeline output saved successfully!")