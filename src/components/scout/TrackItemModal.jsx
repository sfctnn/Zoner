import React, { useState } from 'react';
import { X, Clock, DollarSign, Percent, AlertTriangle, Check, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const INTERVAL_OPTIONS = [
  { value: 60000, label: '1 minute' },
  { value: 300000, label: '5 minutes' },
  { value: 900000, label: '15 minutes' },
  { value: 1800000, label: '30 minutes' },
  { value: 3600000, label: '1 hour' },
];

export function TrackItemModal({ product, bulkProducts = [], onClose }) {
  const { addProduct } = useApp();
  const [interval, setInterval] = useState(300000); // 5 min default
  const [targetPrice, setTargetPrice] = useState('');
  const [discountThreshold, setDiscountThreshold] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const isBulkMode = bulkProducts.length > 1;
  const productsToTrack = isBulkMode ? bulkProducts : [product];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!targetPrice && !discountThreshold) {
      return; // At least one trigger required
    }

    setIsSubmitting(true);

    // Add all products to watchlist with monitoring config
    productsToTrack.forEach((p) => {
      const newProduct = {
        asin: p.asin,
        title: p.title,
        image: p.image,
        currentPrice: p.currentPrice,
        originalPrice: p.originalPrice || p.currentPrice,
        originalPriceAtTrack: p.currentPrice, // Price when tracking started
        targetPrice: targetPrice ? parseFloat(targetPrice) : p.currentPrice * 0.8,
        category: p.category || 'Uncategorized',
        seller: p.seller,
        monitorConfig: {
          interval: interval,
          targetPrice: targetPrice ? parseFloat(targetPrice) : null,
          discountThreshold: discountThreshold ? parseFloat(discountThreshold) : null,
          triggerLogic: 'OR',
        },
      };

      addProduct(newProduct);
    });
    
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const calculateSavings = () => {
    if (!targetPrice) return null;
    const target = parseFloat(targetPrice);
    const savings = product.currentPrice - target;
    const percent = ((savings / product.currentPrice) * 100).toFixed(1);
    return { savings, percent };
  };

  const savings = calculateSavings();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1E2126] border border-[#374151] rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#374151]">
          <h2 className="text-lg font-semibold text-white">
            {isBulkMode ? `Track ${bulkProducts.length} Items` : 'Track This Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Preview */}
        <div className="px-6 py-4 bg-[#0F1115]">
          {isBulkMode ? (
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#1E2126] rounded-lg border border-[#374151] flex items-center justify-center">
                <Package className="w-8 h-8 text-[#5865F2]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-white">
                  {bulkProducts.length} products selected
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-1 line-clamp-2">
                  {bulkProducts.slice(0, 3).map((p) => p.title.split(' ').slice(0, 3).join(' ')).join(', ')}
                  {bulkProducts.length > 3 && ` +${bulkProducts.length - 3} more`}
                </p>
                <p className="text-lg font-bold text-[#FF9900] font-mono mt-2">
                  Total: ${bulkProducts.reduce((sum, p) => sum + p.currentPrice, 0).toFixed(2)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-20 h-20 object-cover rounded-lg border border-[#374151]"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  Sold by {product.seller}
                </p>
                <p className="text-xl font-bold text-[#FF9900] font-mono mt-2">
                  ${product.currentPrice.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        {success ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 mx-auto bg-[#3B82F6]/20 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-[#3B82F6]" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {isBulkMode ? `${bulkProducts.length} Items Added!` : 'Added to Watchlist!'}
            </h3>
            <p className="text-sm text-[#9CA3AF] mt-2">
              We'll notify you when {isBulkMode ? 'any' : 'the'} price drops
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Configuration */}
            <div className="px-6 py-4 space-y-4">
              {/* Check Interval */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white mb-2">
                  <Clock className="w-4 h-4 text-[#5865F2]" />
                  Check Interval
                </label>
                <select
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg bg-[#0F1115] border border-[#374151] text-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
                >
                  {INTERVAL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trigger Conditions */}
              <div className="p-4 bg-[#0F1115] rounded-lg border border-[#374151]">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-[#FF9900]" />
                  <span className="text-sm font-medium text-white">Alert Triggers (OR)</span>
                </div>
                <p className="text-xs text-[#6B7280] mb-4">
                  Set at least one condition. Alert fires when either is met.
                </p>

                <div className="space-y-3">
                  {/* Target Price */}
                  <div>
                    <label className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-1">
                      <DollarSign className="w-3 h-3" />
                      Target Price (alert if price drops below)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        placeholder={`e.g., ${(product.currentPrice * 0.85).toFixed(2)}`}
                        className="w-full pl-7 pr-4 py-2 rounded-lg bg-[#1E2126] border border-[#374151] text-white font-mono text-sm placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                      />
                    </div>
                    {savings && savings.savings > 0 && (
                      <p className="text-xs text-[#3B82F6] mt-1">
                        You'll save ${savings.savings.toFixed(2)} ({savings.percent}% off)
                      </p>
                    )}
                  </div>

                  <div className="text-center text-xs text-[#6B7280]">— OR —</div>

                  {/* Discount Threshold */}
                  <div>
                    <label className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-1">
                      <Percent className="w-3 h-3" />
                      Discount Threshold (alert if price drops by X%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="1"
                        min="1"
                        max="99"
                        value={discountThreshold}
                        onChange={(e) => setDiscountThreshold(e.target.value)}
                        placeholder="e.g., 15"
                        className="w-full pl-4 pr-8 py-2 rounded-lg bg-[#1E2126] border border-[#374151] text-white font-mono text-sm placeholder:text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">%</span>
                    </div>
                    {discountThreshold && (
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        Alert if price drops from ${product.currentPrice.toFixed(2)} to ${(product.currentPrice * (1 - parseFloat(discountThreshold) / 100)).toFixed(2)} or less
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-[#0F1115] border-t border-[#374151] flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#374151] hover:bg-[#4B5563] text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!targetPrice && !discountThreshold)}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding...' : 'Start Tracking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default TrackItemModal;
