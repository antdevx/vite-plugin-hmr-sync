import { HotPayload } from 'vite';

import { IStartServerOptions } from '../interface/build.interface';
import type { IListenNormalizeOptions, IListenOptions, INotifyOptions } from '../interface';
import { DEFAULT_HOT_PAYLOAD, DEFAULT_LISTEN_ENDPOINT } from '../utils/constants';

/**
 * Normalizes the options for the notification system.
 *
 * @export
 * @param {(string | INotifyOptions)} options
 * @return {*}  {Required<INotifyOptions>}
 */
export function normalizeNotifyOptions(options: string | INotifyOptions): Required<INotifyOptions> {
  const base = typeof options === 'string' ? { appName: options } : options;

  if (!base.appName) {
    throw new Error("`appName` is required");
  }

  return {
    appName: base.appName,
    hostUrl: base.hostUrl || 'http://localhost:5000',
    endpoint: base.endpoint || '/on-child-rebuild',
    method: base.method || 'GET',
    notifyOnSuccessOnly: base.notifyOnSuccessOnly ?? true,
    suppressLogs: base.suppressLogs ?? false,
  };
}

/**
 * Normalizes the options for the listen system.
 *
 * @export
 * @param {IListenOptions} options
 * @return {*}  {IListenOptions}
 */
export function normalizeListenOptions(options: IListenOptions): IListenNormalizeOptions{
  const { endpoint, hotPayload, allowedApps, onRebuild, suppressLogs } = options;

  return {
    hotPayload: hotPayload || DEFAULT_HOT_PAYLOAD as HotPayload,
    endpoint: endpoint || DEFAULT_LISTEN_ENDPOINT,
    onRebuild,
    allowedApps: allowedApps || [],
    suppressLogs: suppressLogs || false,
  };
}

/**
 * Creates a build and serve context with default values.
 *
 * @export
 * @param {IStartServerOptions} options
 * @return {*}  {Required<IStartServerOptions>}
 */
export function createBuildAndServeContext(options: IStartServerOptions): Required<IStartServerOptions> {
  const {
    port = '5000',
    cors = true,
    cache = '0',
    notify = true,
    hostUrl = 'http://localhost:5000',
    appName = 'my-app',
    buildCommand = 'quasar build',
    serveCommand = 'quasar serve',
  } = options;

  return {
    port,
    cors,
    cache,
    notify,
    hostUrl,
    appName,
    buildCommand,
    serveCommand
  };
}