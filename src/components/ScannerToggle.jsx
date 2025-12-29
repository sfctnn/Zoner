import React from 'react';

/**
 * ScannerToggle
 * Polymet Design Export - Auto-generated JSX
 * Generated: 2025-12-28
 * 
 * Kullanım:
 * 1. Bu dosyayı src/components/ klasörüne kopyalayın
 * 2. globals.css dosyanıza CSS variables ekleyin
 * 3. Component'ı import edin: import ScannerToggle from './components/ScannerToggle'
 */

export default function ScannerToggle() {
  return (
    <>
      <div className="p-8 bg-[#0F1115] min-h-screen"><div className="max-w-2xl mx-auto space-y-8"><div><h1 className="text-2xl font-bold text-white mb-2">Scanner Toggle Component</h1><p className="text-[#9CA3AF]">Global scanner control with status indicator and toggle switch</p></div><div className="bg-[#1E2126] rounded-md p-8 border border-[#374151] space-y-6"><div><h3 className="text-sm font-medium text-[#9CA3AF] mb-4">Active State</h3><div className="flex items-center gap-3"><div className="flex items-center gap-2"><div className="relative"><div className="absolute inset-0 bg-[#3B82F6] rounded-full animate-ping opacity-75"></div><div className="relative w-2 h-2 rounded-full bg-[#3B82F6]"></div></div><span className="text-sm font-medium text-[#3B82F6]">Active</span></div><button type="button" role="switch" aria-checked="true" data-state="checked" value="on" className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-input data-[state=checked]:bg-[#3B82F6]"><span data-state="checked" className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"></span></button></div></div><div className="border-t border-[#374151] pt-6"><h3 className="text-sm font-medium text-[#9CA3AF] mb-4">Stopped State</h3><div className="flex items-center gap-3"><div className="flex items-center gap-2"><div className="relative"><div className="relative w-2 h-2 rounded-full bg-[#9CA3AF]"></div></div><span className="text-sm font-medium text-[#9CA3AF]">Stopped</span></div><button type="button" role="switch" aria-checked="false" data-state="unchecked" value="on" className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-input data-[state=checked]:bg-[#3B82F6]"><span data-state="unchecked" className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"></span></button></div></div><div className="border-t border-[#374151] pt-6"><h3 className="text-sm font-medium text-[#9CA3AF] mb-4">Interactive Demo</h3><div className="flex items-center gap-3"><div className="flex items-center gap-2"><div className="relative"><div className="absolute inset-0 bg-[#3B82F6] rounded-full animate-ping opacity-75"></div><div className="relative w-2 h-2 rounded-full bg-[#3B82F6]"></div></div><span className="text-sm font-medium text-[#3B82F6]">Active</span></div><button type="button" role="switch" aria-checked="true" data-state="checked" value="on" className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-input data-[state=checked]:bg-[#3B82F6]"><span data-state="checked" className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"></span></button></div></div></div></div></div>
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
