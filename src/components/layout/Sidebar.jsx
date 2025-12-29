import React from 'react';
import { LayoutDashboard, Bell, Settings, Zap, Search } from 'lucide-react';

const navItems = [
  { id: 'scout', label: 'Scout', icon: Search },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'webhooks', label: 'Webhooks', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, onNavigate }) {
  return (
    <div className="w-64 h-screen bg-[#1E2126] border-r border-[#374151] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#374151]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF9900] to-[#FF9900]/70 rounded flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Zoner</h1>
            <p className="text-xs text-[#9CA3AF]">Price Tracker</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all
                ${isActive
                  ? 'bg-[#FF9900] text-white shadow-lg shadow-[#FF9900]/20'
                  : 'text-[#9CA3AF] hover:bg-[#374151] hover:text-white'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#374151]">
        <div className="px-3 py-2 bg-[#0F1115] rounded-md">
          <div className="text-xs text-[#9CA3AF]">Version</div>
          <div className="text-sm font-mono text-white">v2.0.0</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
