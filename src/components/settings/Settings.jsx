import React, { useState, useEffect } from 'react';
import { Send, Save, RotateCcw, Check, X, Bell, Clock, Server, Terminal, Globe } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../layout/Header';
import { checkBackendHealth, AMAZON_REGIONS, getSelectedRegion, setSelectedRegion } from '../../services/amazonApi';

const SCAN_INTERVALS = [
  { value: 15000, label: '15 seconds' },
  { value: 30000, label: '30 seconds' },
  { value: 60000, label: '1 minute' },
  { value: 300000, label: '5 minutes' },
  { value: 600000, label: '10 minutes' },
];

export function Settings() {
  const { 
    settings, 
    setDiscordWebhookUrl, 
    setScanInterval,
    setNotifyOnDeal,
    setNotifyOnPriceDrop,
    resetSettings,
    testWebhook,
    isSendingWebhook,
    webhookError,
  } = useApp();

  const [webhookInput, setWebhookInput] = useState(settings.discordWebhookUrl);
  const [testResult, setTestResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ checked: false, running: false });
  const [selectedRegionDomain, setSelectedRegionDomain] = useState(getSelectedRegion());

  const handleRegionChange = (domain) => {
    setSelectedRegion(domain);
    setSelectedRegionDomain(domain);
  };

  // Check backend status
  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkBackendHealth();
      setBackendStatus({ checked: true, running: status.running });
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveWebhook = () => {
    setDiscordWebhookUrl(webhookInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestWebhook = async () => {
    setTestResult(null);
    const result = await testWebhook();
    setTestResult(result);
    setTimeout(() => setTestResult(null), 5000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Settings" 
        subtitle="Configure your Zoner preferences" 
      />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8 space-y-8 max-w-3xl">
          {/* Backend Setup Section */}
          <section className="bg-[#1E2126] rounded-lg border border-[#374151] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#374151] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded flex items-center justify-center ${
                  backendStatus.running ? 'bg-[#3B82F6]/20' : 'bg-red-500/20'
                }`}>
                  <Server className={`w-5 h-5 ${backendStatus.running ? 'text-[#3B82F6]' : 'text-red-500'}`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Backend Server</h2>
                  <p className="text-sm text-[#9CA3AF]">Python scraping server status</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                backendStatus.running 
                  ? 'bg-[#3B82F6]/20 text-[#3B82F6]' 
                  : 'bg-red-500/20 text-red-500'
              }`}>
                {backendStatus.running ? 'Connected' : 'Offline'}
              </span>
            </div>
            
            <div className="p-6">
              {backendStatus.running ? (
                <div className="flex items-center gap-3 text-[#3B82F6]">
                  <Check className="w-5 h-5" />
                  <span className="text-sm">Backend is running at localhost:8000. Scout search is ready.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-[#9CA3AF]">
                    The Python backend is required for Scout product search. Start it with these commands:
                  </p>
                  
                  <div className="bg-[#0F1115] rounded-lg p-4 space-y-2 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#6B7280]" />
                      <code className="text-[#3B82F6]">cd backend</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#6B7280]" />
                      <code className="text-[#3B82F6]">pip install -r requirements.txt</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#6B7280]" />
                      <code className="text-[#3B82F6]">uvicorn main:app --reload --port 8000</code>
                    </div>
                  </div>
                  
                  <p className="text-xs text-[#6B7280]">
                    Add SCRAPER_API_KEY to backend/.env for CAPTCHA bypass (free tier: 5000 req/month).
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Region / Marketplace Section */}
          <section className="bg-[#1E2126] rounded-lg border border-[#374151] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#374151] flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Region / Marketplace</h2>
                <p className="text-sm text-[#9CA3AF]">Select which Amazon domain to search</p>
              </div>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-medium text-white mb-3">
                Amazon Marketplace
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(AMAZON_REGIONS).map(([domain, info]) => (
                  <button
                    key={domain}
                    onClick={() => handleRegionChange(domain)}
                    className={`
                      flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                      ${selectedRegionDomain === domain
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-[#374151] bg-[#0F1115] hover:border-[#4B5563]'
                      }
                    `}
                  >
                    <span className="text-2xl">{info.flag}</span>
                    <div className="text-left">
                      <div className="text-white font-medium">{info.name}</div>
                      <div className="text-xs text-[#9CA3AF]">{domain} • {info.currency}</div>
                    </div>
                    {selectedRegionDomain === domain && (
                      <Check className="w-5 h-5 text-blue-400 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#6B7280] mt-4">
                Prices and products will be fetched from the selected Amazon domain.
              </p>
            </div>
          </section>

          {/* Discord Webhook Section */}
          <section className="bg-[#1E2126] rounded-lg border border-[#374151] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#374151] flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5865F2]/20 rounded flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#5865F2]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Discord Integration</h2>
                <p className="text-sm text-[#9CA3AF]">Configure webhook for price alerts</p>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Webhook URL Input */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Webhook URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={webhookInput}
                    onChange={(e) => setWebhookInput(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                    className="flex-1 px-4 py-2 h-10 rounded-md border bg-[#0F1115] border-[#374151] text-white placeholder:text-[#6B7280] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent"
                  />
                  <button
                    onClick={handleSaveWebhook}
                    disabled={webhookInput === settings.discordWebhookUrl}
                    className="inline-flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4 mr-2" />}
                    {saved ? 'Saved!' : 'Save'}
                  </button>
                  <button
                    onClick={handleTestWebhook}
                    disabled={!settings.discordWebhookUrl || isSendingWebhook}
                    className="inline-flex items-center justify-center h-10 px-4 rounded-md text-sm font-medium bg-[#5865F2] hover:bg-[#5865F2]/90 text-white shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSendingWebhook ? 'Sending...' : 'Test'}
                  </button>
                </div>
                
                {/* Test Result Feedback */}
                {testResult && (
                  <div className={`mt-3 p-3 rounded-md flex items-center gap-2 ${
                    testResult.success 
                      ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {testResult.success ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Test message sent successfully!</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        <span className="text-sm">Failed: {testResult.error}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Notification Preferences */}
              <div className="pt-4 border-t border-[#374151] space-y-3">
                <h3 className="text-sm font-medium text-white">Notification Preferences</h3>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifyOnDeal}
                    onChange={(e) => setNotifyOnDeal(e.target.checked)}
                    className="w-4 h-4 rounded border-[#374151] bg-[#0F1115] text-[#FF9900] focus:ring-[#FF9900] focus:ring-offset-0"
                  />
                  <span className="text-sm text-[#9CA3AF]">Notify on deal detection (50%+ off)</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifyOnPriceDrop}
                    onChange={(e) => setNotifyOnPriceDrop(e.target.checked)}
                    className="w-4 h-4 rounded border-[#374151] bg-[#0F1115] text-[#FF9900] focus:ring-[#FF9900] focus:ring-offset-0"
                  />
                  <span className="text-sm text-[#9CA3AF]">Notify on any price drop below target</span>
                </label>
              </div>
            </div>
          </section>

          {/* Scanner Settings Section */}
          <section className="bg-[#1E2126] rounded-lg border border-[#374151] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#374151] flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF9900]/20 rounded flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FF9900]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Scanner Settings</h2>
                <p className="text-sm text-[#9CA3AF]">Configure price checking behavior</p>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Scan Interval
                </label>
                <select
                  value={settings.scanInterval}
                  onChange={(e) => setScanInterval(parseInt(e.target.value))}
                  className="w-full px-4 py-2 h-10 rounded-md border bg-[#0F1115] border-[#374151] text-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
                >
                  {SCAN_INTERVALS.map((interval) => (
                    <option key={interval.value} value={interval.value}>
                      {interval.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-[#6B7280]">
                  How often the scanner checks for price changes (demo uses simulated prices)
                </p>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-[#1E2126] rounded-lg border border-red-500/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#374151]">
              <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Reset All Settings</h3>
                  <p className="text-xs text-[#6B7280] mt-1">
                    This will reset all settings to their default values
                  </p>
                </div>
                <button
                  onClick={resetSettings}
                  className="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Settings
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Settings;
