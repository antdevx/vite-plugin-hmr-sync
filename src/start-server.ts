import { ChildProcess } from 'node:child_process';

import { startBuild, startServer } from './core/server';
import { readNodemonHmrSyncConfig } from './core/read-config';
import { createBuildAndServeContext, normalizeNotifyOptions, sendNotification } from './core';

/**
 * Starts the build and server process for the application.
 *
 * @export
 */
export async function startBuildAndServer() {
  const fileConfig = readNodemonHmrSyncConfig();
  const options = createBuildAndServeContext(fileConfig);

  const { appName, hostUrl } = options

  await startBuild(options)
  await startServer(options)
    .then((server: ChildProcess) => {
      server.stdout?.on('data', (data) => {
        console.log(data.toString());

        // Assuming this line indicates that the server has started successfully
        if (data.includes('Listening at') && fileConfig.notify) {
          console.log('Server is running, sending notification...');

          // Send notification after server starts
          const notificationOptions = normalizeNotifyOptions({
            appName,
            hostUrl: hostUrl || 'http://localhost:5000',
          });
          sendNotification(notificationOptions); // Ensure sendNotification is correctly defined
        }
      })
      console.log('Server started successfully!');
      return server;
    })
}
