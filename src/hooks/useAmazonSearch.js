import { useState, useCallback, useEffect } from 'react';
import { searchProducts, checkBackendHealth, BackendApiError } from '../services/amazonApi';

/**
 * React hook for Amazon product search using self-hosted backend
 * Connects to Python FastAPI server at localhost:8000
 */
export function useAmazonSearch() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState('price_asc');
  
  // Backend status
  const [backendStatus, setBackendStatus] = useState({
    checked: false,
    running: false,
    error: null,
  });

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const status = await checkBackendHealth();
      setBackendStatus({
        checked: true,
        running: status.running,
        error: status.error || null,
        trackedCount: status.trackedCount || 0,
      });
    };
    checkHealth();
    
    // Re-check every 10 seconds if not running
    const interval = setInterval(async () => {
      if (!backendStatus.running) {
        const status = await checkBackendHealth();
        setBackendStatus({
          checked: true,
          running: status.running,
          error: status.error || null,
          trackedCount: status.trackedCount || 0,
        });
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  /**
   * Perform product search via Python backend
   */
  const search = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setError({ message: 'Search query must be at least 2 characters', code: 'INVALID_QUERY' });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchQuery(query);
    setHasSearched(true);

    try {
      const products = await searchProducts(query);
      setResults(products);
      
      // Update backend status on successful search
      setBackendStatus(prev => ({ ...prev, running: true, error: null }));
    } catch (err) {
      console.error('Backend API Error:', err);
      
      if (err instanceof BackendApiError) {
        setError({
          message: err.message,
          code: err.code,
          details: err.details,
        });
        
        // Update backend status if offline
        if (err.code === 'BACKEND_OFFLINE') {
          setBackendStatus(prev => ({ ...prev, running: false, error: err.message }));
        }
      } else {
        setError({
          message: `Unexpected error: ${err.message}`,
          code: 'UNKNOWN',
        });
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear search results
   */
  const clearSearch = useCallback(() => {
    setResults([]);
    setSearchQuery('');
    setHasSearched(false);
    setError(null);
  }, []);

  /**
   * Sort results by various criteria
   */
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.currentPrice - b.currentPrice;
      case 'price_desc':
        return b.currentPrice - a.currentPrice;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'reviews':
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      default:
        return 0;
    }
  });

  /**
   * Calculate stats from results
   */
  const stats = {
    count: results.length,
    lowest: results.length > 0 ? Math.min(...results.map((r) => r.currentPrice)) : 0,
    highest: results.length > 0 ? Math.max(...results.map((r) => r.currentPrice)) : 0,
    average: results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.currentPrice, 0) / results.length * 100) / 100
      : 0,
  };

  return {
    // State
    results: sortedResults,
    rawResults: results,
    isLoading,
    error,
    searchQuery,
    hasSearched,
    sortBy,
    stats,
    
    // Backend status
    backendStatus,
    apiConfigured: backendStatus.running,
    apiStatus: {
      configured: backendStatus.running,
      message: backendStatus.running 
        ? 'Connected to Python backend' 
        : backendStatus.error || 'Backend not running',
    },
    
    // Actions
    search,
    clearSearch,
    setSortBy,
  };
}

export default useAmazonSearch;
