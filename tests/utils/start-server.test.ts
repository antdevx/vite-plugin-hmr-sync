import { vi, describe, it, expect, beforeEach } from 'vitest';

import * as coreModule from '../../src/core';
import * as serverModule from '../../src/core/server';
import * as configModule from '../../src/core/read-config';
import { startBuildAndServer } from '../../src/start-server';

describe('startBuildAndServer', () => {
  let mockStartBuild: ReturnType<typeof vi.fn>;
  let mockStartServer: ReturnType<typeof vi.fn>;
  let mockReadConfig: ReturnType<typeof vi.fn>;
  let mockCreateContext: ReturnType<typeof vi.fn>;
  let mockNormalizeNotifyOptions: ReturnType<typeof vi.fn>;
  let mockSendNotification: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockStartBuild = vi.fn();
    mockStartServer = vi.fn();
    mockReadConfig = vi.fn();
    mockCreateContext = vi.fn();
    mockNormalizeNotifyOptions = vi.fn();
    mockSendNotification = vi.fn();

    vi.spyOn(serverModule, 'startBuild').mockImplementation(mockStartBuild);
    vi.spyOn(serverModule, 'startServer').mockImplementation(mockStartServer);
    vi.spyOn(configModule, 'readNodemonHmrSyncConfig').mockImplementation(mockReadConfig);
    vi.spyOn(coreModule, 'createBuildAndServeContext').mockImplementation(mockCreateContext);
    vi.spyOn(coreModule, 'normalizeNotifyOptions').mockImplementation(mockNormalizeNotifyOptions);
    vi.spyOn(coreModule, 'sendNotification').mockImplementation(mockSendNotification);
  });

  it('should start the build and server processes', async () => {
    const mockConfig = { notify: true };
    const mockOptions = { appName: 'TestApp', hostUrl: 'http://localhost:3000' };
    const mockChildProcess = {
      stdout: {
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback('Listening at http://localhost:3000');
          }
        }),
      },
    };

    mockReadConfig.mockReturnValue(mockConfig);
    mockCreateContext.mockReturnValue(mockOptions);
    mockStartServer.mockResolvedValue(mockChildProcess);
    mockNormalizeNotifyOptions.mockReturnValue(mockOptions)

    await startBuildAndServer();

    expect(mockReadConfig).toHaveBeenCalled();
    expect(mockCreateContext).toHaveBeenCalledWith(mockConfig);
    expect(mockStartBuild).toHaveBeenCalledWith(mockOptions);
    expect(mockStartServer).toHaveBeenCalledWith(mockOptions);
    expect(mockNormalizeNotifyOptions).toHaveBeenCalledWith(mockOptions);
    expect(mockSendNotification).toHaveBeenCalledWith(mockOptions);
  });

  it('should not send notification if notify is false', async () => {
    const mockConfig = { notify: false };
    const mockOptions = { appName: 'TestApp', hostUrl: 'http://localhost:3000' };
    const mockChildProcess = {
      stdout: {
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback('Listening at http://localhost:3000');
          }
        }),
      },
    };

    mockReadConfig.mockReturnValue(mockConfig);
    mockCreateContext.mockReturnValue(mockOptions);
    mockStartServer.mockResolvedValue(mockChildProcess);

    await startBuildAndServer();

    expect(mockReadConfig).toHaveBeenCalled();
    expect(mockCreateContext).toHaveBeenCalledWith(mockConfig);
    expect(mockStartBuild).toHaveBeenCalledWith(mockOptions);
    expect(mockStartServer).toHaveBeenCalledWith(mockOptions);
    expect(mockNormalizeNotifyOptions).not.toHaveBeenCalled();
    expect(mockSendNotification).not.toHaveBeenCalled();
  });

  it('should log server output', async () => {
    const mockConfig = { notify: false };
    const mockOptions = { appName: 'TestApp', hostUrl: 'http://localhost:3000' };
    const mockChildProcess = {
      stdout: {
        on: vi.fn((event, callback) => {
          if (event === 'data') {
            callback('Server output log');
          }
        }),
      },
    };

    mockReadConfig.mockReturnValue(mockConfig);
    mockCreateContext.mockReturnValue(mockOptions);
    mockStartServer.mockResolvedValue(mockChildProcess);

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await startBuildAndServer();

    expect(consoleSpy).toHaveBeenCalledWith('Server output log');
    consoleSpy.mockRestore();
  });
});