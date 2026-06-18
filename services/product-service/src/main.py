from fastapi import FastAPI
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from fastapi import Response
from .config.database import test_connection
from .controllers.productController import router as product_router
from .controllers.orderController import router as order_router
import time
import psutil

app = FastAPI(title="Product Service")

app.include_router(product_router, prefix="/products")
app.include_router(order_router, prefix="/orders")

@app.get("/health")
def health():
    db_status = "connected" if test_connection() else "disconnected"
    return {
        "status": "ok" if db_status == "connected" else "error",
        "service": "product-service",
        "db": db_status
    }

@app.get("/metrics")
def metrics():
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)