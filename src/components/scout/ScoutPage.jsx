import React, { useState, useCallback } from 'react';
import { Search, Loader2, TrendingDown, DollarSign, Package, X, Settings } from 'lucide-react';
import { useAmazonSearch } from '../../hooks/useAmazonSearch';
import { Header } from '../layout/Header';
import SearchResultsTable from './SearchResultsTable';
import TrackItemModal from './TrackItemModal';
import BulkActionBar from './BulkActionBar';
import { SkeletonTable } from './SkeletonRow';
import { useApp } from '../../context/AppContext';

/**
 * Scout Page - Self-Hosted Amazon Product Search
 * Backend status shown in header bar, errors redirect to Settings
 */
export function ScoutPage() {
  const {
    results,
    isLoading,
    error,
    searchQuery,
    hasSearched,
    sortBy,
    stats,
    backendStatus,
    search,
    clearSearch,
    setSortBy,
  } = useAmazonSearch();

  const { setCurrentPage } = useApp();

  const [inputValue, setInputValue] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkProducts, setBulkProducts] = useState([]);
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState(new Set());

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      search(inputValue.trim());
      setSelectedIds(new Set());
    }
  };

  const handleTrackProduct = (product) => {
    setBulkProducts([]);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setBulkProducts([]);
    if (bulkProducts.length > 0) {
      setSelectedIds(new Set());
    }
  };

  // Selection handlers
  const handleSelectProduct = useCallback((id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      setSelectedIds(new Set(results.map((p) => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  }, [results]);

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleBulkTrack = useCallback(() => {
    const selectedProducts = results.filter((p) => selectedIds.has(p.id));
    if (selectedProducts.length > 0) {
      setBulkProducts(selectedProducts);
      setSelectedProduct(selectedProducts[0]);
      setIsModalOpen(true);
    }
  }, [results, selectedIds]);

  const goToSettings = () => {
    setCurrentPage('settings');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header
        title="Product Scout"
        subtitle="Search Amazon in real-time via self-hosted scraper"
        backendStatus={backendStatus}
      />

      <main className="flex-1 overflow-auto pb-20">
        <div className="p-8 space-y-6">
          {/* Backend Offline - Compact Message */}
          {backendStatus.checked && !backendStatus.running && (
            <div className="rounded-lg border p-4 bg-red-500/10 border-red-500/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-sm">
                  Python backend is not running. Search disabled.
                </span>
              </div>
              <button
                onClick={goToSettings}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium bg-[#374151] hover:bg-[#4B5563] text-white transition-colors"
              >
                <Settings className="w-3 h-3" />
                View Setup Guide
              </button>
            </div>
          )}

          {/* Search Section */}
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search Amazon products (e.g., 'Samsung 990 PRO', 'RTX 4060 Ti')"
                  className="w-full pl-12 pr-12 py-3 h-12 rounded-lg border bg-[#1E2126] border-[#374151] text-white placeholder:text-[#6B7280] text-base focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                  disabled={!backendStatus.running}
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputValue('');
                      clearSearch();
                      setSelectedIds(new Set());
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading || !backendStatus.running}
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg text-base font-medium bg-[#FF9900] hover:bg-[#FF9900]/90 text-white shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Search Amazon
                  </>
                )}
              </button>
            </form>

            {/* Loading notice */}
            {isLoading && (
              <p className="text-sm text-[#9CA3AF] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Launching headless browser and scraping Amazon... This may take 3-8 seconds.
              </p>
            )}

            {/* Quick search suggestions */}
            {!hasSearched && backendStatus.running && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#6B7280]">Try:</span>
                {['Samsung SSD', 'RTX 4060', 'Sony WH-1000XM5', 'AirPods Pro', 'Gaming Monitor'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInputValue(suggestion);
                      search(suggestion);
                    }}
                    className="px-3 py-1 rounded-full bg-[#1E2126] border border-[#374151] text-[#9CA3AF] hover:text-white hover:border-[#FF9900] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Scraping Error */}
          {error && hasSearched && (
            <div className="rounded-lg border p-4 bg-[#FF9900]/10 border-[#FF9900]/50">
              <p className="text-sm text-[#FF9900]">
                {error.message || 'Scraping failed. Amazon may have blocked the request. Try again or use VPN.'}
              </p>
            </div>
          )}

          {/* Stats Bar */}
          {hasSearched && !isLoading && !error && results.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#1E2126] rounded-lg border border-[#374151] p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#5865F2]/20 rounded flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#5865F2]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Results Found</p>
                    <p className="text-xl font-bold text-white font-mono">{stats.count}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1E2126] rounded-lg border border-[#374151] p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#3B82F6]/20 rounded flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Lowest Price</p>
                    <p className="text-xl font-bold text-[#3B82F6] font-mono">${stats.lowest.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1E2126] rounded-lg border border-[#374151] p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF9900]/20 rounded flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[#FF9900]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Average Price</p>
                    <p className="text-xl font-bold text-[#FF9900] font-mono">${stats.average.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1E2126] rounded-lg border border-[#374151] p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF]">Highest Price</p>
                    <p className="text-xl font-bold text-red-400 font-mono">${stats.highest.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State - Skeleton */}
          {isLoading && (
            <SkeletonTable rows={8} />
          )}

          {/* Results Table */}
          {hasSearched && !isLoading && !error && results.length > 0 && (
            <SearchResultsTable
              results={results}
              isLoading={false}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onTrackProduct={handleTrackProduct}
              searchQuery={searchQuery}
              selectedIds={selectedIds}
              onSelectProduct={handleSelectProduct}
              onSelectAll={handleSelectAll}
            />
          )}

          {/* No Results */}
          {hasSearched && !isLoading && !error && results.length === 0 && (
            <div className="bg-[#1E2126] rounded-lg border border-[#374151] p-16 text-center">
              <Search className="w-12 h-12 mx-auto text-[#374151] mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No products found</h3>
              <p className="text-[#9CA3AF]">
                No results for "{searchQuery}". Amazon may have blocked the request or try a different term.
              </p>
            </div>
          )}

          {/* Empty state */}
          {!hasSearched && backendStatus.running && (
            <div className="bg-[#1E2126] rounded-lg border border-[#374151] p-16 text-center">
              <Search className="w-16 h-16 mx-auto text-[#374151] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Start Your Hunt</h3>
              <p className="text-[#9CA3AF] max-w-md mx-auto">
                Search for any product on Amazon. The self-hosted scraper will fetch real-time prices directly from Amazon—no rate limits, no API keys required.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        onTrackAll={handleBulkTrack}
        onClearSelection={handleClearSelection}
      />

      {/* Track Item Modal */}
      {isModalOpen && selectedProduct && (
        <TrackItemModal
          product={selectedProduct}
          bulkProducts={bulkProducts}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default ScoutPage;
