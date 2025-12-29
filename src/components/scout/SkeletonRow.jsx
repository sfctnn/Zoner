import React from 'react';

/**
 * Skeleton loading row for search results table
 * Matches the ProductRow layout
 */
export function SkeletonRow() {
  return (
    <div className="grid grid-cols-[40px_2fr_100px_120px_120px] gap-4 items-center py-3 px-4 border-b border-[#374151] animate-pulse">
      {/* Checkbox skeleton */}
      <div className="flex items-center justify-center">
        <div className="w-4 h-4 bg-[#374151] rounded" />
      </div>

      {/* Product info skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#374151] rounded flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#374151] rounded w-3/4" />
          <div className="h-3 bg-[#374151] rounded w-1/4" />
        </div>
      </div>

      {/* Seller skeleton */}
      <div>
        <div className="h-5 bg-[#374151] rounded w-16" />
      </div>

      {/* Price skeleton */}
      <div>
        <div className="h-6 bg-[#374151] rounded w-20" />
      </div>

      {/* Actions skeleton */}
      <div className="flex items-center justify-end gap-2">
        <div className="w-8 h-8 bg-[#374151] rounded" />
        <div className="w-16 h-8 bg-[#374151] rounded" />
      </div>
    </div>
  );
}

/**
 * Multiple skeleton rows for loading state
 */
export function SkeletonTable({ rows = 8 }) {
  return (
    <div className="bg-[#1E2126] rounded-lg border border-[#374151] overflow-hidden">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#374151] bg-[#0F1115]">
        <div className="h-4 bg-[#374151] rounded w-32 animate-pulse" />
        <div className="h-8 bg-[#374151] rounded w-40 animate-pulse" />
      </div>

      {/* Column headers skeleton */}
      <div className="grid grid-cols-[40px_2fr_100px_120px_120px] gap-4 items-center py-2 px-4 border-b border-[#374151] bg-[#0F1115]/50">
        <div className="h-3 bg-[#374151] rounded w-4 animate-pulse" />
        <div className="h-3 bg-[#374151] rounded w-16 animate-pulse" />
        <div className="h-3 bg-[#374151] rounded w-12 animate-pulse" />
        <div className="h-3 bg-[#374151] rounded w-10 animate-pulse" />
        <div className="h-3 bg-[#374151] rounded w-14 animate-pulse" />
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}

export default SkeletonRow;
