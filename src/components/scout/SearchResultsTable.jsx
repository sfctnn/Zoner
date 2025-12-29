import React from 'react';
import { ArrowUpDown, Loader2, Search } from 'lucide-react';
import ProductRow from './ProductRow';

const sortOptions = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rating' },
  { value: 'reviews', label: 'Most Reviews' },
  { value: 'seller', label: 'Seller A-Z' },
];

export function SearchResultsTable({
  results,
  isLoading,
  sortBy,
  onSortChange,
  onTrackProduct,
  searchQuery,
  selectedIds,
  onSelectProduct,
  onSelectAll,
}) {
  const allSelected = results.length > 0 && selectedIds.size === results.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < results.length;

  if (isLoading) {
    return (
      <div className="bg-[#1E2126] rounded-lg border border-[#374151] p-16 text-center">
        <Loader2 className="w-12 h-12 mx-auto text-[#FF9900] animate-spin mb-4" />
        <p className="text-[#9CA3AF]">Searching Amazon for "{searchQuery}"...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-[#1E2126] rounded-lg border border-[#374151] p-16 text-center">
        <Search className="w-12 h-12 mx-auto text-[#374151] mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
        <p className="text-[#9CA3AF]">
          Try a different search term or check your spelling
        </p>
      </div>
    );
  }

  // Find lowest price index
  const lowestPriceIndex = results.reduce((minIdx, product, idx, arr) => 
    product.currentPrice < arr[minIdx].currentPrice ? idx : minIdx, 0);

  return (
    <div className="bg-[#1E2126] rounded-lg border border-[#374151] overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#374151] bg-[#0F1115]">
        <div className="flex items-center gap-4">
          <span className="text-sm text-white font-medium">
            {results.length} listings found
          </span>
          {selectedIds.size > 0 && (
            <span className="text-sm text-[#5865F2]">
              ({selectedIds.size} selected)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-[#9CA3AF]" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[#1E2126] border border-[#374151] rounded px-2 py-1 text-sm text-white cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[40px_2fr_100px_120px_120px] gap-4 items-center py-2 px-4 border-b border-[#374151] bg-[#0F1115]/50">
        {/* Select All */}
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => el && (el.indeterminate = someSelected)}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-4 h-4 rounded border-[#374151] bg-[#0F1115] text-[#5865F2] focus:ring-[#5865F2] focus:ring-offset-0 cursor-pointer"
          />
        </div>
        <div className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">Product</div>
        <div className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">Seller</div>
        <div className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">Price</div>
        <div className="text-xs font-medium text-[#6B7280] uppercase tracking-wide text-right">Actions</div>
      </div>

      {/* Results */}
      <div className="divide-y divide-[#374151]">
        {results.map((product, idx) => (
          <ProductRow
            key={product.id}
            product={product}
            isSelected={selectedIds.has(product.id)}
            onSelect={onSelectProduct}
            onTrack={onTrackProduct}
            isLowestPrice={idx === lowestPriceIndex}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchResultsTable;
