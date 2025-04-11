import { Plugin } from 'vite';
import https from 'node:https';
import http, { ClientRequest } from 'node:http';
import { describe, it, expect, vi } from 'vitest';

import { notifyOnRebuild } from '../src/lib/notify-plugin';

describe('notifyOnRebuild', () => {
  console.error = vi.fn();
  console.warn = vi.fn();
  console.log = vi.fn();
  console.info = vi.fn();

  it('should return a plugin with the correct name', () => {
    const plugin = notifyOnRebuild('test-app');
    expect(plugin.name).toBe('vite-plugin-notify-on-rebuild');
  });

  it('should log an error and return an error plugin if appName is missing', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const plugin = notifyOnRebuild({ appName: '' });
    expect(plugin.name).toBe('vite-plugin-notify-on-rebuild-error');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[vite-plugin-notify-on-rebuild] ❌ Error: \'appName\' option is required.'
    );
    consoleErrorSpy.mockRestore();
  });

  it('should skip notification if build fails and notifyOnSuccessOnly is true', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const plugin: Plugin = notifyOnRebuild({ appName: 'test-app', notifyOnSuccessOnly: true });

    if (typeof plugin.buildEnd === 'function') {
      plugin.buildEnd.call(plugin, new Error('Build failed'));
    }

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[vite-plugin-notify-on-rebuild][test-app] ❌ Build failed, skipping notification.',
      'Build failed'
    );
    consoleErrorSpy.mockRestore();
  });

  it('should notify the host on successful build', () => {
    const mockResponse = {
      statusCode: 200,
      on: vi.fn((event, handler) => {
        if (event === 'data') handler('');
        if (event === 'end') handler();
      }),
    } as unknown as ClientRequest;
    const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const httpRequestSpy = vi.spyOn(http, 'request').mockImplementation((_, callback: any) => {
      if (callback && typeof callback === 'function') {
        callback(mockResponse);
      }

      return {
        end: vi.fn(),
        on: vi.fn(),
        write: vi.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
    });

    const plugin = notifyOnRebuild('test-app');

    if (typeof plugin.buildEnd === 'function') {
      plugin.buildEnd.call(plugin, null);
    }

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      '[vite-plugin-notify-on-rebuild][test-app] ✅ Build successful, notifying host...'
    );
    expect(httpRequestSpy).toHaveBeenCalled();
    consoleInfoSpy.mockRestore();
    httpRequestSpy.mockRestore();
  });

  it('should log an error if the notification request fails', () => {
    const error = new Error('Request failed');

    const mockRequest: ReturnType<typeof vi.fn> = vi.fn((_options, callback) => {
      const res = {
        statusCode: 200,
        on: vi.fn(),
      };
      callback(res);

      const req = {
        on: vi.fn((event, handler) => {
          if (event === 'error') {
            setTimeout(() => handler(error), 0);
          }
        }),
        end: vi.fn(),
        write: vi.fn(),
      };

      return req;
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    vi.spyOn(http, 'request').mockImplementation(mockRequest);

    const plugin = notifyOnRebuild('test-app');

    if (typeof plugin.buildEnd === 'function') {
      plugin.buildEnd.call(plugin, null);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '[vite-plugin-notify-on-rebuild][test-app] ❌ Notification failed:',
          expect.any(Error)
        );
        consoleErrorSpy.mockRestore();
        resolve(null);
      }, 0);
    });
  });

  it('should use https for secure URLs', () => {
    const mockRequest: ReturnType<typeof vi.fn> = vi.fn((_options, callback) => {
      const res = {
        statusCode: 200,
        on: vi.fn((event, handler) => {
          if (event === 'data') handler('');
          if (event === 'end') handler();
        }),
      };

      callback(res);

      return { on: vi.fn(), end: vi.fn(), write: vi.fn() };
    });

    const httpsRequestSpy = vi.spyOn(https, 'request').mockImplementation(mockRequest);

    const plugin = notifyOnRebuild({ appName: 'test-app', hostUrl: 'https://example.com' });

    if (typeof plugin.buildEnd === 'function') {
      plugin.buildEnd.call(plugin, null);
    }

    expect(httpsRequestSpy).toHaveBeenCalled();

    httpsRequestSpy.mockRestore();
  });

  it('should log a warning if the host responds with a non-2xx status code', () => {
    const mockRequest: ReturnType<typeof vi.fn> = vi.fn((_options, callback) => {
      const res = {
        statusCode: 400,
        on: vi.fn((event, handler) => {
          if (event === 'data') handler('Bad Request');
          if (event === 'end') handler();
        }),
      };

      callback(res);

      return { on: vi.fn(), end: vi.fn(), write: vi.fn() };
    });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(http, 'request').mockImplementation(mockRequest);

    const plugin = notifyOnRebuild('test-app');

    if (typeof plugin.buildEnd === 'function') {
      plugin.buildEnd.call(plugin, null);
    }

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[vite-plugin-notify-on-rebuild][test-app] ⚠️ Host responded with 400. Response: Bad Request'
    );

    consoleWarnSpy.mockRestore();
  });
});