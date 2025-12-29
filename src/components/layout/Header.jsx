import React from 'react';
import { Send, Server, AlertCircle, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AMAZON_REGIONS, getSelectedRegion } from '../../services/amazonApi';

export function Header({ title, subtitle, backendStatus }) {
  const { isScanning, toggleScanner, testWebhook, isSendingWebhook, settings } = useApp();
  
  // Get current region for display
  const currentDomain = getSelectedRegion();
  const currentRegion = AMAZON_REGIONS[currentDomain] || AMAZON_REGIONS['amazon.com'];

  const handleTestWebhook = async () => {
    const result = await testWebhook();
    if (!result.success) {
      console.error('Webhook test failed:', result.error);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-[#1E2126] border-b border-[#374151] px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm text-[#9CA3AF] mt-1">{subtitle}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Region Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <span className="text-lg">{currentRegion.flag}</span>
            <span className="text-xs font-medium text-blue-400">{currentRegion.name}</span>
          </div>

          <div className="w-px h-8 bg-[#374151]" />

          {/* Backend Status (if provided) */}
          {backendStatus && (
            <>
              <div className="flex items-center gap-2">
                <div className="relative">
                  {backendStatus.running && (
                    <div className="absolute inset-0 bg-[#3B82F6] rounded-full animate-ping opacity-50" />
                  )}
                  <div className={`relative w-2 h-2 rounded-full ${
                    backendStatus.running ? 'bg-[#3B82F6]' : 'bg-red-500'
                  }`} />
                </div>
                <Server className={`w-4 h-4 ${
                  backendStatus.running ? 'text-[#3B82F6]' : 'text-red-500'
                }`} />
                <span className={`text-xs font-medium ${
                  backendStatus.running ? 'text-[#3B82F6]' : 'text-red-500'
                }`}>
                  {backendStatus.running ? 'Backend' : 'Offline'}
                </span>
              </div>
              <div className="w-px h-8 bg-[#374151]" />
            </>
          )}

          {/* Scanner Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                {isScanning && (
                  <div className="absolute inset-0 bg-[#3B82F6] rounded-full animate-ping opacity-75" />
                )}
                <div className={`relative w-2 h-2 rounded-full ${isScanning ? 'bg-[#3B82F6]' : 'bg-[#9CA3AF]'}`} />
              </div>
              <span className={`text-sm font-medium ${isScanning ? 'text-[#3B82F6]' : 'text-[#9CA3AF]'}`}>
                {isScanning ? 'Active' : 'Stopped'}
              </span>
            </div>
            
            {/* Scanner Toggle Switch */}
            <button
              onClick={toggleScanner}
              role="switch"
              aria-checked={isScanning}
              className={`
                relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full
                border-2 border-transparent shadow-sm transition-colors
                ${isScanning ? 'bg-[#3B82F6]' : 'bg-[#374151]'}
              `}
            >
              <span
                className={`
                  pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform
                  ${isScanning ? 'translate-x-4' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          <div className="w-px h-8 bg-[#374151]" />

          {/* Test Webhook Button */}
          <button
            onClick={handleTestWebhook}
            disabled={isSendingWebhook || !settings.discordWebhookUrl}
            className={`
              inline-flex items-center justify-center whitespace-nowrap font-medium
              h-8 rounded-md px-3 text-xs border shadow-sm transition-colors
              ${settings.discordWebhookUrl
                ? 'bg-[#5865F2] hover:bg-[#5865F2]/90 text-white border-[#5865F2]'
                : 'bg-[#374151] text-[#9CA3AF] border-[#374151] cursor-not-allowed'
              }
              disabled:opacity-50
            `}
          >
            <Send className="w-4 h-4 mr-2" />
            {isSendingWebhook ? 'Sending...' : 'Test Webhook'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
