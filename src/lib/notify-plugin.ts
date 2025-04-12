import type { Plugin } from 'vite';
import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

import { INotifyOptions } from './interface/notify.interface';

/**
 * A Vite plugin that sends a notification to a specified host when the build process ends.
 * The notification can be customized to trigger only on successful builds or on all builds.
 *
 * @param options - Configuration options for the plugin. Can be a string representing the `appName`
 *                  or an object implementing the `INotifyOptions` interface.
 * 
 * @returns A Vite plugin object with a `buildEnd` hook to handle notifications.
 *
 * @example
 * ```typescript
 * import { notifyOnRebuild } from './notify-plugin';
 *
 * export default defineConfig({
 *   plugins: [
 *     notifyOnRebuild({
 *       appName: 'my-app',
 *       hostUrl: 'http://localhost:9000',
 *       endpoint: '/notify',
 *       method: 'POST',
 *       notifyOnSuccessOnly: false,
 *       suppressLogs: true,
 *     }),
 *   ],
 * });
 * ```
 *
 * @remarks
 * - The `appName` option is required and identifies the application being built.
 * - If `notifyOnSuccessOnly` is `true`, notifications will only be sent for successful builds.
 * - Logs can be suppressed by setting `suppressLogs` to `true`.
 * - The plugin sends an HTTP or HTTPS request to the specified `hostUrl` and `endpoint`.
 *
 * @throws Will log an error if the `appName` is not provided or if the constructed URL is invalid.
 *
 * @param options.appName - The name of the application being built. (Required)
 * @param options.hostUrl - The base URL of the host to notify. Defaults to `'http://127.0.0.1:9000'`.
 * @param options.endpoint - The endpoint path to notify. Defaults to `'/on-child-rebuild'`.
 * @param options.method - The HTTP method to use for the notification. Defaults to `'GET'`.
 * @param options.notifyOnSuccessOnly - Whether to notify only on successful builds. Defaults to `true`.
 * @param options.suppressLogs - Whether to suppress logs in the console. Defaults to `false`.
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
