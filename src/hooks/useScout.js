import { useState, useCallback, useMemo } from 'react';
import { searchProducts, getSearchStats } from '../data/mockSearchResults';

/**
 * Scout module hook for product search and discovery
 */
export function useScout() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('price_asc');
  const [hasSearched, setHasSearched] = useState(false);

  // Perform search
  const search = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setSearchQuery(query);
    setHasSearched(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    const searchResults = searchProducts(query);
    setResults(searchResults);
    setIsLoading(false);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setResults([]);
    setHasSearched(false);
  }, []);

  // Sort results
  const sortedResults = useMemo(() => {
    const sorted = [...results];

    switch (sortBy) {
      case 'price_asc':
        return sorted.sort((a, b) => a.currentPrice - b.currentPrice);
      case 'price_desc':
        return sorted.sort((a, b) => b.currentPrice - a.currentPrice);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'seller':
        return sorted.sort((a, b) => a.seller.localeCompare(b.seller));
      default:
        return sorted;
    }
  }, [results, sortBy]);

  // Get stats
  const stats = useMemo(() => getSearchStats(results), [results]);

  return {
    searchQuery,
    results: sortedResults,
    stats,
    isLoading,
    hasSearched,
    sortBy,
    setSortBy,
    search,
    clearSearch,
  };
}

export default useScout;
