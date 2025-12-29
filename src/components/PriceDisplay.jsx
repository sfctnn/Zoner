import React from 'react';

/**
 * PriceDisplay
 * Polymet Design Export - Auto-generated JSX
 * Generated: 2025-12-28
 * 
 * Kullanım:
 * 1. Bu dosyayı src/components/ klasörüne kopyalayın
 * 2. globals.css dosyanıza CSS variables ekleyin
 * 3. Component'ı import edin: import PriceDisplay from './components/PriceDisplay'
 */

export default function PriceDisplay() {
  return (
    <>
      <div className="p-8 bg-[#0F1115] min-h-screen"><div className="max-w-2xl mx-auto space-y-8"><div><h1 className="text-2xl font-bold text-white mb-2">Price Display Component</h1><p className="text-[#9CA3AF]">Monospace font for prices with discount badges</p></div><div className="bg-[#1E2126] rounded-md p-8 border border-[#374151] space-y-6"><div><h3 className="text-sm font-medium text-[#9CA3AF] mb-4">Regular Discount</h3><div className="flex items-center gap-2"><span className="font-mono font-bold text-[#FF9900] text-base" style={{fontFamily: "\"JetBrains Mono\", monospace"}}>$189.99</span><span className="font-mono text-[#9CA3AF] line-through text-sm" style={{fontFamily: "\"JetBrains Mono\", monospace"}}>$249.99</span><span className="font-medium rounded text-xs px-2 py-0.5 bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/30">-24%</span></div></div><div className="border-t border-[#374151] pt-6"><h3 className="text-sm font-medium text-[#9CA3AF] mb-4">Glitch Price (High Discount)</h3><div className="flex items-center gap-2"><span className="font-mono font-bold text-[#FF9900] text-base" style={{fontFamily: "\"JetBrains Mono\", monospace"}}>$149.99</span><span className="font-mono text-[#9CA3AF] line-through text-sm" style={{fontFamily: "\"JetBrains Mono\", monospace"}}>$399.99</span><span className="font-medium rounded text-xs px-2 py-0.5 bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30">-62%</span></div></div><div className="border-t border-[#374151] pt-6"><h3 className="text-sm font-medium text-[#9CA3AF] mb-4">Size Variants</h3><div className="space-y-4"><div><p className="text-xs text-[#9CA3AF] mb-2">Small</p><div className="flex items-center gap-2"><span className="font-mono font-bold text-[#FF9900] text-sm" style={{fontFamily: "\"JetBrains Mono\", monospace"}}>$24.99</span><span className="font-mono text-[#9CA3AF] line-through text-xs" style={{fontFamily: "\"JetBrains Mono\", monospace"}}>$99.99</span><span className="font-medium rounded text-[10px] px-1.5 py-0.5 bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30">-75%</span></div></div><div><p className="text-xs text-[#9CA3AF] mb-2">Medium (Default)</p><div className="flex items-center gap-2"><span className="font-mono font-bold text-[#FF9900] text-base" style={{fontFamily: "\"JetBrains Mono\", monospace"}}>$24.99</span><span className="font-mono text-[#9CA3AF] line-through text-sm" style={{fontFamily: "\"JetBrains Mono\", monospace"}}>$99.99</span><span className="font-medium rounded text-xs px-2 py-0.5 bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30">-75%</span></div></div><div><p className="text-xs text-[#9CA3AF] mb-2">Large</p><div className="flex items-center gap-2"><span className="font-mono font-bold text-[#FF9900] text-lg" style={{fontFamily: "\"JetBrains Mono\", monospace"}}>$24.99</span><span className="font-mono text-[#9CA3AF] line-through text-base" style={{fontFamily: "\"JetBrains Mono\", monospace"}}>$99.99</span><span className="font-medium rounded text-sm px-2 py-1 bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30">-75%</span></div></div></div></div></div></div></div>
    </>
  );
}

/*
 * CSS Variables (globals.css'e ekleyin):
 * 
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

:root {
  --background: 48 33% 97%;
  --foreground: 48 20% 20%;
  --card: 48 33% 97%;
  --card-foreground: 60 3% 8%;
  --popover: 0 0% 100%;
  --popover-foreground: 51 19% 13%;
  --primary: 15 56% 52%;
  --primary-foreground: 0 0% 100%;
  --secondary: 46 23% 89%;
  --secondary-foreground: 51 8% 30%;
  --muted: 44 29% 90%;
  --muted-foreground: 50 2% 50%;
  --accent: 46 23% 89%;
  --accent-foreground: 51 19% 13%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 50 8% 84%;
  --input: 51 8% 68%;
  --ring: 15 56% 52%;
  --radius: 0.5rem;
}

.dark {
  --background: 60 3% 15%;
  --foreground: 46 10% 74%;
  --card: 60 3% 15%;
  --card-foreground: 48 33% 97%;
  --popover: 60 2% 18%;
  --popover-foreground: 60 5% 89%;
  --primary: 15 63% 60%;
  --primary-foreground: 0 0% 100%;
  --secondary: 48 33% 97%;
  --secondary-foreground: 60 2% 18%;
  --muted: 60 4% 10%;
  --muted-foreground: 51 9% 69%;
  --accent: 48 11% 9%;
  --accent-foreground: 51 26% 95%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 60 5% 23%;
  --input: 53 5% 31%;
  --ring: 15 63% 60%;
}
*/
