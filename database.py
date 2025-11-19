import sqlite3
from datetime import datetime


def init_db():
    """Initialize the database with products and price_history tables"""
    conn = sqlite3.connect("prices.db")
    cursor = conn.cursor()

    # Products table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            url TEXT NOT NULL UNIQUE,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """
    )

    # Price history table
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS price_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            price REAL NOT NULL,
            scraped_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    """
    )

    conn.commit()
    conn.close()
    print("Database initialized successfully")


if __name__ == "__main__":
    init_db()
