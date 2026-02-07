import { Composio } from 'composio-core';

// Initialize Composio client
function getComposioClient() {
  const apiKey = process.env.COMPOSIO_API_KEY;
  
  if (!apiKey) {
    console.error('Composio API key missing');
    throw new Error('Missing Composio API key. Please set COMPOSIO_API_KEY in your environment variables.');
  }
  
  return new Composio(apiKey);
}

export interface PoliceIncident {
  id: string;
  name: string | null;
  priority: 'low' | 'medium' | 'high' | 'critical' | null;
  lat: number | null;
  lon: number | null;
  containment: number | null;
  last_update: string;
  description?: string | null;
  incident_type?: string | null;
}

// Keep FireIncident for backward compatibility
export type FireIncident = PoliceIncident;

export interface TelegramMessageOptions {
  chatId: string;
  incident: PoliceIncident | FireIncident;
  customMessage?: string;
}

/**
 * Generate emergency alert message for police incident (Telegram formatted)
 */
export function generatePoliceAlertMessageTelegram(incident: PoliceIncident | FireIncident, customMessage?: string): string {
  if (customMessage) {
    return customMessage;
  }

  // Support both 'risk' (fire) and 'priority' (police) fields
  const priorityLevel = (incident as any).priority || (incident as any).risk || 'unknown';
  const incidentName = incident.name || 'Unnamed Incident';
  const containment = incident.containment || 0;
  const incidentType = (incident as PoliceIncident).incident_type || 'incident';
  const coordinates = incident.lat && incident.lon 
    ? `${incident.lat.toFixed(2)}°N, ${Math.abs(incident.lon).toFixed(2)}°W`
    : 'Location TBD';
  
  const timestamp = new Date(incident.last_update).toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Get priority emoji
  const priorityEmoji = 
    priorityLevel === 'critical' ? '🚨🚨' :
    priorityLevel === 'high' ? '🚨⚠️' :
    priorityLevel === 'medium' ? '⚠️🚨' :
    '🟡';

  // Get urgency message based on priority
  const urgencyMessage =
    priorityLevel === 'critical' ? '⚠️ *CRITICAL ALERT* - Immediate response required!' :
    priorityLevel === 'high' ? '⚠️ *HIGH PRIORITY* - Rapid response needed!' :
    priorityLevel === 'medium' ? '⚠️ Medium priority - Standard response' :
    'ℹ️ Low priority - Routine response';

  // Format with Telegram markdown
  return `${priorityEmoji} *POLICE DISPATCH ALERT*

${urgencyMessage}

🚨 *Active Police Incident*

*Incident:* ${incidentName}
*Type:* ${incidentType}
*Priority:* ${priorityLevel.toUpperCase()}
*Location:* ${coordinates}
*Status:* ${containment > 0 ? `${containment}% resolved` : 'Active'}

${incident.description ? `\n📋 *Details:* ${incident.description}\n` : ''}
🚓 *Police Dispatch Control Center*
📞 Units responding - Avoid area if possible`;
}

// Keep old function name for backward compatibility
export const generateFireAlertMessageTelegram = generatePoliceAlertMessageTelegram;

/**
 * Send Telegram message using Composio
 */
export async function sendTelegramMessage(options: TelegramMessageOptions): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  try {
    // Log environment variable status for debugging
    console.log('Composio Telegram Environment Variables Check:', {
      hasComposioApiKey: !!process.env.COMPOSIO_API_KEY,
      hasTelegramBotToken: !!process.env.TELEGRAM_BOT_TOKEN,
      hasTelegramChatId: !!process.env.TELEGRAM_CHAT_ID,
    });

    // Validate required environment variables
    if (!process.env.COMPOSIO_API_KEY) {
      throw new Error('Missing COMPOSIO_API_KEY. Please set it in your environment variables.');
    }

    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('Missing TELEGRAM_BOT_TOKEN. Please create a bot with @BotFather on Telegram.');
    }

    // Generate the alert message with Telegram formatting
    const message = generatePoliceAlertMessageTelegram(options.incident, options.customMessage);

    // For now, let's use the Telegram Bot API directly since Composio entity is having issues
    // This bypasses Composio and uses direct Telegram API
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      throw new Error('Missing TELEGRAM_BOT_TOKEN');
    }

    console.log('Sending Telegram message directly via Bot API...', {
      chatId: options.chatId,
      messageLength: message.length,
    });

    // Send directly to Telegram Bot API
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: options.chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const result = await response.json();
    
    if (!response.ok || !result.ok) {
      throw new Error(`Telegram API error: ${result.description || 'Unknown error'}`);
    }

    console.log('Telegram message sent successfully:', result);
    
    return {
      success: true,
      messageId: result?.result?.message_id?.toString() || 'success',
    };
  } catch (error) {
    console.error('Failed to send Telegram message via Composio:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Send emergency alert to configured Telegram chat using Composio
 */
export async function sendEmergencyAlertViaTelegram(
  incident: PoliceIncident | FireIncident, 
  customMessage?: string
): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  // Get Telegram chat ID from env (your user ID or group chat ID)
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!chatId) {
    return {
      success: false,
      error: 'TELEGRAM_CHAT_ID not configured. Please set it in your environment variables.',
    };
  }
  
  return sendTelegramMessage({
    chatId,
    incident,
    customMessage,
  });
}

/**
 * Send alert to multiple Telegram chats (optional - for future use)
 */
export async function sendEmergencyAlertToMultipleChats(
  incident: PoliceIncident | FireIncident,
  chatIds: string[],
  customMessage?: string
): Promise<{
  success: boolean;
  results: Array<{ chatId: string; success: boolean; messageId?: string; error?: string }>;
}> {
  const results = await Promise.all(
    chatIds.map(async (chatId) => {
      const result = await sendTelegramMessage({ chatId, incident, customMessage });
      return { chatId, ...result };
    })
  );

  const allSuccess = results.every((r) => r.success);

  return {
    success: allSuccess,
    results,
  };
}

