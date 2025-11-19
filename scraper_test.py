import requests
from bs4 import BeautifulSoup

# Test with a simple practice website
url = "https://books.toscrape.com/"

response = requests.get(url)
soup = BeautifulSoup(response.content, "lxml")

# Find all books on the page
books = soup.find_all("article", class_="product_pod")

print(f"Found {len(books)} books\n")

# Get details from first 5 books
for book in books[:5]:
    title = book.h3.a["title"]
    price = book.find("p", class_="price_color").text

    print(f"📚 {title}")
    print(f"💰 {price}\n")
