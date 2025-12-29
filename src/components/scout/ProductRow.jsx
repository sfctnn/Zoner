import React, { useState, useCallback } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';

/**
 * Seller badge component with color coding
 */
function SellerBadge({ seller, isPrime }) {
  const isAmazon = seller?.toLowerCase().includes('amazon');
  const isFBA = isPrime && !isAmazon;
  
  if (isAmazon) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FF9900] text-black">
        Amazon
      </span>
    );
  }
  
  if (isFBA) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#5865F2]/30 text-[#5865F2]">
        FBA
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#374151] text-[#9CA3AF]">
      3rd Party
    </span>
  );
}

/**
 * ProductRow component for Scout search results
 * Uses REAL Amazon URLs from API response - NO fabricated links
 */
export function ProductRow({
  product,
  isSelected,
  onSelect,
  onTrack,
  isLowestPrice = false,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyAsin = useCallback(async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(product.asin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy ASIN:', err);
    }
  }, [product.asin]);

  // Use REAL URL from API response, fallback only if missing
  const amazonUrl = product.url || `https://www.amazon.com/dp/${product.asin}`;


  return (
    <div
      className={`
        grid grid-cols-[40px_2fr_100px_120px_120px] gap-4 items-center py-3 px-4 
        border-b border-[#374151] transition-all
        ${isSelected ? 'bg-[#5865F2]/10' : 'hover:bg-[#0F1115]/50'}
        ${isLowestPrice ? 'bg-[#3B82F6]/5' : ''}
      `}
    >
      {/* Checkbox */}
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(product.id, e.target.checked)}
          className="w-4 h-4 rounded border-[#374151] bg-[#0F1115] text-[#5865F2] focus:ring-[#5865F2] focus:ring-offset-0 cursor-pointer"
        />
      </div>

      {/* Product Info */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-12 h-12 object-cover rounded border border-[#374151] flex-shrink-0"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/48?text=No+Image';
          }}
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-white truncate mb-1">
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            {/* ASIN Badge with Copy */}
            <button
              onClick={handleCopyAsin}
              className="group relative inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#0F1115] hover:bg-[#374151] text-xs font-mono text-[#9CA3AF] hover:text-white transition-colors"
              title="Click to copy ASIN"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[#3B82F6]" />
                  <span className="text-[#3B82F6]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                  <span>{product.asin}</span>
                </>
              )}
            </button>
            
            {/* Prime badge */}
            {product.isPrime && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#FF9900]/20 text-[#FF9900] font-medium">
                Prime
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Seller Badge */}
      <div className="flex items-center">
        <SellerBadge seller={product.seller} isPrime={product.isPrime} />
      </div>

      {/* Price */}
      <div>
        <p className={`text-lg font-bold font-mono ${isLowestPrice ? 'text-[#3B82F6]' : 'text-[#FF9900]'}`}>
          ${product.currentPrice.toFixed(2)}
        </p>
        {isLowestPrice && (
          <span className="text-xs text-[#3B82F6] font-medium uppercase tracking-wide">
            Lowest
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        {/* Open Link */}
        <a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-8 w-8 rounded text-[#6B7280] hover:text-white hover:bg-[#374151] transition-colors"
          title="Open on Amazon"
        >
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Track Button */}
        <button
          onClick={() => onTrack(product)}
          disabled={!product.inStock}
          className="inline-flex items-center justify-center h-8 px-4 rounded text-xs font-medium bg-[#5865F2] hover:bg-[#5865F2]/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Track
        </button>
      </div>
    </div>
  );
}

export default ProductRow;
