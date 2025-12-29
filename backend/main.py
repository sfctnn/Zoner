"""
Zoner Backend - Amazon Scraper with ScraperAPI
==============================================
Uses ScraperAPI proxy to bypass Amazon CAPTCHA.
Free tier: 5000 requests/month

Get your free API key: https://www.scraperapi.com (sign up, copy key from dashboard)

Setup:
  1. pip install -r requirements.txt
  2. Create .env file with: SCRAPER_API_KEY=your_key_here
  3. uvicorn main:app --reload --port 8000
"""

import asyncio
import os
import re
import time
import traceback
import random
import sqlite3
import logging
from datetime import datetime
from typing import Optional, List, Dict
from contextlib import asynccontextmanager
from pathlib import Path
from urllib.parse import quote_plus

from fastapi import FastAPI, HTTPException, BackgroundTasks, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from bs4 import BeautifulSoup
import httpx
from dotenv import load_dotenv

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from discord_webhook import DiscordWebhook, DiscordEmbed
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Load .env file
load_dotenv()

# ============================================================================
# 📝 STRUCTURED LOGGING
# ============================================================================

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('zoner')

# ============================================================================
# ⚙️ CONFIGURATION
# ============================================================================

# Multi-region Amazon domains with currency/locale info
AMAZON_DOMAINS = {
    "amazon.com": {"name": "USA", "flag": "🇺🇸", "currency": "$", "locale": "en-US"},
    "amazon.com.tr": {"name": "Turkey", "flag": "🇹🇷", "currency": "₺", "locale": "tr-TR"},
    "amazon.de": {"name": "Germany", "flag": "🇩🇪", "currency": "€", "locale": "de-DE"},
    "amazon.co.uk": {"name": "UK", "flag": "🇬🇧", "currency": "£", "locale": "en-GB"},
}

DEFAULT_DOMAIN = "amazon.com"
REQUEST_TIMEOUT = 60  # ScraperAPI can be slow

# ScraperAPI Configuration (FREE: 5000 requests/month)
# Get your key at: https://www.scraperapi.com
SCRAPER_API_KEY = os.getenv("SCRAPER_API_KEY", "")
SCRAPER_API_URL = "http://api.scraperapi.com"

# Set to True to use ScraperAPI, False for direct requests
USE_SCRAPER_API = bool(SCRAPER_API_KEY)

# Debug file path
DEBUG_HTML_PATH = Path(__file__).parent / "debug_scrape_fail.html"

# SQLite database path
DB_PATH = Path(__file__).parent / "zoner.db"

# CORS Configuration (comma-separated origins, or * for all)
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")

# Tracked products storage (loaded from SQLite on startup)
tracked_products: Dict[str, Dict] = {}
scheduler: Optional[AsyncIOScheduler] = None

# Rotating User Agents
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
]

def get_headers():
    """Get randomized headers to avoid detection."""
    return {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
    }

# ============================================================================
# 📦 Pydantic Models
# ============================================================================

class Product(BaseModel):
    id: str
    asin: str
    title: str
    price: float
    original_price: Optional[float] = None
    image: Optional[str] = None
    url: str
    seller: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    is_prime: bool = False
    in_stock: bool = True

class TrackRequest(BaseModel):
    url: str
    asin: str
    title: str
    current_price: float
    target_price: float
    discord_webhook: Optional[str] = None
    check_interval_minutes: int = 5
    domain: str = "amazon.com"  # Added for multi-region currency support

class TrackResponse(BaseModel):
    success: bool
    message: str
    product_id: Optional[str] = None

class SearchResponse(BaseModel):
    success: bool
    query: str
    count: int
    products: List[Product]
    scrape_time_ms: int
    error: Optional[str] = None
    debug_info: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    tracked_count: int
    scheduler_running: bool

# ============================================================================
# 💾 SQLite Persistence
# ============================================================================

def init_database():
    """Initialize SQLite database for tracked products."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tracked_products (
            id TEXT PRIMARY KEY,
            url TEXT NOT NULL,
            asin TEXT NOT NULL,
            title TEXT NOT NULL,
            current_price REAL NOT NULL,
            target_price REAL NOT NULL,
            discord_webhook TEXT,
            check_interval INTEGER DEFAULT 5,
            domain TEXT DEFAULT 'amazon.com',
            added_at TEXT,
            last_checked TEXT,
            last_price REAL
        )
    ''')
    conn.commit()
    conn.close()
    print("✅ Database initialized")

def load_tracked_products():
    """Load tracked products from SQLite into memory."""
    global tracked_products
    if not DB_PATH.exists():
        return
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM tracked_products')
    rows = cursor.fetchall()
    conn.close()
    
    for row in rows:
        tracked_products[row['id']] = dict(row)
    
    if tracked_products:
        print(f"📦 Loaded {len(tracked_products)} tracked products from database")

def save_tracked_product(product: Dict):
    """Save a tracked product to SQLite."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT OR REPLACE INTO tracked_products 
        (id, url, asin, title, current_price, target_price, discord_webhook, 
         check_interval, domain, added_at, last_checked, last_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        product['id'], product['url'], product['asin'], product['title'],
        product['current_price'], product['target_price'], product.get('discord_webhook'),
        product.get('check_interval', 5), product.get('domain', 'amazon.com'),
        product.get('added_at'), product.get('last_checked'), product.get('last_price')
    ))
    conn.commit()
    conn.close()

def delete_tracked_product(product_id: str):
    """Delete a tracked product from SQLite."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM tracked_products WHERE id = ?', (product_id,))
    conn.commit()
    conn.close()

def get_currency_for_product(product: Dict) -> str:
    """Get currency symbol for a product based on its domain."""
    domain = product.get('domain', DEFAULT_DOMAIN)
    return AMAZON_DOMAINS.get(domain, {}).get('currency', '$')

# ============================================================================
# 💰 Price Parsing
# ============================================================================

def parse_price(text: str) -> Optional[float]:
    """Extract price from various Amazon price formats."""
    if not text:
        return None
    
    cleaned = re.sub(r'[^\d.,]', '', text.strip())
    if not cleaned:
        return None
    
    if ',' in cleaned and '.' in cleaned:
        if cleaned.rfind(',') > cleaned.rfind('.'):
            cleaned = cleaned.replace('.', '').replace(',', '.')
        else:
            cleaned = cleaned.replace(',', '')
    elif ',' in cleaned:
        parts = cleaned.split(',')
        if len(parts[-1]) == 2:
            cleaned = cleaned.replace(',', '.')
        else:
            cleaned = cleaned.replace(',', '')
    
    try:
        return float(cleaned)
    except ValueError:
        return None

# ============================================================================
# 🔍 Multi-Selector Strategy
# ============================================================================

TITLE_SELECTORS = [
    'h2 a span.a-text-normal',
    'h2 a span',
    'h2 span.a-text-normal',
    'h2 span',
    '.a-size-medium.a-color-base.a-text-normal',
    '.a-size-base-plus.a-color-base.a-text-normal',
]

PRICE_SELECTORS = [
    '.a-price .a-offscreen',
    'span.a-price span.a-offscreen',
    '.a-price-whole',
    '.a-color-price',
    '#priceblock_ourprice',
    '#priceblock_dealprice',
]

ORIGINAL_PRICE_SELECTORS = [
    '.a-price.a-text-price .a-offscreen',
    '.a-text-price .a-offscreen',
    '.a-text-strike',
]

def try_selectors(element, selectors: List[str]) -> Optional[str]:
    """Try multiple CSS selectors and return first match."""
    for selector in selectors:
        try:
            found = element.select_one(selector)
            if found:
                text = found.get_text(strip=True)
                if text:
                    return text
        except Exception:
            continue
    return None

# ============================================================================
# 🕷️ Scraping with ScraperAPI (CAPTCHA Bypass)
# ============================================================================

def build_scraper_url(target_url: str, domain: str = DEFAULT_DOMAIN) -> str:
    """Build ScraperAPI proxy URL with region-specific country code."""
    if USE_SCRAPER_API:
        # Map domain to country code for ScraperAPI
        country_codes = {
            "amazon.com": "us",
            "amazon.com.tr": "tr",
            "amazon.de": "de",
            "amazon.co.uk": "uk",
        }
        country = country_codes.get(domain, "us")
        encoded_url = quote_plus(target_url)
        return f"{SCRAPER_API_URL}?api_key={SCRAPER_API_KEY}&url={encoded_url}&country_code={country}"
    return target_url

async def scrape_search_results(query: str, domain: str = DEFAULT_DOMAIN) -> Dict:
    """
    Scrape Amazon search results from specified domain.
    Uses ScraperAPI if key is configured, otherwise direct HTTP.
    
    Args:
        query: Search query string
        domain: Amazon domain (e.g., 'amazon.com', 'amazon.com.tr')
    """
    # Validate domain
    if domain not in AMAZON_DOMAINS:
        domain = DEFAULT_DOMAIN
    
    domain_info = AMAZON_DOMAINS[domain]
    products = []
    debug_info = []
    error_message = None
    
    print(f"\n{'='*60}")
    if USE_SCRAPER_API:
        print(f"🔍 SCRAPING via ScraperAPI: '{query}' on {domain_info['flag']} {domain}")
        debug_info.append(f"Mode: ScraperAPI | Domain: {domain}")
    else:
        print(f"🔍 SCRAPING (Direct HTTP): '{query}' on {domain_info['flag']} {domain}")
        debug_info.append(f"Mode: Direct HTTP | Domain: {domain}")
    print(f"{'='*60}")
    
    # Build Amazon search URL with dynamic domain
    amazon_url = f"https://www.{domain}/s?k={query.replace(' ', '+')}"
    print(f"📍 Amazon URL: {amazon_url}")
    debug_info.append(f"Amazon URL: {amazon_url}")
    
    # Build final request URL (through proxy if configured)
    request_url = build_scraper_url(amazon_url, domain)
    
    if USE_SCRAPER_API:
        print(f"🔗 Routing through ScraperAPI proxy...")
        debug_info.append("Using ScraperAPI proxy")
    
    try:
        async with httpx.AsyncClient(
            follow_redirects=True,
            timeout=REQUEST_TIMEOUT,
        ) as client:
            # Headers for direct requests (ScraperAPI handles its own)
            headers = get_headers() if not USE_SCRAPER_API else {}
            
            if not USE_SCRAPER_API:
                print(f"🌐 User-Agent: {headers.get('User-Agent', 'N/A')[:50]}...")
            
            response = await client.get(request_url, headers=headers)
            
            print(f"📊 Status: {response.status_code}")
            debug_info.append(f"Status: {response.status_code}")
            
            if response.status_code != 200:
                error_message = f"Request failed with status {response.status_code}"
                DEBUG_HTML_PATH.write_text(response.text, encoding='utf-8')
                print(f"📄 HTML saved to: {DEBUG_HTML_PATH}")
                return {
                    'products': [],
                    'error': error_message,
                    'debug_info': '\n'.join(debug_info),
                }
            
            html_content = response.text
            print(f"📄 HTML length: {len(html_content)} bytes")
            debug_info.append(f"HTML length: {len(html_content)} bytes")
            
            # Smart CAPTCHA detection - check for ACTUAL captcha page elements
            # Amazon search pages contain "robot" in meta tags but that's NOT a CAPTCHA
            is_captcha = False
            html_lower = html_content.lower()
            
            # Real CAPTCHA indicators (form with captcha input)
            if 'type="password"' in html_lower and 'captcha' in html_lower:
                is_captcha = True
            # "Enter the characters you see below" page
            elif 'enter the characters' in html_lower:
                is_captcha = True
            # "Sorry, we just need to make sure you're not a robot"
            elif "we just need to make sure you're not a robot" in html_lower:
                is_captcha = True
            # No search results selector found + title contains Error
            elif 'api-services-support@amazon.com' in html_lower:
                is_captcha = True
            
            if is_captcha:
                print("🚨 REAL CAPTCHA DETECTED!")
                debug_info.append("CAPTCHA PAGE DETECTED")
                error_message = "Amazon CAPTCHA page detected. Try again later or use VPN."
                DEBUG_HTML_PATH.write_text(html_content, encoding='utf-8')
                print(f"📄 HTML saved to: {DEBUG_HTML_PATH}")
                return {
                    'products': [],
                    'error': error_message,
                    'debug_info': '\n'.join(debug_info),
                }
            
            # Parse with BeautifulSoup
            soup = BeautifulSoup(html_content, 'lxml')
            
            # Find result items
            result_items = soup.select("[data-component-type='s-search-result']")
            print(f"📦 Found {len(result_items)} result items")
            debug_info.append(f"Found {len(result_items)} result items")
            
            if len(result_items) == 0:
                DEBUG_HTML_PATH.write_text(html_content, encoding='utf-8')
                print(f"⚠️ No results! HTML saved to: {DEBUG_HTML_PATH}")
                
                # Check if we got a different page (login, error, etc)
                title = soup.select_one('title')
                page_title = title.get_text() if title else "Unknown"
                debug_info.append(f"Page title: {page_title}")
                print(f"📄 Page title: {page_title}")
            
            # Parse each result
            for idx, item in enumerate(result_items[:20]):
                try:
                    product = parse_search_result_item(item, idx, domain)
                    if product and product.get('price'):
                        products.append(product)
                        currency = domain_info['currency']
                        print(f"  ✅ [{idx+1}] {product['title'][:50]}... {currency}{product['price']}")
                    else:
                        asin = item.get('data-asin', 'N/A')
                        print(f"  ⚠️ [{idx+1}] Skipped (no price) ASIN: {asin}")
                except Exception as parse_err:
                    print(f"  ❌ [{idx+1}] Parse error: {parse_err}")
            
            print(f"\n✅ Successfully parsed {len(products)} products")
            debug_info.append(f"Successfully parsed {len(products)} products")
    
    except httpx.TimeoutException:
        error_message = "Request timed out. Amazon may be slow or blocking."
        print(f"⏰ {error_message}")
        debug_info.append(error_message)
    
    except Exception as e:
        full_traceback = traceback.format_exc()
        error_message = str(e)
        
        print(f"\n{'='*60}")
        print("🚨 SCRAPING ERROR - FULL TRACEBACK:")
        print(f"{'='*60}")
        print(full_traceback)
        print(f"{'='*60}\n")
        
        debug_info.append(f"ERROR: {e}")
        debug_info.append(f"TRACEBACK:\n{full_traceback}")
    
    return {
        'products': products,
        'error': error_message,
        'debug_info': '\n'.join(debug_info),
    }

def parse_search_result_item(item, index: int = 0, domain: str = DEFAULT_DOMAIN) -> Optional[Dict]:
    """Parse a single search result item."""
    asin = item.get('data-asin')
    if not asin:
        return None
    
    # Build base URL from domain
    base_url = f"https://www.{domain}"
    
    # Title
    title = try_selectors(item, TITLE_SELECTORS)
    if not title:
        return None
    
    # Price
    price_text = try_selectors(item, PRICE_SELECTORS)
    price = parse_price(price_text) if price_text else None
    if not price:
        return None
    
    # Original price
    original_text = try_selectors(item, ORIGINAL_PRICE_SELECTORS)
    original_price = parse_price(original_text) if original_text else price
    
    # URL
    link_elem = item.select_one('h2 a')
    href = link_elem.get('href', '') if link_elem else ''
    if href.startswith('/'):
        url = f"{base_url}{href}"
    elif href:
        url = href
    else:
        url = f"{base_url}/dp/{asin}"
    
    # Image
    img_elem = item.select_one('img.s-image')
    image = img_elem.get('src') if img_elem else None
    
    # Rating
    rating = None
    rating_elem = item.select_one('.a-icon-star-small .a-icon-alt, .a-icon-star .a-icon-alt')
    if rating_elem:
        rating_text = rating_elem.get_text()
        rating_match = re.search(r'(\d+(?:\.\d+)?)', rating_text)
        if rating_match:
            rating = float(rating_match.group(1))
    
    # Review count
    review_count = None
    review_elem = item.select_one('a[href*="customerReviews"] span')
    if review_elem:
        review_text = review_elem.get_text(strip=True)
        if any(c.isdigit() for c in review_text):
            parsed = parse_price(review_text)
            if parsed:
                review_count = int(parsed)
    
    # Prime
    is_prime = bool(item.select_one('.a-icon-prime, .s-prime'))
    
    return {
        'id': f"{asin}-{int(time.time() * 1000)}",
        'asin': asin,
        'title': title[:200],
        'price': price,
        'original_price': original_price,
        'image': image,
        'url': url,
        'seller': "Amazon",
        'rating': rating,
        'review_count': review_count,
        'is_prime': is_prime,
        'in_stock': True,
    }

async def scrape_product_price(url: str) -> Optional[float]:
    """Scrape single product page for current price."""
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=REQUEST_TIMEOUT) as client:
            response = await client.get(url, headers=get_headers())
            
            if response.status_code != 200:
                return None
            
            soup = BeautifulSoup(response.text, 'lxml')
            
            price_selectors = [
                '#corePrice_feature_div .a-offscreen',
                '#corePriceDisplay_desktop_feature_div .a-offscreen',
                '#priceblock_ourprice',
                '#priceblock_dealprice',
                '.a-price .a-offscreen',
            ]
            
            for selector in price_selectors:
                elem = soup.select_one(selector)
                if elem:
                    price = parse_price(elem.get_text(strip=True))
                    if price:
                        return price
            
            return None
    
    except Exception as e:
        print(f"❌ Product price error: {e}")
        return None

# ============================================================================
# 📅 Background Price Monitoring
# ============================================================================

async def check_tracked_products():
    """Background task to check prices."""
    if not tracked_products:
        return
    
    print(f"\n[{datetime.now()}] Checking {len(tracked_products)} tracked products...")
    
    for product_id, product in list(tracked_products.items()):
        try:
            current_price = await scrape_product_price(product['url'])
            
            if current_price is None:
                print(f"⚠️ Could not get price for {product['title'][:50]}")
                continue
            
            product['last_checked'] = datetime.now().isoformat()
            product['last_price'] = current_price
            save_tracked_product(product)  # Persist update
            
            currency = get_currency_for_product(product)
            
            if current_price <= product['target_price']:
                print(f"🎯 PRICE ALERT: {product['title'][:50]} - {currency}{current_price}")
                
                if product.get('discord_webhook'):
                    await send_discord_alert(product, current_price)
                
                del tracked_products[product_id]
                delete_tracked_product(product_id)  # Remove from DB
            else:
                print(f"💰 {currency}{current_price} > {currency}{product['target_price']}")
            
        except Exception as e:
            print(f"❌ Error: {e}")

async def send_discord_alert(product: Dict, current_price: float):
    """Send Discord webhook notification."""
    try:
        webhook = DiscordWebhook(url=product['discord_webhook'])
        currency = get_currency_for_product(product)
        
        embed = DiscordEmbed(
            title="🎯 Price Target Hit!",
            description=product['title'][:200],
            color=0x3B82F6,
        )
        embed.add_embed_field(name="Current Price", value=f"{currency}{current_price:.2f}", inline=True)
        embed.add_embed_field(name="Target Price", value=f"{currency}{product['target_price']:.2f}", inline=True)
        embed.add_embed_field(name="Link", value=f"[Amazon]({product['url']})", inline=False)
        
        if product.get('image'):
            embed.set_thumbnail(url=product['image'])
        
        embed.set_footer(text="Zoner")
        embed.set_timestamp()
        
        webhook.add_embed(embed)
        webhook.execute()
        
        logger.info("Discord alert sent successfully")
    except Exception as e:
        logger.error(f"Discord webhook failed: {e}")

# ============================================================================
# 🚀 FastAPI Application
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    global scheduler
    
    logger.info("=" * 50)
    logger.info("🚀 Zoner Backend v4.2.0 (HTTP Mode + SQLite)")
    logger.info("📦 No browser required - uses httpx")
    logger.info("💾 Persistent storage with SQLite")
    logger.info("🔒 Rate limiting enabled")
    logger.info("=" * 50)
    
    # Initialize database and load tracked products
    init_database()
    load_tracked_products()
    
    scheduler = AsyncIOScheduler()
    scheduler.add_job(check_tracked_products, 'interval', minutes=5, id='price_checker')
    scheduler.start()
    logger.info("Background scheduler started (5-min intervals)")
    
    yield
    
    logger.info("Shutting down...")
    if scheduler:
        scheduler.shutdown()

# Rate limiter configuration
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Zoner Backend",
    description="HTTP-Based Amazon Scraper with Rate Limiting",
    version="4.2.0",
    lifespan=lifespan,
)

# Add rate limit exceeded handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS != ["*"] else ["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# ============================================================================
# 🔌 API Endpoints
# ============================================================================

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="ok",
        tracked_count=len(tracked_products),
        scheduler_running=scheduler.running if scheduler else False,
    )

@app.get("/search", response_model=SearchResponse)
@limiter.limit("10/minute")  # Rate limit: 10 searches per minute per IP
async def search_products(
    request: Request,  # Required for rate limiter
    query: str = Query(..., min_length=2, description="Search query"),
    domain: str = Query(DEFAULT_DOMAIN, description="Amazon domain (e.g., amazon.com, amazon.com.tr)"),
):
    logger.info(f"Search request: '{query}' on {domain}")
    start_time = time.time()
    
    result = await scrape_search_results(query, domain)
    
    products = [Product(**p) for p in result['products']]
    scrape_time = int((time.time() - start_time) * 1000)
    
    return SearchResponse(
        success=len(products) > 0 and result['error'] is None,
        query=query,
        count=len(products),
        products=products,
        scrape_time_ms=scrape_time,
        error=result.get('error'),
        debug_info=result.get('debug_info'),
    )

@app.post("/track", response_model=TrackResponse)
@limiter.limit("20/minute")  # Rate limit: 20 track requests per minute per IP
async def track_product(request: Request, track_request: TrackRequest, background_tasks: BackgroundTasks):
    product_id = f"{track_request.asin}-{int(time.time())}"
    
    # Get currency for the domain
    domain_info = AMAZON_DOMAINS.get(track_request.domain, AMAZON_DOMAINS[DEFAULT_DOMAIN])
    currency = domain_info['currency']
    
    product_data = {
        'id': product_id,
        'url': track_request.url,
        'asin': track_request.asin,
        'title': track_request.title,
        'current_price': track_request.current_price,
        'target_price': track_request.target_price,
        'discord_webhook': track_request.discord_webhook,
        'check_interval': track_request.check_interval_minutes,
        'domain': track_request.domain,  # Store domain for currency lookup
        'added_at': datetime.now().isoformat(),
        'last_checked': None,
        'last_price': track_request.current_price,
    }
    
    tracked_products[product_id] = product_data
    save_tracked_product(product_data)  # Persist to SQLite
    logger.info(f"Tracking new product: {track_request.asin} at {currency}{track_request.target_price}")
    
    return TrackResponse(
        success=True,
        message=f"Tracking {track_request.asin}. Alert when <= {currency}{track_request.target_price:.2f}",
        product_id=product_id,
    )

@app.get("/tracked")
async def get_tracked_products():
    return {
        "count": len(tracked_products),
        "products": list(tracked_products.values()),
    }

@app.delete("/tracked/{product_id}")
async def remove_tracked_product(product_id: str):
    if product_id in tracked_products:
        del tracked_products[product_id]
        return {"success": True}
    raise HTTPException(status_code=404, detail="Not found")

@app.get("/debug/last-html")
async def get_debug_html():
    if DEBUG_HTML_PATH.exists():
        return {
            "exists": True,
            "path": str(DEBUG_HTML_PATH),
            "size_bytes": DEBUG_HTML_PATH.stat().st_size,
        }
    return {"exists": False}

# ============================================================================
# 🏃 Main
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
