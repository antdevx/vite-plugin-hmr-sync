import type { ViteDevServer } from 'vite';
import { describe, it, expect, vi } from 'vitest';

import { listenForRemoteRebuilds } from '../src/lib/listen-plugin';

describe('listenForRemoteRebuilds', () => {
  const suppressLogs = true;

  it('should register the middleware with the correct endpoint', () => {
    const mockUse = vi.fn();
    const mockServer = { middlewares: { use: mockUse } } as unknown as ViteDevServer;

    const plugin = listenForRemoteRebuilds({ suppressLogs: true });
    if (plugin.configureServer && typeof plugin.configureServer === 'function') {
      plugin.configureServer(mockServer);
    }

    expect(mockUse).toHaveBeenCalledWith('/on-child-rebuild', expect.any(Function));
  });

  it('should respond with 403 if app is not allowed', async () => {
    const mockWriteHead = vi.fn();
    const mockEnd = vi.fn();
    const mockServer = {
      middlewares: { use: vi.fn((_, handler) => handler({ url: '/on-child-rebuild?app=unauthorizedApp' }, { writeHead: mockWriteHead, end: mockEnd })) },
    } as unknown as ViteDevServer;

    const plugin = listenForRemoteRebuilds({ allowedApps: ['allowedApp'], suppressLogs });
    if (plugin.configureServer && typeof plugin.configureServer === 'function') {
      plugin.configureServer(mockServer);
    }

    expect(mockWriteHead).toHaveBeenCalledWith(403, { 'Content-Type': 'text/plain' });
    expect(mockEnd).toHaveBeenCalledWith('[vite-plugin-listen-for-remote-rebuilds] App "unauthorizedApp" not allowed');
  });

  it('should trigger HMR reload and respond with 200 for allowed apps', async () => {
    const mockWriteHead = vi.fn();
    const mockEnd = vi.fn();
    const mockSend = vi.fn();
    const mockServer = {
      middlewares: { use: vi.fn((_, handler) => handler({ url: '/on-child-rebuild?app=allowedApp' }, { writeHead: mockWriteHead, end: mockEnd })) },
      ws: { send: mockSend },
    } as unknown as ViteDevServer;

    const plugin = listenForRemoteRebuilds({ allowedApps: ['allowedApp'], suppressLogs });
    if (plugin.configureServer && typeof plugin.configureServer === 'function') {
      plugin.configureServer(mockServer);
    }

    expect(mockSend).toHaveBeenCalledWith({ type: 'full-reload', path: '*' });
    expect(mockWriteHead).toHaveBeenCalledWith(200, { 'Content-Type': 'text/plain' });
    expect(mockEnd).toHaveBeenCalledWith('[vite-plugin-listen-for-remote-rebuilds] Reload triggered');
  });

  it('should call onRebuild hook if provided', async () => {
    const mockOnRebuild = vi.fn();
    const mockServer = {
      middlewares: { use: vi.fn((_, handler) => handler({ url: '/on-child-rebuild?app=allowedApp' }, { writeHead: vi.fn(), end: vi.fn() })) },
      ws: { send: vi.fn() },
    } as unknown as ViteDevServer;

    const plugin = listenForRemoteRebuilds({ allowedApps: ['allowedApp'], onRebuild: mockOnRebuild, suppressLogs });
    if (plugin.configureServer && typeof plugin.configureServer === 'function') {
      plugin.configureServer(mockServer);
    }

    expect(mockOnRebuild).toHaveBeenCalledWith('allowedApp', mockServer);
  });

  it('should handle errors gracefully and respond with 500', async () => {
    const mockWriteHead = vi.fn();
    const mockEnd = vi.fn();
    const mockServer = {
      middlewares: {
        use: vi.fn(
          (_, handler) => handler(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            null as any,
            { writeHead: mockWriteHead, end: mockEnd }
          )
        )
      },
    } as unknown as ViteDevServer;

    const plugin = listenForRemoteRebuilds({ suppressLogs });
    if (plugin.configureServer && typeof plugin.configureServer === 'function') {
      plugin.configureServer(mockServer);
    }

    expect(mockWriteHead).toHaveBeenCalledWith(500, { 'Content-Type': 'text/plain' });
    expect(mockEnd).toHaveBeenCalledWith('[vite-plugin-listen-for-remote-rebuilds] Internal error');
  });
});