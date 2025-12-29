import React, { createContext, useContext, useCallback } from 'react';
import { useProducts, useSettings, useActivityLog, useScanner, useDiscord } from '../hooks';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Core state hooks
  const productsHook = useProducts();
  const settingsHook = useSettings();
  const activityHook = useActivityLog();
  
  // Discord hook using webhook URL from settings
  const discordHook = useDiscord(settingsHook.settings.discordWebhookUrl);

  // Handle deal detection
  const handleDealFound = useCallback((product, newPrice, discount) => {
    activityHook.logDeal(product.title, discount);
    
    // Send Discord notification if enabled
    if (settingsHook.settings.notifyOnDeal && settingsHook.settings.discordWebhookUrl) {
      discordHook.sendNotification({ ...product, currentPrice: newPrice }).then((result) => {
        if (result.success) {
          activityHook.logWebhookSent('Main Alerts');
        } else {
          activityHook.logError(`Webhook failed: ${result.error}`);
        }
      });
    }
  }, [activityHook, discordHook, settingsHook.settings]);

  // Handle price updates
  const handlePriceUpdate = useCallback((productId, newPrice) => {
    productsHook.updatePrice(productId, newPrice);
  }, [productsHook]);

  // Scanner hook with callbacks
  const scannerHook = useScanner({
    products: productsHook.products,
    settings: settingsHook.settings,
    onDealFound: handleDealFound,
    onPriceUpdate: handlePriceUpdate,
  });

  // Extended scanner controls with logging
  const startScanner = useCallback(() => {
    scannerHook.start();
    activityHook.logTrackerStart(productsHook.stats.monitoringCount);
  }, [scannerHook, activityHook, productsHook.stats.monitoringCount]);

  const stopScanner = useCallback(() => {
    scannerHook.stop();
    activityHook.logTrackerStop();
  }, [scannerHook, activityHook]);

  const value = {
    // Products
    products: productsHook.products,
    sortedProducts: productsHook.sortedProducts,
    stats: productsHook.stats,
    addProduct: productsHook.addProduct,
    removeProduct: productsHook.removeProduct,
    toggleStar: productsHook.toggleStar,
    togglePause: productsHook.togglePause,
    updateTargetPrice: productsHook.updateTargetPrice,
    
    // Settings
    settings: settingsHook.settings,
    setScanInterval: settingsHook.setScanInterval,
    setDiscordWebhookUrl: settingsHook.setDiscordWebhookUrl,
    setNotifyOnDeal: settingsHook.setNotifyOnDeal,
    setNotifyOnPriceDrop: settingsHook.setNotifyOnPriceDrop,
    resetSettings: settingsHook.resetSettings,
    
    // Scanner
    isScanning: scannerHook.isRunning,
    lastScanTime: scannerHook.lastScanTime,
    scanCount: scannerHook.scanCount,
    startScanner,
    stopScanner,
    toggleScanner: () => scannerHook.isRunning ? stopScanner() : startScanner(),
    
    // Activity
    logs: activityHook.logs,
    clearLogs: activityHook.clearLogs,
    
    // Discord
    testWebhook: discordHook.testWebhook,
    isSendingWebhook: discordHook.isSending,
    webhookError: discordHook.lastError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
