import type { Plugin, ViteDevServer } from 'vite';

import { Logger } from './utils/logger';
import { version } from '../package.json';
import { sendNotification } from './core/build-notifier';
import { normalizeListenOptions, normalizeNotifyOptions } from './core/build-context';
import { handleRemoteRebuildRequest } from './core/host-handler';
import type { INotifyOptions, IListenOptions, IListenNormalizeOptions } from './interface';
import {
  VITE_PLUGIN_NOTIFY_ON_REBUILD,
  VITE_PLUGIN_LISTEN_FOR_REMOTE_REBUILDS,
  VITE_PLUGIN_LISTEN_FOR_REMOTE_REBUILDS_ERROR
} from './utils/constants';
import { Api } from './interface/plugin.interface';

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
 * 
 * export default defineConfig({
 *   plugins: [
 *     notifyOnRebuild('my-app'), // Using string shorthand for appName
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
export function notifyOnRebuild(appName: string): Plugin<Api<INotifyOptions>>
export function notifyOnRebuild(options: INotifyOptions): Plugin<Api<INotifyOptions>>
export function notifyOnRebuild(options: string | INotifyOptions): Plugin<Api<INotifyOptions>> {
  let opts: ReturnType<typeof normalizeNotifyOptions>;

  try {
    opts = normalizeNotifyOptions(options);
  } catch (err) {
    Logger('unknown').error(`[${VITE_PLUGIN_NOTIFY_ON_REBUILD}] ❌`, err);
    return { name: VITE_PLUGIN_LISTEN_FOR_REMOTE_REBUILDS_ERROR };
  }

  return {
    api: {
      get options () {
        return opts
      },
      version
    },
    enforce: 'post',
    name: VITE_PLUGIN_NOTIFY_ON_REBUILD,
    buildEnd(error) {
      sendNotification(opts, error);
    },
  };
}

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
export function listenForRemoteRebuilds(options: IListenOptions = {}): Plugin<Api<IListenNormalizeOptions>> {
  const opts = normalizeListenOptions(options);

  const { hotPayload, endpoint } = opts;

  return {
    api: {
      get options() {
        return opts
      },
      version
    },
    enforce: 'post',
    name: VITE_PLUGIN_LISTEN_FOR_REMOTE_REBUILDS,
    configureServer(server: ViteDevServer) {
      server.middlewares.use(opts.endpoint, (req, res) => {
        handleRemoteRebuildRequest(
          server,
          req,
          res,
          { ...options, hotPayload, endpoint },
          VITE_PLUGIN_LISTEN_FOR_REMOTE_REBUILDS
        );
      });
    }
  };
}
