import { ViteDevServer } from 'vite';
import { describe, it, expect, vi } from 'vitest';

import { sendNotification } from '../../src/core/build-notifier';
import { handleRemoteRebuildRequest } from '../../src/core/host-handler';
import { notifyOnRebuild, listenForRemoteRebuilds } from '../../src/plugin';

vi.mock('../../src/core/build-notifier', () => ({
  sendNotification: vi.fn(),
}));

vi.mock('../../src/core/host-handler', () => ({
  handleRemoteRebuildRequest: vi.fn(),
}));

vi.mock('../../src/utils/logger', () => ({
  Logger: vi.fn(() => ({
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  })),
}));

describe('notifyOnRebuild', () => {
  it('should return a plugin with the correct name', () => {
    const plugin = notifyOnRebuild('test-app');
    expect(plugin.name).toBe('vite-plugin-notify-on-rebuild');
  });

  it('should call sendNotification on buildEnd', () => {
    const plugin = notifyOnRebuild('test-app');
    const error = null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (plugin as any).buildEnd(error);

    expect(sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({ appName: 'test-app' }),
      error
    );
  });

  it('should handle invalid options gracefully', () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      notifyOnRebuild({} as any);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain('`appName` is required');
    }
  });
});

describe('listenForRemoteRebuilds', () => {
  it('should return a plugin with the correct name', () => {
    const plugin = listenForRemoteRebuilds();
    expect(plugin.name).toBe('vite-plugin-listen-for-remote-rebuilds');
  });

  it('should set up middleware for the specified endpoint', () => {
    const server = {
      middlewares: {
        use: vi.fn(),
      },
    } as unknown as ViteDevServer;

    const plugin = listenForRemoteRebuilds({ endpoint: '/custom-endpoint' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (plugin as any).configureServer?.(server);

    expect(server.middlewares.use).toHaveBeenCalledWith(
      '/custom-endpoint',
      expect.any(Function)
    );
  });

  it('should call handleRemoteRebuildRequest with the correct parameters', () => {
    const server = {
      middlewares: {
        use: vi.fn((endpoint, handler) => {
          const req = {};
          const res = {};
          handler(req, res);
        }),
      },
    } as unknown as ViteDevServer;

    const options = { endpoint: '/custom-endpoint' };
    const plugin = listenForRemoteRebuilds(options);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (plugin as any).configureServer?.(server);

    expect(handleRemoteRebuildRequest).toHaveBeenCalledWith(
      server,
      expect.any(Object),
      expect.any(Object),
      expect.objectContaining({ endpoint: '/custom-endpoint' }),
      'vite-plugin-listen-for-remote-rebuilds'
    );
  });
});