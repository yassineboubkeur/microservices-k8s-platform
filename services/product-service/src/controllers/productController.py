from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ..config.database import get_connection

router = APIRouter()

# Schemas
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None

# GET /products
@router.get("/")
def get_all_products():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM products ORDER BY created_at DESC")
        products = cur.fetchall()
        conn.close()
        return {"status": "ok", "data": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GET /products/:id
@router.get("/{product_id}")
def get_product(product_id: str):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM products WHERE id = %s", (product_id,))
        product = cur.fetchone()
        conn.close()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"status": "ok", "data": product}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# POST /products
@router.post("/", status_code=201)
def create_product(product: ProductCreate):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO products (name, description, price, stock)
               VALUES (%s, %s, %s, %s)
               RETURNING *""",
            (product.name, product.description, product.price, product.stock)
        )
        new_product = cur.fetchone()
        conn.commit()
        conn.close()
        return {"status": "ok", "data": new_product}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# PUT /products/:id
@router.put("/{product_id}")
def update_product(product_id: str, product: ProductUpdate):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            """UPDATE products SET
               name = COALESCE(%s, name),
               description = COALESCE(%s, description),
               price = COALESCE(%s, price),
               stock = COALESCE(%s, stock),
               updated_at = NOW()
               WHERE id = %s RETURNING *""",
            (product.name, product.description, product.price, product.stock, product_id)
        )
        updated = cur.fetchone()
        conn.commit()
        conn.close()
        if not updated:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"status": "ok", "data": updated}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# DELETE /products/:id
@router.delete("/{product_id}")
def delete_product(product_id: str):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM products WHERE id = %s RETURNING id", (product_id,))
        deleted = cur.fetchone()
        conn.commit()
        conn.close()
        if not deleted:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"status": "ok", "message": "Product deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))