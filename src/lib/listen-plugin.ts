import type { Plugin, ViteDevServer } from 'vite';

import { IListenOptions } from './interface/listen.interface';

/**
 * Vite plugin to listen for rebuild signals from a child process.
 *
 * @export
 * @param {IListenOptions} [options={}]
 * @return {*}  {Plugin}
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
