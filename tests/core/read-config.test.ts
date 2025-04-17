import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { readNodemonHmrSyncConfig } from '../../src/core/read-config';

vi.mock('fs');
vi.mock('path', () => ({
  resolve: vi.fn(),
}));

describe('readNodemonHmrSyncConfig', () => {
  const mockConfigPath = '/mocked/path/nodemon.json';

  beforeEach(() => {
    vi.clearAllMocks();
    (resolve as Mock).mockReturnValue(mockConfigPath);
  });

  it('should return hmrSync options when nodemon.json is valid', () => {
    const mockConfig = JSON.stringify({ hmrSync: { enabled: true } });
    (readFileSync as Mock).mockReturnValue(mockConfig);

    const result = readNodemonHmrSyncConfig();

    expect(resolve).toHaveBeenCalledWith(process.cwd(), 'nodemon.json');
    expect(readFileSync).toHaveBeenCalledWith(mockConfigPath, 'utf-8');
    expect(result).toEqual({ enabled: true });
  });

  it('should return an empty object when hmrSync is not defined in nodemon.json', () => {
    const mockConfig = JSON.stringify({});
    (readFileSync as Mock).mockReturnValue(mockConfig);

    const result = readNodemonHmrSyncConfig();

    expect(resolve).toHaveBeenCalledWith(process.cwd(), 'nodemon.json');
    expect(readFileSync).toHaveBeenCalledWith(mockConfigPath, 'utf-8');
    expect(result).toEqual({});
  });

  it('should return an empty object and log a warning when reading nodemon.json fails', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    (readFileSync as Mock).mockImplementation(() => {
      throw new Error('File not found');
    });

    const result = readNodemonHmrSyncConfig();

    expect(resolve).toHaveBeenCalledWith(process.cwd(), 'nodemon.json');
    expect(readFileSync).toHaveBeenCalledWith(mockConfigPath, 'utf-8');
    expect(consoleWarnSpy).toHaveBeenCalledWith('[vite-plugin-hmr-sync] Failed to read nodemon.json config');
    expect(result).toEqual({});
  });
});
