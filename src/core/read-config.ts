import { readFileSync } from 'fs';
import { resolve } from 'path';

import { IStartServerOptions } from '../interface/build.interface';

/**
 * Reads the nodemon.json configuration file synchronously and returns the hmrSync options.
 *
 * @export
 * @return {*}  {IStartServerOptions}
 */
export function readNodemonHmrSyncConfig(): IStartServerOptions {
  const configPath = resolve(process.cwd(), 'nodemon.json');

  try {
    const raw = readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed.hmrSync || {};
  } catch (err) {
    console.warn('[vite-plugin-hmr-sync] Failed to read nodemon.json config');
    return {};
  }
}
