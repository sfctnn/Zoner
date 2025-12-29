import { useLocalStorage } from './useLocalStorage';

const SETTINGS_KEY = 'zoner_settings';

const defaultSettings = {
  scanInterval: 30000, // 30 seconds
  discordWebhookUrl: '',
  notifyOnDeal: true,
  notifyOnPriceDrop: false,
  discountThreshold: 50, // 50% discount qualifies as deal
};

/**
 * App settings hook with localStorage persistence
 */
export function useSettings() {
  const [settings, setSettings] = useLocalStorage(SETTINGS_KEY, defaultSettings);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const setScanInterval = (interval) => {
    updateSetting('scanInterval', interval);
  };

  const setDiscordWebhookUrl = (url) => {
    updateSetting('discordWebhookUrl', url);
  };

  const setNotifyOnDeal = (enabled) => {
    updateSetting('notifyOnDeal', enabled);
  };

  const setNotifyOnPriceDrop = (enabled) => {
    updateSetting('notifyOnPriceDrop', enabled);
  };

  const setDiscountThreshold = (threshold) => {
    updateSetting('discountThreshold', threshold);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return {
    settings,
    updateSetting,
    setScanInterval,
    setDiscordWebhookUrl,
    setNotifyOnDeal,
    setNotifyOnPriceDrop,
    setDiscountThreshold,
    resetSettings,
  };
}

export default useSettings;
