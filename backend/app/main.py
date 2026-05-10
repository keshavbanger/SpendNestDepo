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
# In production, you should specify the exact frontend URL
origins = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register (include) our routers
# This tells FastAPI to use the routes we've defined in other files
app.include_router(health_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
