# Price Tracker

A web scraping application that monitors product prices from e-commerce websites and tracks price history over time. Built with FastAPI backend, SQLite database, and automated scheduling.

## Features

- Automated web scraping with BeautifulSoup4
- Price history tracking in SQLite database
- Scheduled scraping (runs every 24 hours)
- RESTful API with FastAPI
- Price change alerts
- CSV export functionality
- Date range filtering
- Comprehensive error handling and logging

## Tech Stack

**Frontend:**
- React + Vite - Modern frontend framework
- Material-UI - Component library
- Recharts - Data visualization
- Axios - HTTP client

## Screenshots

### Product List
![Product List](screenshots/products-list.png)

### Statistics Dashboard
![Statistics](screenshots/statistics.png)

### Price Alerts
![Price Alerts](screenshots/price-alerts.png)

### API Response
![API Response](screenshots/api-response.png)

**Backend:**
- FastAPI - Modern Python web framework
- SQLite - Lightweight database
- BeautifulSoup4 - Web scraping
- APScheduler - Task scheduling
- Uvicorn - ASGI server

## Project Structure
```
price-tracker/
├── api.py              # FastAPI REST API endpoints
├── scraper.py          # Web scraping logic
├── database.py         # Database initialization
├── scheduler.py        # Automated scraping scheduler
├── logger.py           # Logging configuration
├── prices.db           # SQLite database (generated)
├── scraper.log         # Application logs (generated)
├── screenshots/        # Dashboard screenshots
└── frontend/           # React frontend application
    ├── src/
    │   ├── App.jsx
    │   └── components/
    │       ├── ProductList.jsx
    │       ├── Statistics.jsx
    │       └── PriceAlerts.jsx
    └── package.json
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Xmas178/price-tracker.git
cd price-tracker
```

2. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Initialize database:
```bash
python database.py
```

## Usage

### Run Manual Scrape
```bash
python scraper.py
```

### Start API Server
```bash
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: `http://localhost:8000`

### Start Automated Scheduler
```bash
python scheduler.py
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:5173`

Scraper will run every 24 hours automatically.

## API Endpoints

### Get All Products
```
GET /products
```

Returns all products with their latest prices.

### Get Product Price History
```
GET /products/{product_id}/history
GET /products/{product_id}/history?start_date=2025-11-19&end_date=2025-11-20
```

Returns price history for a specific product with optional date filtering.

### Get Statistics
```
GET /stats
```

Returns overall statistics (total products, total scans).

### Get Price Alerts
```
GET /alerts?threshold=5.0
```

Returns products with price changes exceeding the threshold percentage.

### Export to CSV
```
GET /export/csv
```

Downloads all price history as CSV file.

## Example Response
```json
{
  "products": [
    {
      "id": 1,
      "title": "Product Name",
      "url": "https://example.com/product",
      "current_price": 49.99,
      "last_updated": "2025-11-19 18:00:00"
    }
  ],
  "count": 1
}
```

## Development

This is a demo project for portfolio purposes. In production use:

- Add authentication/authorization
- Implement rate limiting
- Add proxy rotation for large-scale scraping
- Use PostgreSQL for production database
- Deploy with Docker
- Add comprehensive testing

## Future Enhancements

- React dashboard with charts
- Email notifications for price alerts
- Multiple website support
- Product comparison features
- Mobile app integration

## Author

Xmas178

- GitHub: https://github.com/Xmas178
- Portfolio: https://www.tommilammi.fi

## License

This project is open source and available for educational purposes.