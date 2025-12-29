/**
 * Zoner API Service
 * Connects to self-hosted Python FastAPI backend
 * 
 * Backend runs at: http://localhost:8000
 * Start with: cd backend && uvicorn main:app --reload
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Multi-region Amazon marketplace configuration
export const AMAZON_REGIONS = {
  'amazon.com': { name: 'USA', flag: '🇺🇸', currency: '$' },
  'amazon.com.tr': { name: 'Turkey', flag: '🇹🇷', currency: '₺' },
  'amazon.de': { name: 'Germany', flag: '🇩🇪', currency: '€' },
  'amazon.co.uk': { name: 'UK', flag: '🇬🇧', currency: '£' },
};

export const DEFAULT_REGION = 'amazon.com';
const REGION_STORAGE_KEY = 'zoner_region';

/**
 * Get the currently selected region from localStorage
 */
export function getSelectedRegion() {
  const saved = localStorage.getItem(REGION_STORAGE_KEY);
  return saved && AMAZON_REGIONS[saved] ? saved : DEFAULT_REGION;
}

/**
 * Save selected region to localStorage
 */
export function setSelectedRegion(domain) {
  if (AMAZON_REGIONS[domain]) {
    localStorage.setItem(REGION_STORAGE_KEY, domain);
    return true;
  }
  return false;
}

/**
 * Custom error class for API errors
 */
export class BackendApiError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'BackendApiError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Check if backend is running
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      return { running: false, error: 'Backend returned error' };
    }
    
    const data = await response.json();
    return {
      running: true,
      trackedCount: data.tracked_count,
      schedulerRunning: data.scheduler_running,
    };
  } catch (error) {
    return {
      running: false,
      error: 'Backend not running. Please start: cd backend && uvicorn main:app --reload',
    };
  }
}

/**
 * Search Amazon products via local backend
 * 
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of products
 */
export async function searchProducts(query) {
  if (!query || query.trim().length < 2) {
    throw new BackendApiError(
      'Search query must be at least 2 characters',
      'INVALID_QUERY'
    );
  }

  // Get current region from localStorage
  const domain = getSelectedRegion();

  try {
    const response = await fetch(
      `${API_BASE_URL}/search?query=${encodeURIComponent(query.trim())}&domain=${encodeURIComponent(domain)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new BackendApiError(
        errorData.detail || `Backend error: ${response.status}`,
        'BACKEND_ERROR',
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new BackendApiError(
        'Search failed',
        'SEARCH_FAILED',
        data
      );
    }

    // Map backend response to frontend model
    return data.products.map(mapProductResponse);

  } catch (error) {
    if (error instanceof BackendApiError) {
      throw error;
    }

    // Network error - backend not running
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new BackendApiError(
        'Backend not running. Start Python server: cd backend && uvicorn main:app --reload',
        'BACKEND_OFFLINE'
      );
    }

    throw new BackendApiError(
      `Unexpected error: ${error.message}`,
      'UNKNOWN_ERROR'
    );
  }
}

/**
 * Add product to background tracking
 */
export async function trackProduct(productData) {
  try {
    const response = await fetch(`${API_BASE_URL}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: productData.url,
        asin: productData.asin,
        title: productData.title,
        current_price: productData.currentPrice,
        target_price: productData.targetPrice,
        discord_webhook: productData.discordWebhook || null,
        check_interval_minutes: productData.checkInterval || 5,
      }),
    });

    if (!response.ok) {
      throw new BackendApiError('Failed to add tracking', 'TRACK_FAILED');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof BackendApiError) throw error;
    throw new BackendApiError(
      'Backend not running',
      'BACKEND_OFFLINE'
    );
  }
}

/**
 * Get all tracked products from backend
 */
export async function getTrackedProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/tracked`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch {
    return { count: 0, products: [] };
  }
}

/**
 * Map backend product to frontend model
 */
function mapProductResponse(product) {
  return {
    id: product.id,
    asin: product.asin,
    title: product.title,
    image: product.image,
    currentPrice: product.price,
    originalPrice: product.original_price || product.price,
    url: product.url, // REAL Amazon URL from scraping
    seller: product.seller || 'Amazon',
    isPrime: product.is_prime,
    rating: product.rating,
    reviewCount: product.review_count,
    inStock: product.in_stock,
  };
}

/**
 * Check backend status
 */
export function isBackendConfigured() {
  return true; // Backend is always "configured" - just needs to be running
}

export function getApiStatus() {
  return {
    configured: true,
    message: 'Self-hosted backend mode',
  };
}

export default {
  searchProducts,
  trackProduct,
  checkBackendHealth,
  getTrackedProducts,
  BackendApiError,
  AMAZON_REGIONS,
  getSelectedRegion,
  setSelectedRegion,
};
