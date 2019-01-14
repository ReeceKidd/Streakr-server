import Logger from './Logger';

class LoggerStream {
  write(text: string) {
    Logger.info(text);
  }
}

export default new LoggerStream();
