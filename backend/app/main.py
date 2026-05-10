from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import our modular routers
from app.routes.health import router as health_router
from app.routes.upload import router as upload_router
from app.routes.analytics import router as analytics_router

# Initialize FastAPI application
app = FastAPI(
    title="SpendNest API",
    description="Backend API for the SpendNest personal finance dashboard",
    version="1.0.0"
)

import os

# Configure CORS
# Note: allow_credentials=True cannot be used with allow_origins=["*"]
cors_origins_raw = os.getenv("CORS_ORIGINS", "*")
origins = cors_origins_raw.split(",")

# If we are using a wildcard, we must set allow_credentials to False
allow_all = "*" in origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=not allow_all,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register (include) our routers
# This tells FastAPI to use the routes we've defined in other files
app.include_router(health_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
