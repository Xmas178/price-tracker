from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from typing import List, Dict
import uvicorn

app = FastAPI(title="Price Tracker API")

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    """Get database connection"""
    conn = sqlite3.connect("prices.db")
    conn.row_factory = sqlite3.Row
    return conn


@app.get("/")
def root():
    """API root endpoint"""
    return {"message": "Price Tracker API", "version": "1.0"}


@app.get("/products")
def get_products():
    """Get all products"""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT p.id, p.title, p.url,
               ph.price as current_price,
               ph.scraped_at as last_updated
        FROM products p
        LEFT JOIN price_history ph ON p.id = ph.product_id
        WHERE ph.id = (
            SELECT id FROM price_history
            WHERE product_id = p.id
            ORDER BY scraped_at DESC
            LIMIT 1
        )
    """
    )

    products = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return {"products": products, "count": len(products)}


@app.get("/products/{product_id}/history")
def get_product_history(product_id: int):
    """Get price history for a specific product"""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT price, scraped_at
        FROM price_history
        WHERE product_id = ?
        ORDER BY scraped_at DESC
    """,
        (product_id,),
    )

    history = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return {"product_id": product_id, "history": history, "count": len(history)}


@app.get("/stats")
def get_stats():
    """Get overall statistics"""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as total_products FROM products")
    total_products = cursor.fetchone()["total_products"]

    cursor.execute("SELECT COUNT(*) as total_scans FROM price_history")
    total_scans = cursor.fetchone()["total_scans"]

    conn.close()

    return {"total_products": total_products, "total_scans": total_scans}


@app.get("/alerts")
def get_price_alerts(threshold: float = 5.0):
    """Get products with significant price changes (percentage)"""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT p.id, p.title, p.url,
               ph1.price as current_price,
               ph2.price as previous_price,
               ((ph1.price - ph2.price) / ph2.price * 100) as change_percent,
               ph1.scraped_at as last_updated
        FROM products p
        JOIN price_history ph1 ON p.id = ph1.product_id
        JOIN price_history ph2 ON p.id = ph2.product_id
        WHERE ph1.id = (
            SELECT id FROM price_history
            WHERE product_id = p.id
            ORDER BY scraped_at DESC LIMIT 1
        )
        AND ph2.id = (
            SELECT id FROM price_history
            WHERE product_id = p.id
            ORDER BY scraped_at DESC LIMIT 1 OFFSET 1
        )
        AND ABS((ph1.price - ph2.price) / ph2.price * 100) >= ?
    """,
        (threshold,),
    )

    alerts = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return {"alerts": alerts, "threshold": threshold, "count": len(alerts)}


@app.get("/export/csv")
def export_csv():
    """Export all price history to CSV format"""
    from fastapi.responses import StreamingResponse
    import io
    import csv

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT p.title, p.url, ph.price, ph.scraped_at
        FROM price_history ph
        JOIN products p ON ph.product_id = p.id
        ORDER BY ph.scraped_at DESC
    """
    )

    rows = cursor.fetchall()
    conn.close()

    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Title", "URL", "Price", "Date"])

    for row in rows:
        writer.writerow([row["title"], row["url"], row["price"], row["scraped_at"]])

    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=price_history.csv"},
    )


@app.get("/products/{product_id}/history")
def get_product_history(product_id: int, start_date: str = None, end_date: str = None):
    """Get price history for a specific product with optional date filtering"""
    conn = get_db()
    cursor = conn.cursor()

    query = """
        SELECT price, scraped_at
        FROM price_history
        WHERE product_id = ?
    """
    params = [product_id]

    if start_date:
        query += " AND scraped_at >= ?"
        params.append(start_date)

    if end_date:
        query += " AND scraped_at <= ?"
        params.append(end_date)

    query += " ORDER BY scraped_at DESC"

    cursor.execute(query, params)

    history = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return {
        "product_id": product_id,
        "history": history,
        "count": len(history),
        "filters": {"start_date": start_date, "end_date": end_date},
    }
