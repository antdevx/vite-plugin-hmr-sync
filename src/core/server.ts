import { ChildProcess, exec } from 'node:child_process';

import { Logger } from '../utils/logger';
import { IStartServerOptions } from '../interface/build.interface';

/**
 * Starts the build process using the specified build command.
 *
 * @export
 * @param {IStartServerOptions} options
 * @return {*} 
 */
export function startBuild(options: IStartServerOptions) {
  const logger = Logger(options.appName || 'unknown');

  return new Promise((resolve, reject) => {
    logger.log('Starting build...');

    const { buildCommand } = options;
    const command = `${buildCommand} ${process.cwd()}/dist/spa`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error during build: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        logger.warn(stderr.toString());
      }

      logger.log(stdout.toString());
      logger.log('Build completed successfully!');

      resolve(stdout);
    });
  })
}

/**
 * Starts the server using the specified options.
 *
 * @export
 * @param {IStartServerOptions} options
 * @return {*}  {Promise<ChildProcess>}
 */
export function startServer(options: IStartServerOptions): Promise<ChildProcess> {
  const logger = Logger(options.appName || 'unknown');

  return new Promise((resolve, reject) => {
    logger.log('Starting server...');
    const { port , cache = '0', cors = true } = options;
    
    const command = `quasar serve ${process.cwd()}/dist/spa ${port ? '--port ' + port : ''} ${cache ? '--cache ' + cache : ''} ${cors ? '--cors' : ''}`;
    
    const server = exec(command, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error starting server: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        logger.warn(stderr.toString());
      }

      logger.log(`Server started: ${stdout}`);
    });
  
    // Watch for server logs indicating it's ready
    if (server.stdout) {
      server.stdout.on('data', (data) => {
        logger.log(`Server log: ${data}`);
      });
    }
  
    if (server.stderr) {
      server.stderr.on('data', (data) => {
        logger.error(`Server error: ${data}`);
      });
    }
  
    resolve(server);
  })
}
