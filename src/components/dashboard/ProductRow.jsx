import React from 'react';
import { Star, ExternalLink, Trash2, Clock, Pause, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateDiscount, getAmazonUrl } from '../../data/mockProducts';
import { formatRelativeTime } from '../../utils/helpers';

export function ProductRow({ product }) {
  const { toggleStar, togglePause, removeProduct } = useApp();
  
  const discount = calculateDiscount(product.currentPrice, product.originalPrice);
  const isGlitch = product.status === 'glitch';
  const isPaused = product.status === 'paused';

  const getStatusBadge = () => {
    switch (product.status) {
      case 'glitch':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-[#3B82F6]/20 text-[#3B82F6]">
            Glitch Detected!
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-[#9CA3AF]/20 text-[#9CA3AF]">
            Paused
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-[#5865F2]/20 text-[#5865F2]">
            Monitoring
          </span>
        );
    }
  };

  const getDiscountBadge = () => {
    const color = discount >= 50 ? '#3B82F6' : '#FF9900';
    return (
      <span 
        className="text-xs font-semibold px-2 py-0.5 rounded"
        style={{ 
          backgroundColor: `${color}20`,
          color: color
        }}
      >
        -{discount}%
      </span>
    );
  };

  return (
    <div 
      className={`
        grid grid-cols-[60px_2fr_1fr_120px_120px_100px] gap-4 items-center py-3 px-4 
        border-b border-[#374151] hover:bg-[#1E2126]/50 transition-all
        ${isGlitch ? 'glitch-row' : ''}
      `}
    >
      {/* Image */}
      <img
        src={product.image}
        alt={product.title}
        className="w-12 h-12 object-cover rounded border border-[#374151]"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/48?text=No+Image';
        }}
      />

      {/* Product Info */}
      <div className="min-w-0">
        <h3 className="text-sm font-medium text-white truncate mb-1">
          {product.title}
        </h3>
        <div className="flex items-center gap-3">
          <p className="text-xs text-[#9CA3AF] font-mono">
            {product.asin}
          </p>
          <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(product.lastChecked)}</span>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-[#FF9900] font-mono">
            ${product.currentPrice.toFixed(2)}
          </span>
          {getDiscountBadge()}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9CA3AF]">Target:</span>
          <span className="text-xs text-white font-mono">
            ${product.targetPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Status */}
      <div>{getStatusBadge()}</div>

      {/* Category */}
      <div>
        <span className="text-xs text-[#9CA3AF] px-2 py-1 bg-[#0F1115] rounded">
          {product.category}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1">
        {/* Star */}
        <button
          onClick={() => toggleStar(product.id)}
          className={`
            inline-flex items-center justify-center rounded-md text-xs h-8 w-8 p-0 
            transition-all hover:bg-accent
            ${product.starred ? 'text-yellow-500 hover:text-yellow-600' : 'text-[#9CA3AF] hover:text-yellow-500'}
          `}
          title={product.starred ? 'Unstar' : 'Star'}
        >
          <Star className={`w-4 h-4 ${product.starred ? 'fill-current' : ''}`} />
        </button>

        {/* Pause/Resume */}
        <button
          onClick={() => togglePause(product.id)}
          className="inline-flex items-center justify-center rounded-md text-xs h-8 w-8 p-0 text-[#9CA3AF] hover:text-[#5865F2] transition-all hover:bg-accent"
          title={isPaused ? 'Resume monitoring' : 'Pause monitoring'}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Open Amazon */}
        <a
          href={getAmazonUrl(product.asin)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md text-xs h-8 w-8 p-0 text-[#9CA3AF] hover:text-[#FF9900] transition-all hover:bg-accent"
          title="Open on Amazon"
        >
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Delete */}
        <button
          onClick={() => removeProduct(product.id)}
          className="inline-flex items-center justify-center rounded-md text-xs h-8 w-8 p-0 text-[#9CA3AF] hover:text-red-500 transition-all hover:bg-accent"
          title="Remove product"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default ProductRow;
