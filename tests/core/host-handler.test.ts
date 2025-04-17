import type { ViteDevServer } from 'vite';
import { describe, it, vi, expect, afterEach, beforeEach } from 'vitest';

import { DEFAULT_HOT_PAYLOAD } from '../../src/utils/constants';
import { handleRemoteRebuildRequest } from '../../src/core/host-handler';
import type { IListenOptions } from '../../src/interface/listen.interface';
import { Logger } from '../../src/utils/logger';

const mockLogger = {
  log: vi.fn(),
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn()
};

// Mock the logger module to always return the shared mockLogger
vi.mock('../../src/utils/logger', () => ({
  Logger: vi.fn(() => mockLogger)
}));

describe('handleRemoteRebuildRequest', () => {
  let mockLogger: ReturnType<typeof Logger>;
  const mockServer = {
    ws: {
      send: vi.fn(),
    },
  } as unknown as ViteDevServer;

  const mockReq = {
    url: '/?app=testApp',
    headers: {
      host: 'localhost:3000'
    }
  };

  const mockRes = {
    writeHead: vi.fn(),
    end: vi.fn(),
  };

  const pluginName = 'vite-plugin-hmr-sync';

  beforeEach(() => {
    mockLogger = vi.mocked(Logger('host'), { partial: true });
  })

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should trigger a rebuild and send hot payload when app is allowed', () => {
    const options: IListenOptions = {
      allowedApps: ['testApp'],
      onRebuild: vi.fn(),
    };

    handleRemoteRebuildRequest(mockServer, mockReq, mockRes, options, pluginName);

    expect(mockServer.ws.send).toHaveBeenCalledWith(DEFAULT_HOT_PAYLOAD);
    expect(mockRes.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': 'text/plain' });
    expect(mockRes.end).toHaveBeenCalledWith(`[${pluginName}] Reload triggered`);
    expect(options.onRebuild).toHaveBeenCalledWith('testApp', mockServer);
  });

  it('should reject rebuild when app is not allowed', () => {
    const options: IListenOptions = {
      allowedApps: ['anotherApp'],
    };

    handleRemoteRebuildRequest(mockServer, mockReq, mockRes, options, pluginName);

    expect(mockServer.ws.send).not.toHaveBeenCalled();
    expect(mockRes.writeHead).toHaveBeenCalledWith(403, { 'Content-Type': 'text/plain' });
    expect(mockRes.end).toHaveBeenCalledWith(`[${pluginName}] App "testApp" not allowed`);
  });

  it('should handle errors gracefully', () => {
    const options: IListenOptions = {};
    const faultyReq = { url: 'INVALID URL' }; // Invalid URL to trigger an error

    handleRemoteRebuildRequest(mockServer, faultyReq, mockRes, options, pluginName);

    expect(mockServer.ws.send).not.toHaveBeenCalled();
    expect(mockRes.writeHead).toHaveBeenCalledWith(500, { 'Content-Type': 'text/plain' });
    expect(mockRes.end).toHaveBeenCalledWith(`[${pluginName}] Internal error`);
  });

  it('should log warnings when suppressLogs is false', () => {
    const options: IListenOptions = {
      allowedApps: ['anotherApp'],
      suppressLogs: false,
    };

    const loggerSpy = vi.spyOn(mockLogger, 'warn').mockImplementation(() => {});

    handleRemoteRebuildRequest(mockServer, mockReq, mockRes, options, pluginName);

    expect(loggerSpy).toHaveBeenCalledWith(`[${pluginName}] ⚠️ Rebuild from unlisted app "testApp" ignored.`);
    loggerSpy.mockRestore();
  });

  it('should not log warnings when suppressLogs is true', () => {
    const options: IListenOptions = {
      allowedApps: ['anotherApp'],
      suppressLogs: true,
    };

    const loggerSpy = vi.spyOn(mockLogger, 'warn').mockImplementation(() => {});

    handleRemoteRebuildRequest(mockServer, mockReq, mockRes, options, pluginName);

    expect(loggerSpy).not.toHaveBeenCalled();
    loggerSpy.mockRestore();
  });
});
