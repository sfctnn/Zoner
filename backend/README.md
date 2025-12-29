# Zoner Backend

Self-hosted Python FastAPI server for Amazon product scraping.

## Features

- **Real-time Amazon search** via headless Chrome (undetected-chromedriver)
- **Background price monitoring** with APScheduler
- **Discord webhook notifications** when price targets are hit
- **No rate limits** - runs entirely on your machine

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

> **Note**: First run will download Chrome (~100MB) automatically.

### 2. Start the Server

```bash
uvicorn main:app --reload --port 8000
```

The server will be available at `http://localhost:8000`

### 3. API Documentation

Once running, visit:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### `GET /health`

Health check endpoint.

```json
{
  "status": "ok",
  "tracked_count": 5,
  "scheduler_running": true
}
```

### `GET /search?query=samsung+ssd`

Search Amazon products.

```json
{
  "success": true,
  "query": "samsung ssd",
  "count": 20,
  "products": [...],
  "scrape_time_ms": 3500
}
```

### `POST /track`

Add product to background monitoring.

```json
{
  "url": "https://amazon.com/dp/B...",
  "asin": "B0...",
  "title": "Samsung 990 PRO",
  "current_price": 169.99,
  "target_price": 129.99,
  "discord_webhook": "https://discord.com/api/webhooks/...",
  "check_interval_minutes": 5
}
```

### `GET /tracked`

List all tracked products.

### `DELETE /tracked/{product_id}`

Remove product from tracking.

## Troubleshooting

### Chrome not found

The first run downloads Chrome automatically. If it fails:

```bash
pip install --upgrade undetected-chromedriver
```

### Blocked by Amazon

The scraper uses undetected-chromedriver to bypass basic detection. If blocked:

- Increase delays between requests
- Use a VPN
- Try different search queries

### Port already in use

Change the port:

```bash
uvicorn main:app --reload --port 8001
```

## Architecture

```
┌──────────────────┐     ┌──────────────────┐
│  React Frontend  │────▶│  Python Backend  │
│  localhost:5173  │     │  localhost:8000  │
└──────────────────┘     └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │ Headless Chrome  │
                         │ (undetected-cd)  │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │    Amazon.com    │
                         └──────────────────┘
```

## License

MIT
