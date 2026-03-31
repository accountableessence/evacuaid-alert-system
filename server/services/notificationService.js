import { messaging } from '../firebase.js';

/**
 * Sends a push notification via Firebase Cloud Messaging
 * @param {string} topic - The topic to broadcast to (e.g. 'zone_A_alerts')
 * @param {string} title - The notification title
 * @param {string} body - The notification body text
 * @param {object} data - Optional data payload
 */
export const broadcastAlert = async (topic, title, body, data = {}) => {
  if (!messaging) {
    console.warn("FCM messaging is not initialized. Skipping push notification:", { topic, title });
    return;
  }

  const message = {
    notification: {
      title,
      body,
    },
    data,
    topic,
  };

  try {
    const response = await messaging.send(message);
    console.log(`📢 Successfully sent alert to topic '${topic}'. Message ID:`, response);
    return response;
  } catch (error) {
    console.error(`🚨 Error sending FCM to topic '${topic}':`, error.message);
    throw error;
  }
};
