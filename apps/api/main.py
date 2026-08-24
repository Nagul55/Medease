"""
MedEase FastAPI Core Backend Application
Integrated Care-Continuity Layer for Government of Maharashtra
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import triage, patients, referrals, sync, teleconsult, medicines, diagnostics, fhir, abha, facilities, appointments

app = FastAPI(
    title="MedEase API",
    description="Integrated Rural Healthcare & Care-Continuity Backend Service - Govt. of Maharashtra",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(triage.router)
app.include_router(patients.router)
app.include_router(referrals.router)
app.include_router(sync.router)
app.include_router(teleconsult.router)
app.include_router(medicines.router)
app.include_router(diagnostics.router)
app.include_router(fhir.router)
app.include_router(abha.router)
app.include_router(facilities.router)
app.include_router(appointments.router)

@app.get("/")
def root():
    return {
        "system": "MedEase Healthcare Platform API",
        "jurisdiction": "Government of Maharashtra",
        "status": "online",
        "fhir_interoperability": "enabled",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
