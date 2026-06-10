import psycopg
from psycopg.rows import dict_row
from .config import config

def get_connection():
    return psycopg.connect(
        host=config.DB_HOST,
        port=config.DB_PORT,
        dbname=config.DB_NAME,
        user=config.DB_USER,
        password=config.DB_PASSWORD,
        row_factory=dict_row
    )

def test_connection():
    try:
        conn = get_connection()
        conn.close()
        return True
    except Exception as e:
        print(f"DB connection failed: {e}")
        return False