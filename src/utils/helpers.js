/**
 * Utility functions for Zoner
 */

/**
 * Parse Amazon URL or ASIN to extract ASIN
 * @param {string} input - Amazon URL or raw ASIN
 * @returns {{ asin: string, isValid: boolean }}
 */
export function parseAmazonInput(input) {
  if (!input || typeof input !== 'string') {
    return { asin: '', isValid: false };
  }

  const trimmed = input.trim();

  // Check if it's already an ASIN (10 alphanumeric characters)
  const asinPattern = /^[A-Z0-9]{10}$/i;
  if (asinPattern.test(trimmed)) {
    return { asin: trimmed.toUpperCase(), isValid: true };
  }

  // Try to extract ASIN from Amazon URL patterns
  const urlPatterns = [
    /amazon\.[a-z.]+\/dp\/([A-Z0-9]{10})/i,
    /amazon\.[a-z.]+\/gp\/product\/([A-Z0-9]{10})/i,
    /amazon\.[a-z.]+\/[^/]+\/dp\/([A-Z0-9]{10})/i,
    /amzn\.[a-z]+\/[a-z0-9]+/i, // Short URL - can't extract ASIN
    /\/dp\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
  ];

  for (const pattern of urlPatterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return { asin: match[1].toUpperCase(), isValid: true };
    }
  }

  return { asin: '', isValid: false };
}

/**
 * Format price with currency symbol
 * @param {number} price
 * @param {string} currency
 * @returns {string}
 */
export function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Format relative time (e.g., "2 mins ago")
 * @param {string|Date} timestamp
 * @returns {string}
 */
export function formatRelativeTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 10) return 'just now';
  if (diffSec < 60) return `${diffSec} secs ago`;
  if (diffMin === 1) return '1 min ago';
  if (diffMin < 60) return `${diffMin} mins ago`;
  if (diffHour === 1) return '1 hour ago';
  if (diffHour < 24) return `${diffHour} hours ago`;
  
  return date.toLocaleDateString();
}

/**
 * Format timestamp for activity log (HH:MM:SS)
 * @param {string|Date} timestamp
 * @returns {string}
 */
export function formatLogTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Generate a placeholder product for demo
 * @param {string} asin
 * @returns {object}
 */
export function generatePlaceholderProduct(asin) {
  return {
    asin,
    title: `Product ${asin}`,
    image: `https://via.placeholder.com/200x200?text=${asin}`,
    currentPrice: Math.floor(Math.random() * 100) + 20,
    originalPrice: Math.floor(Math.random() * 200) + 100,
    targetPrice: Math.floor(Math.random() * 80) + 30,
    category: 'Uncategorized',
  };
}
