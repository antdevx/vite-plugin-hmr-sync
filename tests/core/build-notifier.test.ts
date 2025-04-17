import http from 'node:http';
import https from 'node:https';
import { describe, it, vi, expect, Mock, afterEach, beforeEach } from 'vitest';

import { Logger } from '../../src/utils/logger';
import type { INotifyOptions } from '../../src/interface';
import { sendNotification } from '../../src/core/build-notifier';

const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn()
};

// Mock the logger module to always return the shared mockLogger
vi.mock('../../src/utils/logger', () => ({
  Logger: vi.fn(() => mockLogger)
}));

vi.mock('node:http');
vi.mock('node:https');

describe('sendNotification', () => {
  let mockLogger: ReturnType<typeof Logger>;
  const mockOptions: Required<INotifyOptions> = {
    appName: 'test-app',
    hostUrl: 'http://localhost',
    endpoint: '/notify',
    method: 'POST',
    notifyOnSuccessOnly: false,
    suppressLogs: false,
  };

  beforeEach(() => {
    mockLogger = vi.mocked(Logger('my-app'), { partial: true });
  })

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should log an error and return if notifyOnSuccessOnly is true and an error is provided', () => {
    const error = new Error('Build failed');
    sendNotification({ ...mockOptions, notifyOnSuccessOnly: true }, error);

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Build failed, skipping notification.',
      error.message
    );
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(http.request).not.toHaveBeenCalled();
    expect(https.request).not.toHaveBeenCalled();
  });

  it('should log an error and return if the URL is invalid', () => {
    sendNotification({ ...mockOptions, hostUrl: 'invalid-url' });

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Invalid URL: "invalid-url/notify?app=test-app"',
      expect.any(Error)
    );
    expect(http.request).not.toHaveBeenCalled();
    expect(https.request).not.toHaveBeenCalled();
  });

  it('should send an HTTP request for http URLs', () => {
    const mockRequest = vi.fn((options, callback) => {
      callback({ statusCode: 200, on: vi.fn((_, cb) => cb('')) });
      return { on: vi.fn(), end: vi.fn() };
    });
    (http.request as unknown as Mock).mockImplementation(mockRequest);

    sendNotification(mockOptions);

    expect(mockLogger.info).toHaveBeenCalledWith(
      '🔔 Sending POST request to http://localhost/notify?app=test-app'
    );
    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        hostname: 'localhost',
        path: '/notify?app=test-app',
      }),
      expect.any(Function)
    );
  });

  it('should send an HTTPS request for https URLs', () => {
    const mockRequest = vi.fn((options, callback) => {
      callback({ statusCode: 200, on: vi.fn((_, cb) => cb('')) });
      return { on: vi.fn(), end: vi.fn() };
    });
    (https.request as unknown as Mock).mockImplementation(mockRequest);

    sendNotification({ ...mockOptions, hostUrl: 'https://localhost' });

    expect(mockLogger.info).toHaveBeenCalledWith(
      '🔔 Sending POST request to https://localhost/notify?app=test-app'
    );
    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        hostname: 'localhost',
        path: '/notify?app=test-app',
      }),
      expect.any(Function)
    );
  });

  it('should log a success message if the response status code is 2xx', () => {
    const mockRequest = vi.fn((options, callback) => {
      callback({ statusCode: 200, on: vi.fn((_, cb) => cb('')) });
      return { on: vi.fn(), end: vi.fn() };
    });
    (http.request as unknown as Mock).mockImplementation(mockRequest);

    sendNotification(mockOptions);

    expect(mockLogger.info).toHaveBeenCalledWith('✅ Host notified (200)');
  });

  it('should log a warning if the response status code is not 2xx', () => {
    const mockRequest = vi.fn((options, callback) => {
      callback({
        statusCode: 500,
        on: vi.fn((_, cb) => cb('Internal Server Error')),
      });
      return { on: vi.fn(), end: vi.fn() };
    });
    (http.request as unknown as Mock).mockImplementation(mockRequest);

    sendNotification(mockOptions);

    expect(mockLogger.warn).toHaveBeenCalledWith(
      '⚠️ Host responded with 500. Response: Internal Server Error'
    );
  });

  it('should log an error if the request fails', () => {
    const mockRequest = vi.fn(() => ({
      on: vi.fn((event, callback) => {
        if (event === 'error') callback(new Error('Request failed')); // 👈 fix
        return this;
      }),
      end: vi.fn(),
    }));
    (http.request as unknown as Mock).mockImplementation(mockRequest);

    sendNotification(mockOptions);

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Notification failed:',
      expect.any(Error)
    );
  });
});
