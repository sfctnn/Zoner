/**
 * Mock Amazon search results generator
 * Simulates Amazon product search API response
 */

// Base products that can be searched
const productDatabase = [
  // Samsung SSDs
  {
    brand: 'Samsung',
    category: 'SSD',
    keywords: ['samsung', 'ssd', '990', 'pro', 'nvme', 'storage'],
    variants: [
      { suffix: '990 PRO 1TB NVMe SSD', basePrice: 109.99, asin: 'B0BHJJ9Y77' },
      { suffix: '990 PRO 2TB NVMe SSD', basePrice: 179.99, asin: 'B0BHJF2VRN' },
      { suffix: '980 PRO 1TB NVMe SSD', basePrice: 89.99, asin: 'B08GLX7TNT' },
      { suffix: '980 PRO 2TB NVMe SSD', basePrice: 149.99, asin: 'B08RK2SR23' },
      { suffix: '970 EVO Plus 1TB NVMe SSD', basePrice: 69.99, asin: 'B07MFZY2F2' },
    ],
  },
  // NVIDIA GPUs
  {
    brand: 'NVIDIA',
    category: 'GPU',
    keywords: ['rtx', 'nvidia', 'gpu', 'graphics', 'card', '4060', '4070', '4080', '4090'],
    variants: [
      { suffix: 'GeForce RTX 4060 Ti 8GB', basePrice: 399.99, asin: 'B0C7KZZK93' },
      { suffix: 'GeForce RTX 4060 8GB', basePrice: 299.99, asin: 'B0C7KZPQ3S' },
      { suffix: 'GeForce RTX 4070 12GB', basePrice: 549.99, asin: 'B0BTJ5JNXM' },
      { suffix: 'GeForce RTX 4070 Ti SUPER', basePrice: 799.99, asin: 'B0CTK23N5R' },
      { suffix: 'GeForce RTX 4080 SUPER 16GB', basePrice: 999.99, asin: 'B0CTK4KXRL' },
    ],
  },
  // Sony Headphones
  {
    brand: 'Sony',
    category: 'Headphones',
    keywords: ['sony', 'headphones', 'wh', '1000xm', 'wireless', 'noise', 'canceling'],
    variants: [
      { suffix: 'WH-1000XM5 Wireless', basePrice: 348.00, asin: 'B0BSHF7WHW' },
      { suffix: 'WH-1000XM4 Wireless', basePrice: 248.00, asin: 'B0863FR3S9' },
      { suffix: 'WH-CH720N Wireless', basePrice: 98.00, asin: 'B0BQ5R5P3G' },
    ],
  },
  // Apple Products
  {
    brand: 'Apple',
    category: 'Audio',
    keywords: ['apple', 'airpods', 'pro', 'max', 'wireless', 'earbuds'],
    variants: [
      { suffix: 'AirPods Pro (2nd Gen) USB-C', basePrice: 249.00, asin: 'B0D1XD1ZV3' },
      { suffix: 'AirPods (3rd Gen)', basePrice: 169.00, asin: 'B09JQL3NWT' },
      { suffix: 'AirPods Max', basePrice: 449.00, asin: 'B08PZHYWJS' },
    ],
  },
  // Gaming Peripherals
  {
    brand: 'Logitech',
    category: 'Gaming',
    keywords: ['logitech', 'mouse', 'keyboard', 'gaming', 'g502', 'g pro', 'mx'],
    variants: [
      { suffix: 'G502 X PLUS Wireless', basePrice: 159.99, asin: 'B0B8KQVHS7' },
      { suffix: 'G Pro X SUPERLIGHT 2', basePrice: 159.00, asin: 'B0CKJ52YR7' },
      { suffix: 'MX Master 3S Wireless', basePrice: 99.99, asin: 'B09JQMJHXY' },
      { suffix: 'G915 TKL Wireless Keyboard', basePrice: 229.99, asin: 'B085RLZ1C4' },
    ],
  },
];

// Seller names for variety
const sellers = [
  { name: 'Amazon.com', isPrime: true, rating: 4.8 },
  { name: 'Best Buy', isPrime: false, rating: 4.7 },
  { name: 'Newegg', isPrime: false, rating: 4.5 },
  { name: 'B&H Photo', isPrime: false, rating: 4.9 },
  { name: 'TechDeals Pro', isPrime: true, rating: 4.3 },
  { name: 'ElectroMart', isPrime: false, rating: 4.1 },
  { name: 'CompuZone', isPrime: true, rating: 4.6 },
];

/**
 * Generate random price variation
 */
function varyPrice(basePrice, variationPercent = 15) {
  const variation = (Math.random() * variationPercent * 2 - variationPercent) / 100;
  return Math.round(basePrice * (1 + variation) * 100) / 100;
}

/**
 * Generate random product image URL
 */
function getProductImage(category) {
  const images = {
    SSD: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=200&h=200&fit=crop',
    GPU: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=200&h=200&fit=crop',
    Headphones: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=200&fit=crop',
    Audio: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=200&h=200&fit=crop',
    Gaming: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop',
  };
  return images[category] || 'https://via.placeholder.com/200';
}

/**
 * Search products by keyword
 * @param {string} query - Search query
 * @returns {Array} - Array of matching products with seller variations
 */
export function searchProducts(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/);
  const results = [];

  // Find matching products
  productDatabase.forEach((product) => {
    const matchScore = queryWords.reduce((score, word) => {
      const wordMatches = product.keywords.some((kw) => kw.includes(word));
      return score + (wordMatches ? 1 : 0);
    }, 0);

    if (matchScore > 0) {
      // Add variants with seller variations
      product.variants.forEach((variant) => {
        // Check if variant matches query more specifically
        const titleMatch = variant.suffix.toLowerCase().includes(normalizedQuery) ||
          queryWords.some((w) => variant.suffix.toLowerCase().includes(w));

        if (titleMatch || matchScore >= queryWords.length / 2) {
          // Create 2-4 seller listings for each product
          const numSellers = Math.floor(Math.random() * 3) + 2;
          const shuffledSellers = [...sellers].sort(() => Math.random() - 0.5).slice(0, numSellers);

          shuffledSellers.forEach((seller, idx) => {
            const price = varyPrice(variant.basePrice, idx === 0 ? 5 : 20);
            const reviewCount = Math.floor(Math.random() * 5000) + 100;
            const rating = (Math.random() * 1.5 + 3.5).toFixed(1);

            results.push({
              id: `${variant.asin}-${seller.name.replace(/\s+/g, '')}`,
              asin: variant.asin,
              title: `${product.brand} ${variant.suffix}`,
              image: getProductImage(product.category),
              currentPrice: price,
              originalPrice: variant.basePrice * 1.2, // MSRP markup
              seller: seller.name,
              sellerRating: seller.rating,
              isPrime: seller.isPrime,
              rating: parseFloat(rating),
              reviewCount,
              category: product.category,
              inStock: Math.random() > 0.1, // 90% in stock
            });
          });
        }
      });
    }
  });

  // Sort by price ascending by default
  return results.sort((a, b) => a.currentPrice - b.currentPrice);
}

/**
 * Get search result stats
 */
export function getSearchStats(results) {
  if (!results.length) {
    return { count: 0, lowest: 0, highest: 0, average: 0 };
  }

  const prices = results.map((r) => r.currentPrice);
  return {
    count: results.length,
    lowest: Math.min(...prices),
    highest: Math.max(...prices),
    average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length * 100) / 100,
  };
}

export default { searchProducts, getSearchStats };
