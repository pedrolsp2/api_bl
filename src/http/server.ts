import app, { server } from './app';
import * as Greenlock from 'greenlock-express';
import path from 'path';
import { ServerSocket } from '../service/socket';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

let socketFunctions: ServerSocket;

if (process.env.APP_ENV === 'prod') {
  Greenlock.init({
    cluster: false,
    maintainerEmail: 'bruno.borges.ruiz90@gmail.com',
    configDir: path.resolve(__dirname, '../greenlock.d'),
    packageRoot: path.resolve(__dirname, '..'),
  }).ready(httpsWorker);
  function httpsWorker(glx: any) {
    const server = glx.httpsServer();

    glx.serveApp(app);
    socketFunctions = new ServerSocket(server);
    console.log('Server is listening for WebSocket connections');
  }
} else {
  socketFunctions = new ServerSocket(server);
  console.log('Server is listening for WebSocket connections');
}
console.log('ambiente', process.env.APP_ENV);
export { socketFunctions };
