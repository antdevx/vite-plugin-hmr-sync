import type { HotPayload, ViteDevServer } from 'vite';
import type { IListenOptions } from '../interface/listen.interface';
import { DEFAULT_HOT_PAYLOAD } from '../utils/constants';
import { Logger } from '../../src/utils/logger';

/**
 * Handles incoming requests to trigger a rebuild in the Vite server.
 *
 * @export
 * @param {ViteDevServer} server
 * @param {*} req
 * @param {*} res
 * @param {IListenOptions} options
 * @param {string} pluginName
 * @return {*}  {void}
 */
export function handleRemoteRebuildRequest(
  server: ViteDevServer,
  req: any,
  res: any,
  options: IListenOptions,
  pluginName: string
): void {
  const {
    onRebuild,
    hotPayload = DEFAULT_HOT_PAYLOAD as HotPayload,
    allowedApps,
    suppressLogs = false
  } = options;

  const logger = Logger('host', suppressLogs);

  try {
    const baseUrl = req.headers.host ? `http://${req.headers.host}` : 'http://localhost';
    const url = new URL(req.url || '', baseUrl);
    const appName = url.searchParams.get('app') || 'unknown';

    if (Array.isArray(allowedApps) && !allowedApps.includes(appName)) {
      if (!suppressLogs) {
        logger.warn(`[${pluginName}] ⚠️ Rebuild from unlisted app "${appName}" ignored.`);
      }

      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end(`[${pluginName}] App "${appName}" not allowed`);
      return;
    }

    if (!suppressLogs) {
      logger.log(`🔁 [${pluginName}] Received rebuild signal from "${appName}"`);
    }

    server.ws.send(hotPayload);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`[${pluginName}] Reload triggered`);

    onRebuild?.(appName, server);
  } catch (err) {
    if (!suppressLogs) {
      logger.error(`[${pluginName}] ❌ Error handling request:`, err);
    }
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`[${pluginName}] Internal error`);
    return;
  }
}
