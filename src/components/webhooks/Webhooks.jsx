import React from 'react';
import { Bell, Plus, Trash2, Send, Check, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../layout/Header';

export function Webhooks() {
  const { 
    settings, 
    testWebhook, 
    isSendingWebhook,
    setDiscordWebhookUrl,
  } = useApp();

  const [webhookInput, setWebhookInput] = React.useState('');
  const [testResult, setTestResult] = React.useState(null);

  const handleAddWebhook = () => {
    if (webhookInput.trim()) {
      setDiscordWebhookUrl(webhookInput.trim());
      setWebhookInput('');
    }
  };

  const handleTestWebhook = async () => {
    setTestResult(null);
    const result = await testWebhook();
    setTestResult(result);
    setTimeout(() => setTestResult(null), 5000);
  };

  const handleRemoveWebhook = () => {
    setDiscordWebhookUrl('');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header 
        title="Webhooks" 
        subtitle="Manage your Discord webhook integrations" 
      />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8 space-y-6 max-w-4xl">
          {/* Add Webhook Card */}
          <div className="bg-[#1E2126] rounded-lg border border-[#374151] p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Add Discord Webhook</h2>
            <div className="flex gap-3">
              <input
                type="url"
                value={webhookInput}
                onChange={(e) => setWebhookInput(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="flex-1 px-4 py-2 h-10 rounded-md border bg-[#0F1115] border-[#374151] text-white placeholder:text-[#6B7280] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#5865F2]"
              />
              <button
                onClick={handleAddWebhook}
                disabled={!webhookInput.trim()}
                className="inline-flex items-center justify-center h-10 px-6 rounded-md text-sm font-medium bg-[#5865F2] hover:bg-[#5865F2]/90 text-white shadow transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </button>
            </div>
          </div>

          {/* Webhooks List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Configured Webhooks</h2>
            
            {!settings.discordWebhookUrl ? (
              <div className="bg-[#1E2126] rounded-lg border border-[#374151] p-12 text-center">
                <Bell className="w-12 h-12 mx-auto text-[#374151] mb-4" />
                <p className="text-[#9CA3AF]">No webhooks configured yet</p>
                <p className="text-sm text-[#6B7280] mt-1">Add a Discord webhook URL above to receive price alerts</p>
              </div>
            ) : (
              <div className="bg-[#1E2126] rounded-lg border border-[#374151] overflow-hidden">
                <div className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#5865F2]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-[#5865F2]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white">Main Alerts</h3>
                    <p className="text-xs text-[#6B7280] font-mono truncate">
                      {settings.discordWebhookUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status */}
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-[#3B82F6]/20 text-[#3B82F6]">
                      Active
                    </span>
                    
                    {/* Test Button */}
                    <button
                      onClick={handleTestWebhook}
                      disabled={isSendingWebhook}
                      className="inline-flex items-center justify-center h-8 px-3 rounded-md text-xs font-medium bg-[#5865F2] hover:bg-[#5865F2]/90 text-white transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      {isSendingWebhook ? 'Testing...' : 'Test'}
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={handleRemoveWebhook}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-[#9CA3AF] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Test Result */}
                {testResult && (
                  <div className={`px-4 py-3 border-t border-[#374151] flex items-center gap-2 ${
                    testResult.success 
                      ? 'bg-[#3B82F6]/10 text-[#3B82F6]'
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {testResult.success ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Test notification sent successfully!</span>
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Webhooks;
