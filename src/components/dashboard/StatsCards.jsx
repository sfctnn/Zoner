import React from 'react';
import { TrendingDown, DollarSign, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function StatsCards() {
  const { stats } = useApp();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Glitches Found */}
      <div className="rounded-xl border text-card-foreground shadow bg-[#1E2126] border-[#374151] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#9CA3AF] mb-1">Glitches Found</p>
            <p className="text-3xl font-bold text-[#3B82F6] font-mono">
              {stats.glitchCount}
            </p>
          </div>
          <div className="w-12 h-12 bg-[#3B82F6]/20 rounded flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-[#3B82F6]" />
          </div>
        </div>
      </div>

      {/* Avg. Discount */}
      <div className="rounded-xl border text-card-foreground shadow bg-[#1E2126] border-[#374151] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#9CA3AF] mb-1">Avg. Discount</p>
            <p className="text-3xl font-bold text-[#FF9900] font-mono">
              {stats.avgDiscount}%
            </p>
          </div>
          <div className="w-12 h-12 bg-[#FF9900]/20 rounded flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-[#FF9900]" />
          </div>
        </div>
      </div>

      {/* Total Products */}
      <div className="rounded-xl border text-card-foreground shadow bg-[#1E2126] border-[#374151] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#9CA3AF] mb-1">Total Products</p>
            <p className="text-3xl font-bold text-white font-mono">
              {stats.totalProducts}
            </p>
          </div>
          <div className="w-12 h-12 bg-[#5865F2]/20 rounded flex items-center justify-center">
            <Package className="w-6 h-6 text-[#5865F2]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
