import type { Plugin } from 'vite';
import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

import { INotifyOptions } from './interface/notify.interface';

/**
 * Vite plugin to notify the host server when a child process rebuilds.
 *
 * @export
 * @param {string | INotifyOptions} options - App name or options object.
 * @return {*}  {Plugin}
 */
export function notifyOnRebuild(appName: string): Plugin
export function notifyOnRebuild(options: INotifyOptions): Plugin
export function notifyOnRebuild(options: string | INotifyOptions): Plugin {
  const {
    appName,
    hostUrl = 'http://127.0.0.1:9000',
    endpoint = '/on-child-rebuild',
    method = 'GET',
    notifyOnSuccessOnly = true,
    suppressLogs = false,
  } = typeof options === 'string' ? { appName: options } : options;

  const pluginName = 'vite-plugin-notify-on-rebuild';

  if (!appName) {
    if (!suppressLogs) {
      console.error(`[${pluginName}] ❌ Error: 'appName' option is required.`);
    }

    return { name: `${pluginName}-error` };
  }

  return {
    name: pluginName,
    buildEnd(error) {
      const skip = error && notifyOnSuccessOnly;

      if (skip) {
        if (!suppressLogs) {
          console.error(`[${pluginName}][${appName}] ❌ Build failed, skipping notification.`, error.message || error);
        }
        return;
      }

      if (!suppressLogs) {
        if (error) {
          console.warn(`[${pluginName}][${appName}] ⚠️ Build ended with an error, notifying host...`);
        } else {
          console.info(`[${pluginName}][${appName}] ✅ Build successful, notifying host...`);
        }
      }
      
      let targetUrl: URL;
      const fullUrl = `${hostUrl}${endpoint}?app=${encodeURIComponent(appName)}`;

      try {
        targetUrl = new URL(fullUrl);
      } catch (err) {
        if (!suppressLogs) {
          console.error(`[${pluginName}][${appName}] ❌ Invalid URL: "${fullUrl}"`, err);
        }
        return;
      }

      const requester = targetUrl.protocol === 'https:' ? https : http;
      const requestOptions: http.RequestOptions = {
        method: method.toUpperCase(),
        hostname: targetUrl.hostname,
        port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
        path: targetUrl.pathname + targetUrl.search,
        headers: {
          'User-Agent': `${pluginName}/${appName}`,
        }
      };

      if (!suppressLogs) {
        console.log(`[${pluginName}][${appName}] 🔔 Sending ${method.toUpperCase()} request to ${targetUrl.href}`);
      }

      const req = requester.request(requestOptions, (res) => {
        let body = '';

        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          if (!suppressLogs) {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              console.log(`[${pluginName}][${appName}] ✅ Host notified (${res.statusCode})`);
            } else {
              console.warn(
                `[${pluginName}][${appName}] ⚠️ Host responded with ${res.statusCode}. Response: ${body.slice(0, 200)}${body.length > 200 ? '...' : ''}`
              );
            }
          }
        });
      });

      req.on('error', (err) => {
        if (!suppressLogs) {
          console.error(`[${pluginName}][${appName}] ❌ Notification failed:`, err);
        }
      });

      req.end();
    },
  };
}
