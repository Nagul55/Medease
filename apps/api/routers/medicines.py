"""
MedEase Medicine Inventory Router
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from db import store

router = APIRouter(prefix="/medicines", tags=["Medicines & Inventory"])

class StockUpdate(BaseModel):
    quantity: int

@router.get("/inventory")
def get_inventory(facility_id: Optional[str] = None):
    results = store.inventories
    if facility_id:
        results = [i for i in results if i.get("facility_id") == facility_id]
    return {"inventory": results, "count": len(results)}

@router.put("/inventory/{inventory_id}")
def update_stock(inventory_id: str, req: StockUpdate):
    for i in store.inventories:
        if i["id"] == inventory_id:
            i["quantity"] = req.quantity
            if req.quantity == 0:
                i["status"] = "out_of_stock"
            elif req.quantity <= i.get("threshold", 20):
                i["status"] = "low"
            else:
                i["status"] = "available"
            return {"status": "updated", "item": i}
    raise HTTPException(status_code=404, detail="Inventory item not found")
