import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { calculateDiscount, isDealPrice } from '../data/mockProducts';

const STORAGE_KEY = 'zoner_products';

/**
 * Products CRUD hook with localStorage persistence
 */
export function useProducts() {
  // Start with empty array for production (no mock data)
  const [products, setProducts] = useLocalStorage(STORAGE_KEY, []);

  // Add a new product
  const addProduct = useCallback((productData) => {
    const newProduct = {
      id: Date.now().toString(),
      asin: productData.asin || '',
      title: productData.title || 'New Product',
      image: productData.image || 'https://via.placeholder.com/200',
      currentPrice: productData.currentPrice || 0,
      originalPrice: productData.originalPrice || 0,
      originalPriceAtTrack: productData.originalPriceAtTrack || productData.currentPrice || 0,
      targetPrice: productData.targetPrice || 0,
      category: productData.category || 'Uncategorized',
      seller: productData.seller || 'Amazon.com',
      status: 'monitoring',
      starred: false,
      lastChecked: new Date().toISOString(),
      // v2.0: Monitoring configuration
      monitorConfig: productData.monitorConfig || {
        interval: 300000, // 5 minutes default
        targetPrice: null,
        discountThreshold: null,
        triggerLogic: 'OR',
      },
    };
    
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, [setProducts]);

  // Remove a product by ID
  const removeProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, [setProducts]);

  // Toggle starred status
  const toggleStar = useCallback((id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p))
    );
  }, [setProducts]);

  // Toggle pause/monitoring status
  const togglePause = useCallback((id) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newStatus = p.status === 'paused' ? 'monitoring' : 'paused';
        return { ...p, status: newStatus };
      })
    );
  }, [setProducts]);

  // Update product price (simulates scanner finding new price)
  const updatePrice = useCallback((id, newPrice) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const status = isDealPrice(newPrice, p.originalPrice, p.targetPrice)
          ? 'deal'
          : p.status === 'deal' && newPrice > p.targetPrice
            ? 'monitoring'
            : p.status;
        return {
          ...p,
          currentPrice: newPrice,
          status,
          lastChecked: new Date().toISOString(),
        };
      })
    );
  }, [setProducts]);

  // Update target price
  const updateTargetPrice = useCallback((id, newTargetPrice) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const status = isDealPrice(p.currentPrice, p.originalPrice, newTargetPrice)
          ? 'deal'
          : 'monitoring';
        return { ...p, targetPrice: newTargetPrice, status };
      })
    );
  }, [setProducts]);

  // Computed stats
  const stats = useMemo(() => {
    const deals = products.filter((p) => p.status === 'deal');
    const discounts = products.map((p) =>
      calculateDiscount(p.currentPrice, p.originalPrice)
    );
    const avgDiscount = discounts.length
      ? Math.round(discounts.reduce((a, b) => a + b, 0) / discounts.length)
      : 0;

    return {
      totalProducts: products.length,
      dealCount: deals.length,
      avgDiscount,
      starredCount: products.filter((p) => p.starred).length,
      monitoringCount: products.filter((p) => p.status === 'monitoring').length,
      pausedCount: products.filter((p) => p.status === 'paused').length,
    };
  }, [products]);

  // Get products sorted by status (deals first, then starred)
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      // Deals first
      if (a.status === 'deal' && b.status !== 'deal') return -1;
      if (b.status === 'deal' && a.status !== 'deal') return 1;
      // Then starred
      if (a.starred && !b.starred) return -1;
      if (b.starred && !a.starred) return 1;
      // Then by last checked (most recent first)
      return new Date(b.lastChecked) - new Date(a.lastChecked);
    });
  }, [products]);

  return {
    products,
    sortedProducts,
    stats,
    addProduct,
    removeProduct,
    toggleStar,
    togglePause,
    updatePrice,
    updateTargetPrice,
  };
}

export default useProducts;
