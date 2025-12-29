import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const ACTIVITY_KEY = 'zoner_activity';
const MAX_LOG_ENTRIES = 100;

/**
 * Activity log management hook
 */
export function useActivityLog() {
  // Start with empty array for production (no mock data)
  const [logs, setLogs] = useLocalStorage(ACTIVITY_KEY, []);

  // Add a new log entry
  const addLog = useCallback((type, message) => {
    const newEntry = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toISOString(),
    };

    setLogs((prev) => {
      const updated = [newEntry, ...prev];
      // Keep only the last MAX_LOG_ENTRIES
      return updated.slice(0, MAX_LOG_ENTRIES);
    });

    return newEntry;
  }, [setLogs]);

  // Convenience methods for different log types
  const logDeal = useCallback((productTitle, discount) => {
    return addLog('deal', `Price drop detected: ${productTitle} - ${discount}% off`);
  }, [addLog]);

  const logPriceDrop = useCallback((productTitle, discount) => {
    return addLog('price_drop', `Price drop detected: ${productTitle} - ${discount}% off`);
  }, [addLog]);

  const logWebhookSent = useCallback((webhookName = 'Discord') => {
    return addLog('webhook', `Notification sent to "${webhookName}"`);
  }, [addLog]);

  const logTrackerStart = useCallback((productCount) => {
    return addLog('tracker_start', `Price tracker started - monitoring ${productCount} products`);
  }, [addLog]);

  const logTrackerStop = useCallback(() => {
    return addLog('tracker_stop', 'Price tracker stopped');
  }, [addLog]);

  const logError = useCallback((message) => {
    return addLog('error', message);
  }, [addLog]);

  // Clear all logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, [setLogs]);

  return {
    logs,
    addLog,
    logDeal,
    logPriceDrop,
    logWebhookSent,
    logTrackerStart,
    logTrackerStop,
    logError,
    clearLogs,
  };
}

export default useActivityLog;
