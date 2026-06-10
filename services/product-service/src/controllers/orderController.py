from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..config.database import get_connection

router = APIRouter()

# Schemas
class OrderCreate(BaseModel):
    user_id: str
    product_id: str
    quantity: int

class OrderUpdateStatus(BaseModel):
    status: str

VALID_TRANSITIONS = {
    "pending": ["confirmed", "cancelled"],
    "confirmed": ["shipped"],
    "shipped": ["delivered"],
    "delivered": [],
    "cancelled": []
}

# GET /orders
@router.get("/")
def get_all_orders():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT o.*, p.name as product_name
            FROM orders o
            JOIN products p ON o.product_id = p.id
            ORDER BY o.created_at DESC
        """)
        orders = cur.fetchall()
        conn.close()
        return {"status": "ok", "data": orders}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GET /orders/:id
@router.get("/{order_id}")
def get_order(order_id: str):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT o.*, p.name as product_name
            FROM orders o
            JOIN products p ON o.product_id = p.id
            WHERE o.id = %s
        """, (order_id,))
        order = cur.fetchone()
        conn.close()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return {"status": "ok", "data": order}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# POST /orders
@router.post("/", status_code=201)
def create_order(order: OrderCreate):
    try:
        conn = get_connection()
        cur = conn.cursor()

        # Shuf product mawjud w 3ndu stock
        cur.execute("SELECT * FROM products WHERE id = %s", (order.product_id,))
        product = cur.fetchone()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        if product["stock"] < order.quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")

        total_price = product["price"] * order.quantity

        # Khllq order
        cur.execute("""
            INSERT INTO orders (user_id, product_id, quantity, total_price)
            VALUES (%s, %s, %s, %s) RETURNING *
        """, (order.user_id, order.product_id, order.quantity, total_price))
        new_order = cur.fetchone()

        # Nqs stock
        cur.execute("""
            UPDATE products SET stock = stock - %s, updated_at = NOW()
            WHERE id = %s
        """, (order.quantity, order.product_id))

        conn.commit()
        conn.close()
        return {"status": "ok", "data": new_order}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PUT /orders/:id — update status
@router.put("/{order_id}")
def update_order_status(order_id: str, body: OrderUpdateStatus):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT status FROM orders WHERE id = %s", (order_id,))
        order = cur.fetchone()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        current_status = order["status"]
        new_status = body.status

        # Verify transition valide
        if new_status not in VALID_TRANSITIONS.get(current_status, []):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid transition: {current_status} → {new_status}"
            )

        cur.execute("""
            UPDATE orders SET status = %s, updated_at = NOW()
            WHERE id = %s RETURNING *
        """, (new_status, order_id))
        updated = cur.fetchone()
        conn.commit()
        conn.close()
        return {"status": "ok", "data": updated}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))