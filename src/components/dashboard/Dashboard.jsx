import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, StopCircle, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../layout/Header';
import StatsCards from './StatsCards';
import ProductRow from './ProductRow';
import ActivityLog from './ActivityLog';
import AddProductForm from './AddProductForm';

export function Dashboard() {
  const { sortedProducts, stats, isScanning, startScanner, stopScanner } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter products
  const filteredProducts = sortedProducts.filter((product) => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.asin.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'glitch' && product.status === 'glitch') ||
      (filterStatus === 'starred' && product.starred);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Dashboard" 
        subtitle="Monitor your tracked products and price glitches" 
      />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8 space-y-6">
          {/* Title Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-[#9CA3AF]">Monitor Amazon price glitches in real-time</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Scanner Status */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  {isScanning && (
                    <>
                      <div className="absolute w-3 h-3 bg-[#3B82F6] rounded-full animate-ping opacity-75" />
                      <div className="absolute w-3 h-3 bg-[#3B82F6] rounded-full opacity-50 blur-sm" />
                    </>
                  )}
                  <div className={`w-3 h-3 rounded-full relative z-10 ${isScanning ? 'bg-[#3B82F6]' : 'bg-[#9CA3AF]'}`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    {isScanning ? 'Scanner Active' : 'Scanner Stopped'}
                  </span>
                  <span className="text-xs text-[#9CA3AF]">
                    Monitoring {stats.monitoringCount} products
                  </span>
                </div>
              </div>
              
              <button
                onClick={isScanning ? stopScanner : startScanner}
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium shadow h-9 px-4 py-2 ${
                  isScanning 
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white'
                }`}
              >
                {isScanning ? (
                  <>
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop Scanner
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Scanner
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products Section */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {/* Add Product Form */}
                <AddProductForm />

                {/* Search & Filters */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by title or ASIN..."
                      className="w-full pl-10 pr-4 py-2 h-9 rounded-md border bg-[#1E2126] border-[#374151] text-white placeholder:text-[#9CA3AF] text-sm"
                    />
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-[160px] h-9 px-3 rounded-md border bg-[#1E2126] border-[#374151] text-white text-sm cursor-pointer"
                  >
                    <option value="all">All Products</option>
                    <option value="glitch">Glitches Only</option>
                    <option value="starred">Starred Only</option>
                  </select>

                  <button className="inline-flex items-center justify-center h-9 px-3 rounded-md text-xs font-medium bg-[#1E2126] border border-[#374151] text-white hover:bg-[#374151]">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Discount
                  </button>
                </div>

                {/* Products Table */}
                <div className="bg-[#1E2126] rounded-md border border-[#374151] overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-[60px_2fr_1fr_120px_120px_100px] gap-4 items-center py-3 px-4 border-b border-[#374151] bg-[#0F1115]">
                    <div className="text-xs font-medium text-[#9CA3AF]">Image</div>
                    <div className="text-xs font-medium text-[#9CA3AF]">Product</div>
                    <div className="text-xs font-medium text-[#9CA3AF]">Pricing</div>
                    <div className="text-xs font-medium text-[#9CA3AF]">Status</div>
                    <div className="text-xs font-medium text-[#9CA3AF]">Category</div>
                    <div className="text-xs font-medium text-[#9CA3AF] text-right">Actions</div>
                  </div>

                  {/* Table Body */}
                  {filteredProducts.length === 0 ? (
                    <div className="py-12 text-center text-[#9CA3AF]">
                      <p className="text-sm">No products found</p>
                      <p className="text-xs mt-1">Add products using the form above</p>
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                      <ProductRow key={product.id} product={product} />
                    ))
                  )}
                </div>

                {/* Footer Stats */}
                <div className="flex items-center justify-between text-sm text-[#9CA3AF]">
                  <div>Showing {filteredProducts.length} of {stats.totalProducts} products</div>
                  <div>{stats.glitchCount} glitches detected</div>
                </div>
              </div>
            </div>

            {/* Activity Log Sidebar */}
            <div className="lg:col-span-1">
              <ActivityLog />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
