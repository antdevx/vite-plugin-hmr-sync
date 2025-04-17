import { exec } from 'node:child_process';
import { describe, it, expect, vi, Mock } from 'vitest';

import { Logger } from '../../src/utils/logger';
import { startBuild, startServer } from '../../src/core/server';
import { IStartServerOptions } from '../../src/interface/build.interface';

vi.mock('node:child_process', () => ({
  exec: vi.fn(),
}));

vi.mock('../../src/utils/logger', () => ({
  Logger: vi.fn(() => ({
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  })),
}));

describe('server.ts', () => {
  describe('startBuild', () => {
    it('should execute the build command and resolve on success', async () => {
      const mockOptions: IStartServerOptions = {
        appName: 'testApp',
        buildCommand: 'build',
      };

      const mockStdout = 'Build successful';
      (exec as unknown as Mock).mockImplementation((command, callback) => {
        callback(null, mockStdout, '');
      });

      const result = await startBuild(mockOptions);

      expect(exec).toHaveBeenCalledWith(
        `${mockOptions.buildCommand} ${process.cwd()}/dist/spa`,
        expect.any(Function)
      );
      expect(Logger).toHaveBeenCalledWith('testApp');
      expect(result).toBe(mockStdout);
    });

    it('should reject if an error occurs during the build', async () => {
      const mockOptions: IStartServerOptions = {
        appName: 'testApp',
        buildCommand: 'build',
      };

      const mockError = new Error('Build failed');
      (exec as unknown as Mock).mockImplementation((command, callback) => {
        callback(mockError, '', '');
      });

      await expect(startBuild(mockOptions)).rejects.toThrow('Build failed');
      expect(Logger).toHaveBeenCalledWith('testApp');
    });
  });

  describe('startServer', () => {
    it('should execute the server command and resolve the ChildProcess', async () => {
      const mockOptions: IStartServerOptions = {
        appName: 'testApp',
        port: '3000',
        cache: '1',
        cors: true,
      };

      const mockChildProcess = {
        stdout: {
          on: vi.fn(),
        },
        stderr: {
          on: vi.fn(),
        },
      };
      (exec as unknown as Mock).mockReturnValue(mockChildProcess);

      const result = await startServer(mockOptions);

      expect(exec).toHaveBeenCalledWith(
        `quasar serve ${process.cwd()}/dist/spa --port 3000 --cache 1 --cors`,
        expect.any(Function)
      );
      expect(Logger).toHaveBeenCalledWith('testApp');
      expect(result).toBe(mockChildProcess);
    });

    it('should reject if an error occurs while starting the server', async () => {
      const mockOptions: IStartServerOptions = {
        appName: 'testApp',
      };

      const mockError = new Error('Server failed to start');
      (exec as unknown as Mock).mockImplementation((command, callback) => {
        callback(mockError, '', '');
      });

      await expect(startServer(mockOptions)).rejects.toThrow('Server failed to start');
      expect(Logger).toHaveBeenCalledWith('testApp');
    });
  });
});