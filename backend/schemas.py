from pydantic import BaseModel

class ShipmentInput(BaseModel):
    origin_country: str
    destination_country: str
    carrier_name: str
    shipment_mode: str
    cargo_category: str
    weight_kg: float
    volume_cbm: float
    declared_value_usd: float
    customs_cleared: bool