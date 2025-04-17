export interface INotifyOptions {
  /**
   * Name of the app to notify the host server about.
   *
   * @type {string}
   * @memberof INotifyOptions
   */
  appName: string;

  /**
   * Host URL to notify when a child process rebuilds.
   *
   * @type {string}
   * @memberof INotifyOptions
   */
  hostUrl?: string;

  /**
   * Optional: Custom endpoint to notify the host server.
   *
   * @type {string}
   * @memberof INotifyOptions
   */
  endpoint?: string;

  /**
   * Optional: HTTP method to use for the notification.
   *
   * @type {('GET' | 'POST')}
   * @memberof INotifyOptions
   */
  method?: 'GET' | 'POST';

  /**
   * Optional: Whether to notify the host server only on successful builds.
   *
   * @type {boolean}
   * @memberof INotifyOptions
   */
  notifyOnSuccessOnly?: boolean;

  /**
   * Optional: Suppress logs for unlisted apps.
   *
   * @type {boolean}
   * @memberof INotifyOptions
   */
  suppressLogs?: boolean;
}
