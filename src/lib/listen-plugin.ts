import type { Plugin, ViteDevServer } from 'vite';

import { IListenOptions } from './interface/listen.interface';

/**
 * Listens for remote rebuild signals and triggers a Hot Module Replacement (HMR) reload
 * in a Vite development server. This plugin is useful for synchronizing rebuilds across
 * multiple applications or environments.
 *
 * @param options - Configuration options for the plugin.
 * @param options.onRebuild - Optional callback function invoked after a rebuild is triggered.
 * @param options.endpoint - The HTTP endpoint to listen for rebuild signals. Defaults to `'/on-child-rebuild'`.
 * @param options.hotPayload - The payload sent to the Vite WebSocket server to trigger HMR. Defaults to `{ type: 'full-reload', path: '*' }`.
 * @param options.allowedApps - An optional array of app names allowed to trigger rebuilds. If specified, rebuilds from unlisted apps are ignored.
 * @param options.suppressLogs - Whether to suppress log messages. Defaults to `false`.
 *
 * @returns A Vite plugin object that listens for remote rebuild signals.
 *
 * @example
 * ```typescript
 * import { listenForRemoteRebuilds } from './listen-plugin';
 *
 * export default defineConfig({
 *   plugins: [
 *     listenForRemoteRebuilds({
 *       endpoint: '/custom-endpoint',
 *       allowedApps: ['app1', 'app2'],
 *       onRebuild: (appName, server) => {
 *         console.log(`Rebuild triggered by ${appName}`);
 *       }
 *     })
 *   ]
 * });
 * ```
 */
export function listenForRemoteRebuilds(options: IListenOptions = {}): Plugin {
  const {
    onRebuild,
    endpoint = '/on-child-rebuild',
    hotPayload = { type: 'full-reload', path: '*' },
    allowedApps,
    suppressLogs = false
  } = options;

  const pluginName = 'vite-plugin-listen-for-remote-rebuilds';

  return {
    name: pluginName,
    configureServer(server: ViteDevServer) {
      server.middlewares.use(endpoint, (req, res) => {
        try {
          const url = new URL(req.url || '', 'http://localhost');
          const appName = url.searchParams.get('app') || 'unknown';

          if (Array.isArray(allowedApps) && !allowedApps.includes(appName)) {
            if (!suppressLogs) {
              console.warn(`[${pluginName}] ⚠️ Rebuild from unlisted app "${appName}" ignored.`);
            }

            // Respond with 403 Forbidden if the app is not allowed
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end(`[${pluginName}] App "${appName}" not allowed`);
            return;
          }

          if (!suppressLogs) {
            console.log(`🔁 [${pluginName}] Received rebuild signal from "${appName}"`);
          }

          // Trigger HMR reload
          server.ws.send(hotPayload);

          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(`[${pluginName}] Reload triggered`);

          // Optional hook after rebuild is triggered
          if (onRebuild) {
            onRebuild(appName, server);
          }
          return;
        } catch (err) {
          if (!suppressLogs) {
            console.error(`[${pluginName}] ❌ Error handling request:`, err);
          }
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`[${pluginName}] Internal error`);
          return;
        }
      });
    }
  };
}
