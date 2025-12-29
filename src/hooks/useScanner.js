import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateDiscount } from '../data/mockProducts';

/**
 * Background tracker hook that simulates price checking
 * In a real app, this would make API calls to fetch actual prices
 */
export function useScanner({ products, settings, onDealFound, onPriceUpdate }) {
  const [isRunning, setIsRunning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const intervalRef = useRef(null);

  /**
   * Check if product should trigger an alert based on v2.0 monitor config
   * Supports: target price trigger AND/OR discount threshold trigger
   */
  const shouldTriggerAlert = useCallback((product, newPrice) => {
    const config = product.monitorConfig;
    if (!config) {
      // Legacy fallback: use simple target price check
      return newPrice <= product.targetPrice;
    }

    const { targetPrice, discountThreshold, triggerLogic = 'OR' } = config;
    const originalPrice = product.originalPriceAtTrack || product.currentPrice;

    // Target price check: new price is at or below target
    const hitTargetPrice = targetPrice && newPrice <= targetPrice;

    // Discount threshold check: price dropped by X% from original tracking price
    let hitDiscountThreshold = false;
    if (discountThreshold && originalPrice > 0) {
      const discountPercent = ((originalPrice - newPrice) / originalPrice) * 100;
      hitDiscountThreshold = discountPercent >= discountThreshold;
    }

    // OR logic: either condition triggers
    if (triggerLogic === 'OR') {
      return hitTargetPrice || hitDiscountThreshold;
    }
    // AND logic: both conditions must be met
    return hitTargetPrice && hitDiscountThreshold;
  }, []);

  // Simulate price fluctuation (for demo purposes)
  const simulatePriceCheck = useCallback(() => {
    const activeProducts = products.filter((p) => p.status !== 'paused');
    
    activeProducts.forEach((product) => {
      // Random chance (20%) of price change
      if (Math.random() < 0.2) {
        // Fluctuate price by -30% to +10%
        const changePercent = (Math.random() * 40 - 30) / 100;
        const newPrice = Math.max(
          1,
          Math.round(product.currentPrice * (1 + changePercent) * 100) / 100
        );
        
        const shouldAlert = shouldTriggerAlert(product, newPrice);
        const discount = calculateDiscount(newPrice, product.originalPrice);
        
        if (onPriceUpdate) {
          onPriceUpdate(product.id, newPrice);
        }
        
        if (shouldAlert && onDealFound) {
          onDealFound(product, newPrice, discount);
        }
      }
    });

    setLastScanTime(new Date());
    setScanCount((prev) => prev + 1);
  }, [products, onDealFound, onPriceUpdate, shouldTriggerAlert]);

  // Start scanner
  const start = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsRunning(true);
    setLastScanTime(new Date());
    
    // Run immediately on start
    simulatePriceCheck();
    
    // Validate scan interval - must be a positive number within safe range
    const VALID_INTERVALS = [15000, 30000, 60000, 300000, 600000];
    const interval = VALID_INTERVALS.includes(settings?.scanInterval) 
      ? settings.scanInterval 
      : 30000; // Default to 30s if invalid
    
    // Then run at interval
    intervalRef.current = setInterval(simulatePriceCheck, interval);
  }, [simulatePriceCheck, settings?.scanInterval]);

  // Stop scanner
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  // Toggle scanner
  const toggle = useCallback(() => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  }, [isRunning, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update interval when settings change
  useEffect(() => {
    if (isRunning && settings?.scanInterval) {
      stop();
      start();
    }
  }, [settings?.scanInterval]);

  return {
    isRunning,
    lastScanTime,
    scanCount,
    start,
    stop,
    toggle,
  };
}

export default useScanner;
