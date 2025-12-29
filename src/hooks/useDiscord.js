import { useState, useCallback } from 'react';
import { getAmazonUrl, calculateDiscount } from '../data/mockProducts';

/**
 * Discord webhook integration hook
 */
export function useDiscord(webhookUrl) {
  const [isSending, setIsSending] = useState(false);
  const [lastError, setLastError] = useState(null);

  /**
   * Send a rich embed notification to Discord
   */
  const sendNotification = useCallback(async (product, customMessage = null) => {
    if (!webhookUrl) {
      setLastError('No webhook URL configured');
      return { success: false, error: 'No webhook URL configured' };
    }

    setIsSending(true);
    setLastError(null);

    const discount = calculateDiscount(product.currentPrice, product.originalPrice);
    const amazonUrl = getAmazonUrl(product.asin);

    const embed = {
      title: '💰 Deal Alert!',
      description: product.title,
      url: amazonUrl,
      color: 0x3B82F6, // Professional blue
      thumbnail: {
        url: product.image,
      },
      fields: [
        {
          name: '💰 Current Price',
          value: `**$${product.currentPrice.toFixed(2)}**`,
          inline: true,
        },
        {
          name: '📉 Discount',
          value: `**-${discount}%**`,
          inline: true,
        },
        {
          name: '🎯 Target Price',
          value: `$${product.targetPrice.toFixed(2)}`,
          inline: true,
        },
        {
          name: '📦 ASIN',
          value: `\`${product.asin}\``,
          inline: true,
        },
        {
          name: '🏷️ Category',
          value: product.category,
          inline: true,
        },
      ],
      footer: {
        text: 'Zoner • Price Tracker',
      },
      timestamp: new Date().toISOString(),
    };

    const payload = {
      username: 'Zoner',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      content: customMessage || '🚨 **Price Alert!** A price drop has been detected!',
      embeds: [embed],
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Discord API error: ${response.status} - ${errorText}`);
      }

      setIsSending(false);
      return { success: true };
    } catch (error) {
      setIsSending(false);
      setLastError(error.message);
      return { success: false, error: error.message };
    }
  }, [webhookUrl]);

  /**
   * Send a test notification to verify webhook works
   */
  const testWebhook = useCallback(async () => {
    if (!webhookUrl) {
      setLastError('No webhook URL configured');
      return { success: false, error: 'No webhook URL configured' };
    }

    setIsSending(true);
    setLastError(null);

    const payload = {
      username: 'Zoner',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      embeds: [
        {
          title: '✅ Webhook Connected!',
          description: 'Zoner is successfully connected to this channel.',
          color: 0x5865F2, // Discord Blurple
          fields: [
            {
              name: 'Status',
              value: 'Ready to receive price alerts',
              inline: false,
            },
          ],
          footer: {
            text: 'Zoner • Test Message',
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Discord API error: ${response.status} - ${errorText}`);
      }

      setIsSending(false);
      return { success: true };
    } catch (error) {
      setIsSending(false);
      setLastError(error.message);
      return { success: false, error: error.message };
    }
  }, [webhookUrl]);

  return {
    sendNotification,
    testWebhook,
    isSending,
    lastError,
  };
}

export default useDiscord;
