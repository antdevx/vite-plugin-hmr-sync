import { VITE_PLUGIN_NOTIFY_ON_REBUILD } from "./constants";

export function Logger(appName: string, suppress: boolean = false) {
  const prefix = `[${VITE_PLUGIN_NOTIFY_ON_REBUILD}][${appName}]`;

  return {
    log: (msg: string) => !suppress && console.log(`${prefix} ${msg}`),
    info: (msg: string) => !suppress && console.info(`${prefix} ${msg}`),
    warn: (msg: string) => !suppress && console.warn(`${prefix} ${msg}`),
    error: (msg: string, err?: unknown) => !suppress && console.error(`${prefix} ${msg}`, err),
  };
}
