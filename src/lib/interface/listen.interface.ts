import { HotPayload, ViteDevServer } from "vite";

export interface IListenOptions {
  /**
   * Custom HMR payload to send to Vite clients
   */
  hotPayload?: HotPayload;

  /**
   * Endpoint to listen for rebuild signals
   * e.g. /on-child-rebuild
   */
  endpoint?: string;

  /**
   * Optional callback after rebuild is triggered
   */
  onRebuild?: (appName: string, server: ViteDevServer) => void;

  /**
   * Optional: Whitelist certain apps to receive rebuild signals
   *
   * @type {string[]}
   * @memberof IListenOptions
   */
  allowedApps?: string[];

  /**
   * Optional: Suppress logs for unlisted apps
   *
   * @type {boolean}
   * @memberof IListenOptions
   */
  suppressLogs?: boolean;
}
