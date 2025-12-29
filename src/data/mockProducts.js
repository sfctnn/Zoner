/**
 * Mock product data for Zoner demo
 * Simulates Amazon products with pricing data
 */

export const mockProducts = [
  {
    id: '1',
    asin: 'B09JQMJHXY',
    title: 'Logitech MX Master 3S Wireless Mouse',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop',
    currentPrice: 24.99,
    originalPrice: 99.99,
    targetPrice: 50.00,
    category: 'Electronics',
    status: 'deal',
    starred: true,
    lastChecked: new Date().toISOString(),
  },
  {
    id: '2',
    asin: 'B0BSHF7WHW',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=200&fit=crop',
    currentPrice: 149.99,
    originalPrice: 399.99,
    targetPrice: 200.00,
    category: 'Electronics',
    status: 'deal',
    starred: true,
    lastChecked: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: '3',
    asin: 'B0C1H26C46',
    title: 'Samsung 65" QLED 4K Smart TV',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop',
    currentPrice: 497.99,
    originalPrice: 1299.99,
    targetPrice: 600.00,
    category: 'Electronics',
    status: 'deal',
    starred: false,
    lastChecked: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: '4',
    asin: 'B0BDJ6ZJSL',
    title: 'Ninja Air Fryer Pro 4-in-1',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=200&h=200&fit=crop',
    currentPrice: 59.99,
    originalPrice: 119.99,
    targetPrice: 70.00,
    category: 'Home & Kitchen',
    status: 'monitoring',
    starred: true,
    lastChecked: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: '5',
    asin: 'B0B7CPSN2K',
    title: 'Anker PowerCore 20000mAh Power Bank',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=200&fit=crop',
    currentPrice: 39.99,
    originalPrice: 79.99,
    targetPrice: 45.00,
    category: 'Electronics',
    status: 'monitoring',
    starred: false,
    lastChecked: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: '6',
    asin: 'B09HXQD3N8',
    title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    image: 'https://images.unsplash.com/photo-1544233726-9f1d0cc32a98?w=200&h=200&fit=crop',
    currentPrice: 79.99,
    originalPrice: 139.99,
    targetPrice: 75.00,
    category: 'Home & Kitchen',
    status: 'monitoring',
    starred: false,
    lastChecked: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: '7',
    asin: 'B0CHWRXH8B',
    title: 'Bose QuietComfort Earbuds II',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop',
    currentPrice: 199.99,
    originalPrice: 299.99,
    targetPrice: 180.00,
    category: 'Electronics',
    status: 'monitoring',
    starred: false,
    lastChecked: new Date(Date.now() - 720000).toISOString(),
  },
  {
    id: '8',
    asin: 'B0BKYZ7LYL',
    title: 'Mechanical Gaming Keyboard RGB Backlit',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=200&h=200&fit=crop',
    currentPrice: 129.99,
    originalPrice: 179.99,
    targetPrice: 120.00,
    category: 'Gaming',
    status: 'paused',
    starred: false,
    lastChecked: new Date(Date.now() - 480000).toISOString(),
  },
  {
    id: '9',
    asin: 'B09G9FPHY6',
    title: 'Apple AirPods Pro (2nd Generation)',
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=200&h=200&fit=crop',
    currentPrice: 189.99,
    originalPrice: 249.99,
    targetPrice: 180.00,
    category: 'Electronics',
    status: 'monitoring',
    starred: false,
    lastChecked: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: '10',
    asin: 'B08N5WRWNW',
    title: 'PlayStation 5 Console',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=200&h=200&fit=crop',
    currentPrice: 399.99,
    originalPrice: 499.99,
    targetPrice: 450.00,
    category: 'Gaming',
    status: 'monitoring',
    starred: false,
    lastChecked: new Date(Date.now() - 600000).toISOString(),
  },
];

export const mockActivityLog = [
  {
    id: '1',
    type: 'deal',
    message: 'Price drop detected: Logitech MX Master 3S - 75% off',
    timestamp: new Date(Date.now() - 27000).toISOString(),
  },
  {
    id: '2',
    type: 'webhook',
    message: 'Notification sent to "Main Alerts"',
    timestamp: new Date(Date.now() - 32000).toISOString(),
  },
  {
    id: '3',
    type: 'deal',
    message: 'Price drop detected: Sony WH-1000XM5 - 62% off',
    timestamp: new Date(Date.now() - 63000).toISOString(),
  },
  {
    id: '4',
    type: 'webhook',
    message: 'Notification sent to "Main Alerts"',
    timestamp: new Date(Date.now() - 68000).toISOString(),
  },
  {
    id: '5',
    type: 'price_drop',
    message: 'Price drop detected: Apple AirPods Pro - 24% off',
    timestamp: new Date(Date.now() - 123000).toISOString(),
  },
  {
    id: '6',
    type: 'tracker_start',
    message: 'Price tracker started - monitoring 10 products',
    timestamp: new Date(Date.now() - 423000).toISOString(),
  },
  {
    id: '7',
    type: 'price_drop',
    message: 'Price drop detected: PlayStation 5 - 20% off',
    timestamp: new Date(Date.now() - 723000).toISOString(),
  },
  {
    id: '8',
    type: 'webhook',
    message: 'Notification sent to "Gaming Deals Only"',
    timestamp: new Date(Date.now() - 923000).toISOString(),
  },
];

/**
 * Generate Amazon URL from ASIN
 */
export function getAmazonUrl(asin) {
  return `https://www.amazon.com/dp/${asin}`;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(currentPrice, originalPrice) {
  if (!originalPrice || originalPrice <= 0) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Check if price qualifies as a "deal" (>50% off and below target)
 */
export function isDealPrice(currentPrice, originalPrice, targetPrice) {
  const discount = calculateDiscount(currentPrice, originalPrice);
  return discount >= 50 && currentPrice <= targetPrice;
}
