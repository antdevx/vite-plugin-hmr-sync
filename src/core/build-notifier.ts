import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

import { Logger } from '../utils/logger';
import type { INotifyOptions } from '../interface';

/**
 * Sends a notification to the specified host URL.
 *
 * @export
 * @param {Required<INotifyOptions>} options
 * @param {Error} [error]
 * @return {*} 
 */
export function sendNotification(options: Required<INotifyOptions>, error?: Error) {
  const { appName, hostUrl, endpoint, method, notifyOnSuccessOnly, suppressLogs } = options;
  const logger = Logger(appName, suppressLogs);

  if (notifyOnSuccessOnly && error) {
    logger.error(`Build failed, skipping notification.`, error?.message || error);
    return;
  }

  const fullUrl = `${hostUrl}${endpoint}?app=${encodeURIComponent(appName)}`;
  let targetUrl: URL;

  try {
    targetUrl = new URL(fullUrl);
  } catch (err) {
    logger.error(`Invalid URL: "${fullUrl}"`, err);
    return;
  }

  const requester = targetUrl.protocol === 'https:' ? https : http;
  const requestOptions: http.RequestOptions = {
    method: method.toUpperCase(),
    hostname: targetUrl.hostname,
    port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
    path: targetUrl.pathname + targetUrl.search,
    headers: {
      'User-Agent': `vite-plugin-notify-on-rebuild/${appName}`,
    },
  };

  logger.info(`🔔 Sending ${method.toUpperCase()} request to ${targetUrl.href}`);

  const req = requester.request(requestOptions, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
        logger.info(`✅ Host notified (${res.statusCode})`);
      } else {
        logger.warn(`⚠️ Host responded with ${res.statusCode}. Response: ${body.slice(0, 200)}${body.length > 200 ? '...' : ''}`);
      }
    });
  });

  req.on('error', (err) => logger.error(`Notification failed:`, err));
  req.end();
}
