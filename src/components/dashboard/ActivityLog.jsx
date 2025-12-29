import React from 'react';
import { TrendingDown, Bell, DollarSign, Play, StopCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatLogTime } from '../../utils/helpers';

const getLogIcon = (type) => {
  switch (type) {
    case 'glitch':
      return <TrendingDown className="w-4 h-4 text-[#3B82F6]" />;
    case 'webhook':
      return <Bell className="w-4 h-4 text-[#5865F2]" />;
    case 'price_drop':
      return <DollarSign className="w-4 h-4 text-[#FF9900]" />;
    case 'scanner_start':
      return <Play className="w-4 h-4 text-[#3B82F6]" />;
    case 'scanner_stop':
      return <StopCircle className="w-4 h-4 text-[#9CA3AF]" />;
    case 'error':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Bell className="w-4 h-4 text-[#9CA3AF]" />;
  }
};

const getLogLabel = (type) => {
  switch (type) {
    case 'glitch':
      return { text: 'GLITCH FOUND', color: '#3B82F6' };
    case 'webhook':
      return { text: 'WEBHOOK SENT', color: '#5865F2' };
    case 'price_drop':
      return { text: 'PRICE DROP', color: '#FF9900' };
    case 'scanner_start':
      return { text: 'SCANNER STARTED', color: '#3B82F6' };
    case 'scanner_stop':
      return { text: 'SCANNER STOPPED', color: '#9CA3AF' };
    case 'error':
      return { text: 'ERROR', color: '#EF4444' };
    default:
      return { text: 'INFO', color: '#9CA3AF' };
  }
};

export function ActivityLog() {
  const { logs } = useApp();

  return (
    <div className="bg-[#1E2126] rounded-md border border-[#374151]">
      <div className="px-4 py-3 border-b border-[#374151]">
        <h3 className="text-sm font-medium text-white">Activity Log</h3>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 400px)' }}>
        <div className="divide-y divide-[#374151]">
          {logs.length === 0 ? (
            <div className="px-4 py-8 text-center text-[#9CA3AF]">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No activity yet</p>
              <p className="text-xs mt-1">Start the scanner to see activity</p>
            </div>
          ) : (
            logs.map((log) => {
              const label = getLogLabel(log.type);
              return (
                <div key={log.id} className="px-4 py-3 hover:bg-[#0F1115]/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {getLogIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{log.message}</p>
                      <p className="text-xs text-[#9CA3AF] mt-1 font-mono">
                        {formatLogTime(log.timestamp)}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span 
                        className="text-xs font-medium uppercase"
                        style={{ color: label.color }}
                      >
                        {label.text}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityLog;
