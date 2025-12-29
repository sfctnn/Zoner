import React from 'react';
import { ShoppingBag, X } from 'lucide-react';

/**
 * Floating action bar for bulk operations on selected products
 */
export function BulkActionBar({ selectedCount, onTrackAll, onClearSelection }) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 px-6 py-3 bg-[#1E2126] border border-[#374151] rounded-xl shadow-2xl shadow-black/50">
        <span className="text-sm text-[#9CA3AF]">
          <span className="font-bold text-white">{selectedCount}</span> item{selectedCount > 1 ? 's' : ''} selected
        </span>
        
        <div className="w-px h-6 bg-[#374151]" />
        
        <button
          onClick={onTrackAll}
          className="inline-flex items-center justify-center h-9 px-6 rounded-lg text-sm font-medium bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white shadow transition-colors"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Track {selectedCount} Item{selectedCount > 1 ? 's' : ''}
        </button>
        
        <button
          onClick={onClearSelection}
          className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#374151] transition-colors"
          title="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default BulkActionBar;
