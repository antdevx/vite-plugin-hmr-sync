import { describe, it, expect } from 'vitest';
import { normalizeNotifyOptions, createBuildAndServeContext, normalizeListenOptions } from '../../src/core/build-context';
import { DEFAULT_HOT_PAYLOAD, DEFAULT_LISTEN_ENDPOINT } from '../../src/utils/constants';
import { IListenOptions } from '../../src/interface';

describe('normalizeNotifyOptions', () => {
  it('should normalize options when a string is provided', () => {
    const result = normalizeNotifyOptions('test-app');
    expect(result).toEqual({
      appName: 'test-app',
      hostUrl: 'http://localhost:5000',
      endpoint: '/on-child-rebuild',
      method: 'GET',
      notifyOnSuccessOnly: true,
      suppressLogs: false,
    });
  });

  it('should normalize options when an object is provided', () => {
    const result = normalizeNotifyOptions({
      appName: 'test-app',
      hostUrl: 'http://example.com',
      endpoint: '/custom-endpoint',
      method: 'POST',
      notifyOnSuccessOnly: false,
      suppressLogs: true,
    });
    expect(result).toEqual({
      appName: 'test-app',
      hostUrl: 'http://example.com',
      endpoint: '/custom-endpoint',
      method: 'POST',
      notifyOnSuccessOnly: false,
      suppressLogs: true,
    });
  });

  it('should throw an error if appName is missing', () => {
    expect(() => normalizeNotifyOptions({} as any)).toThrowError('`appName` is required');
  });
});

describe('normalizeListenOptions', () => {
  it('should normalize options with defaults when minimal options provided', () => {
    const result = normalizeListenOptions({});
    expect(result).toEqual({
      hotPayload: DEFAULT_HOT_PAYLOAD,
      endpoint: DEFAULT_LISTEN_ENDPOINT,
      onRebuild: undefined,
      allowedApps: [],
      suppressLogs: false,
    });
  });

  it('should use provided values instead of defaults', () => {
    const customPayload = { type: 'custom', path: '/test' };
    const onRebuildFn = () => { };
    const options = {
      hotPayload: customPayload,
      endpoint: '/custom-endpoint',
      onRebuild: onRebuildFn,
      allowedApps: ['app1', 'app2'],
      suppressLogs: true,
    } as IListenOptions;

    const result = normalizeListenOptions(options);
    expect(result).toEqual(options);
  });

  it('should merge partial options with defaults', () => {
    const result = normalizeListenOptions({
      endpoint: '/custom-endpoint',
      suppressLogs: true,
    });

    expect(result).toEqual({
      hotPayload: DEFAULT_HOT_PAYLOAD,
      endpoint: '/custom-endpoint',
      onRebuild: undefined,
      allowedApps: [],
      suppressLogs: true,
    });
  });
})

describe('createBuildAndServeContext', () => {
  it('should create a context with default values', () => {
    const result = createBuildAndServeContext({});
    expect(result).toEqual({
      port: '5000',
      cors: true,
      cache: '0',
      notify: true,
      hostUrl: 'http://localhost:5000',
      appName: 'my-app',
      buildCommand: 'quasar build',
      serveCommand: 'quasar serve',
    });
  });

  it('should override default values with provided options', () => {
    const result = createBuildAndServeContext({
      port: '3000',
      cors: false,
      cache: '1',
      notify: false,
      hostUrl: 'http://example.com',
      appName: 'custom-app',
      buildCommand: 'npm run build',
      serveCommand: 'npm run serve',
    });
    expect(result).toEqual({
      port: '3000',
      cors: false,
      cache: '1',
      notify: false,
      hostUrl: 'http://example.com',
      appName: 'custom-app',
      buildCommand: 'npm run build',
      serveCommand: 'npm run serve',
    });
  });
});
