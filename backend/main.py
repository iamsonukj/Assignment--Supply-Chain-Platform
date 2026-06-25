from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from db import (
    shipments_collection,
    carriers_collection,
    routes_collection
)
from init_db import initialize_database
from schemas import ShipmentInput
import joblib
import uuid
import pandas as pd

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
classifier = None
regressor = None


@app.on_event("startup")
def startup():
    global classifier, regressor

    initialize_database()

    classifier = joblib.load("../models/delay_classifier.pkl")
    regressor = joblib.load("../models/delay_regressor.pkl")

    print("Models loaded successfully")


# Logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    response = await call_next(request)
    print(f"{request.method} {request.url.path} -> {response.status_code}")
    return response


# POST /shipments/predict
@app.post("/shipments/predict")
def predict_shipment(shipment: ShipmentInput):

    if classifier is None or regressor is None:
        raise HTTPException(
            status_code=500,
            detail="Models not loaded"
        )

    shipment_data = shipment.model_dump()
    data = pd.DataFrame([shipment_data])

    delay_prob = classifier.predict_proba(data)[0][1]
    delay_pred = classifier.predict(data)[0]

    if delay_pred == 1:
        estimated_delay = int(regressor.predict(data)[0])
    else:
        estimated_delay = 0

    if delay_prob < 0.4:
        risk_level = "Low"
    elif delay_prob < 0.7:
        risk_level = "Medium"
    else:
        risk_level = "High"

    shipment_record = {
        "shipment_id": str(uuid.uuid4())[:8],
        **shipment_data,
        "delay_prediction": "Delayed" if delay_pred else "On Time",
        "delay_probability": round(float(delay_prob), 4),
        "estimated_delay_days": estimated_delay,
        "risk_level": risk_level
    }

    # Insert into MongoDB
    shipments_collection.insert_one(shipment_record)

    # Remove MongoDB ObjectId before returning
    shipment_record.pop("_id", None)

    return shipment_record


# GET /shipments
@app.get("/shipments")
def get_shipments(
    status: Optional[str] = None,
    carrier: Optional[str] = None,
    risk_level: Optional[str] = None,
    page: int = 1
):
    query = {}

    if status:
        query["status"] = status

    if carrier:
        query["carrier_name"] = carrier

    if risk_level:
        query["risk_level"] = risk_level

    page_size = 20
    skip = (page - 1) * page_size

    shipments = list(
        shipments_collection.find(query, {"_id": 0})
        .skip(skip)
        .limit(page_size)
    )

    return shipments


# GET /shipments/{shipment_id}
@app.get("/shipments/{shipment_id}")
def get_shipment(shipment_id: str):
    shipment = shipments_collection.find_one(
        {"shipment_id": shipment_id},
        {"_id": 0}
    )

    if not shipment:
        raise HTTPException(
            status_code=404,
            detail="Shipment not found"
        )

    return shipment


# GET /carriers/anomalies
@app.get("/carriers/anomalies")
def get_anomalous_carriers():
    carriers = list(
        carriers_collection.find(
            {"anomaly_flag": "Anomalous"},
            {"_id": 0}
        )
    )

    return carriers


# GET /routes/risk
@app.get("/routes/risk")
def get_route_risk():
    routes = list(
        routes_collection.find(
            {},
            {"_id": 0}
        ).sort("route_risk_score", -1)
    )

    return routes


# GET /dashboard/summary
@app.get("/dashboard/summary")
def dashboard_summary():
    total_shipments = shipments_collection.count_documents({})
    total_delayed = shipments_collection.count_documents(
        {"delay_prediction": "Delayed"}
    )

    total_in_transit = shipments_collection.count_documents(
        {"status": "In Transit"}
    )

    total_delivered = shipments_collection.count_documents(
        {"status": "Delivered"}
    )

    top_routes = list(
        routes_collection.find(
            {},
            {"_id": 0}
        ).sort("route_risk_score", -1).limit(5)
    )

    return {
        "total_shipments": total_shipments,
        "total_delayed": total_delayed,
        "total_in_transit": total_in_transit,
        "total_delivered": total_delivered,
        "anomalous_carrier_count":
            carriers_collection.count_documents(
                {"anomaly_flag": "Anomalous"}
            ),
        "top_5_risk_routes": top_routes
    }