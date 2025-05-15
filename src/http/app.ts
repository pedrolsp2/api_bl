import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import http from 'http';
import routes from '../routes';
import '../config';
import debug from 'debug';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

const app: Application = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(morgan('dev'));
routes(app);

// Tratamento de erros
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

app.use((err: any, req: any, res: any, next: any) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ error: err.message });
});
app.use((req: Request, res: Response, next: NextFunction) => {
  console.info(
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on('finish', () => {
    console.info(
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    );
  });

  next();
});

app.use((req: any, res: any, next: any) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
});

const port = normalizePort(process.env.PORT || '3005');
console.log('Rodando na porta', port);
app.set('port', port);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: any) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  debug('Listening on ' + bind);
}

export { server };
export default app;
