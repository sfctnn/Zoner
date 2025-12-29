import React from 'react';

/**
 * ScannerStatus
 * Polymet Design Export - Auto-generated JSX
 * Generated: 2025-12-28
 * 
 * Kullanım:
 * 1. Bu dosyayı src/components/ klasörüne kopyalayın
 * 2. globals.css dosyanıza CSS variables ekleyin
 * 3. Component'ı import edin: import ScannerStatus from './components/ScannerStatus'
 */

export default function ScannerStatus() {
  return (
    <>
      <div className="p-8 bg-[#0F1115] min-h-screen"><div className="max-w-2xl mx-auto space-y-8"><div><h1 className="text-2xl font-bold text-white mb-2">Scanner Status Component</h1><p className="text-[#9CA3AF]">Pulsing indicator for active scanner state</p></div><div className="bg-[#1E2126] rounded-md p-8 border border-[#374151] space-y-6"><div><h3 className="text-sm font-medium text-[#9CA3AF] mb-4">Active State</h3><div className="flex items-center gap-3"><div className="relative flex items-center justify-center"><div className="absolute w-3 h-3 bg-[#3B82F6] rounded-full animate-ping opacity-75"></div><div className="absolute w-3 h-3 bg-[#3B82F6] rounded-full opacity-50 blur-sm"></div><div className="w-3 h-3 rounded-full relative z-10 bg-[#3B82F6]"></div></div><div className="flex flex-col"><span className="text-sm font-medium text-white">Scanner Active</span><span className="text-xs text-[#9CA3AF]">Monitoring 10 products</span></div></div></div><div className="border-t border-[#374151] pt-6"><h3 className="text-sm font-medium text-[#9CA3AF] mb-4">Stopped State</h3><div className="flex items-center gap-3"><div className="relative flex items-center justify-center"><div className="w-3 h-3 rounded-full relative z-10 bg-[#9CA3AF]"></div></div><div className="flex flex-col"><span className="text-sm font-medium text-white">Scanner Stopped</span><span className="text-xs text-[#9CA3AF]">Not monitoring</span></div></div></div><div className="border-t border-[#374151] pt-6"><h3 className="text-sm font-medium text-[#9CA3AF] mb-4">Interactive Demo</h3><div className="space-y-4"><div className="flex items-center gap-3"><div className="relative flex items-center justify-center"><div className="absolute w-3 h-3 bg-[#3B82F6] rounded-full animate-ping opacity-75"></div><div className="absolute w-3 h-3 bg-[#3B82F6] rounded-full opacity-50 blur-sm"></div><div className="w-3 h-3 rounded-full relative z-10 bg-[#3B82F6]"></div></div><div className="flex flex-col"><span className="text-sm font-medium text-white">Scanner Active</span><span className="text-xs text-[#9CA3AF]">Monitoring 10 products</span></div></div><button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-9 px-4 py-2 bg-[#FF9900] hover:bg-[#FF9900]/90 text-white">Stop Scanner</button></div></div></div></div></div>
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
