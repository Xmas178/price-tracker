import requests
from bs4 import BeautifulSoup
import sqlite3
from datetime import datetime
import time
from logger import logger


def scrape_books():
    """Scrape books from the test website and save to database"""
    url = "https://books.toscrape.com/"

    try:
        # Fetch the page
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, "lxml")
        books = soup.find_all("article", class_="product_pod")

        if not books:
            logger.warning("No books found on the page")
            return

        conn = sqlite3.connect("prices.db")
        cursor = conn.cursor()

        saved_count = 0

        for book in books[:5]:
            try:
                title = book.h3.a["title"]
                price_text = book.find("p", class_="price_color").text
                price = float(price_text.replace("£", ""))
                book_url = url + book.h3.a["href"]

                # Insert or get product
                cursor.execute(
                    """
                    INSERT OR IGNORE INTO products (title, url)
                    VALUES (?, ?)
                """,
                    (title, book_url),
                )

                # Get product id
                cursor.execute("SELECT id FROM products WHERE url = ?", (book_url,))
                product_id = cursor.fetchone()[0]

                # Insert price
                cursor.execute(
                    """
                    INSERT INTO price_history (product_id, price)
                    VALUES (?, ?)
                """,
                    (product_id, price),
                )

                logger.info(f"Saved: {title} - £{price}")
                saved_count += 1

            except Exception as e:
                logger.error(f"Error processing book: {e}")
                continue

        conn.commit()
        conn.close()

        logger.info(f"Successfully saved {saved_count} products")

    except requests.RequestException as e:
        logger.error(f"Network error: {e}")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")


if __name__ == "__main__":
    scrape_books()
