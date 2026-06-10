from fastapi import FastAPI
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
    return {
        "status": "ok",
        "uptime": time.process_time(),
        "memory": psutil.virtual_memory().percent
    }