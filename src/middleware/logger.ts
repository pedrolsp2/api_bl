import logToFile from 'log-to-file';

const log = (message: string, filename: string = 'default.log'): void => {
  logToFile(message, filename);
};

export default log;
