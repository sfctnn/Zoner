import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { parseAmazonInput, generatePlaceholderProduct } from '../../utils/helpers';

export function AddProductForm() {
  const { addProduct } = useApp();
  const [input, setInput] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { asin, isValid } = parseAmazonInput(input);
    
    if (!isValid) {
      setError('Invalid Amazon URL or ASIN');
      return;
    }

    const target = parseFloat(targetPrice);
    if (isNaN(target) || target <= 0) {
      setError('Please enter a valid target price');
      return;
    }

    // Generate placeholder product data
    const placeholder = generatePlaceholderProduct(asin);
    addProduct({
      ...placeholder,
      targetPrice: target,
    });

    // Reset form
    setInput('');
    setTargetPrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste Amazon Link or ASIN..."
          className="w-full pl-10 pr-4 py-2 h-10 rounded-md border bg-[#1E2126] border-[#374151] text-white placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
        />
      </div>
      
      <div className="relative w-32">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          placeholder="Target"
          className="w-full pl-7 pr-4 py-2 h-10 rounded-md border bg-[#1E2126] border-[#374151] text-white placeholder:text-[#9CA3AF] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
        />
      </div>
      
      <button
        type="submit"
        className="inline-flex items-center justify-center h-10 px-6 rounded-md text-sm font-medium bg-[#FF9900] hover:bg-[#FF9900]/90 text-white shadow transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Product
      </button>

      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </form>
  );
}

export default AddProductForm;
