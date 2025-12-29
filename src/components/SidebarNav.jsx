import React from 'react';

/**
 * SidebarNav
 * Polymet Design Export - Auto-generated JSX
 * Generated: 2025-12-28
 * 
 * Kullanım:
 * 1. Bu dosyayı src/components/ klasörüne kopyalayın
 * 2. globals.css dosyanıza CSS variables ekleyin
 * 3. Component'ı import edin: import SidebarNav from './components/SidebarNav'
 */

export default function SidebarNav() {
  return (
    <>
      <div className="flex bg-[#0F1115] min-h-screen"><div className="w-64 h-screen bg-[#1E2126] border-r border-[#374151] flex flex-col"><div className="p-6 border-b border-[#374151]"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-[#FF9900] to-[#FF9900]/70 rounded flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap w-6 h-6 text-white" aria-hidden={true}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg></div><div><h1 className="text-lg font-bold text-white">GlitchHunter</h1><p className="text-xs text-[#9CA3AF]">Price Tracker</p></div></div></div><nav className="flex-1 p-4 space-y-1"><a href="#" className="flex items-center gap-3 px-4 py-3 rounded-md transition-all bg-[#FF9900] text-white shadow-lg shadow-[#FF9900]/20"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard w-5 h-5" aria-hidden={true}><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg><span className="font-medium">Dashboard</span></a><a href="#" className="flex items-center gap-3 px-4 py-3 rounded-md transition-all text-[#9CA3AF] hover:bg-[#374151] hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell w-5 h-5" aria-hidden={true}><path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path></svg><span className="font-medium">Webhooks</span></a><a href="#" className="flex items-center gap-3 px-4 py-3 rounded-md transition-all text-[#9CA3AF] hover:bg-[#374151] hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings w-5 h-5" aria-hidden={true}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg><span className="font-medium">Settings</span></a></nav><div className="p-4 border-t border-[#374151]"><div className="flex items-center gap-3 px-3 py-3 bg-[#0F1115] rounded-md hover:bg-[#374151] transition-colors cursor-pointer"><div className="w-10 h-10 bg-gradient-to-br from-[#5865F2] to-[#5865F2]/70 rounded-full flex items-center justify-center text-white font-semibold">JD</div><div className="flex-1 min-w-0"><div className="text-sm font-medium text-white truncate">John Doe</div><div className="text-xs text-[#9CA3AF] truncate">john@example.com</div></div></div><div className="mt-3 px-3 py-2 bg-[#0F1115] rounded-md"><div className="text-xs text-[#9CA3AF]">Version</div><div className="text-sm font-mono text-white" style={{fontFamily: "\"JetBrains Mono\", monospace"}}>v1.0.0</div></div></div></div><div className="flex-1 p-8"><div className="max-w-4xl"><h1 className="text-2xl font-bold text-white mb-2">Sidebar Navigation</h1><p className="text-[#9CA3AF]">Click on navigation items to see active states</p></div></div></div>
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
