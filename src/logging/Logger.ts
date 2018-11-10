import * as winston from "winston";
import * as express from "express";
import ENVIRONMENT_CONFIG from "../../config/ENVIRONMENT_CONFIG"


class Logger {
  public logger: winston.Logger;
  constructor() {
    this.createWinstonLogger();
    this.configureConsoleLogging();
  }
  private createWinstonLogger() {
    this.logger = winston.createLogger({
      level: "debug",
      exitOnError: false,
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: "error.log",
          level: "error",
          handleExceptions: true
        }),
        new winston.transports.File({ filename: "combined.log" })
      ]
    });
  }

  private configureConsoleLogging() {
    if (express().settings.env !== ENVIRONMENT_CONFIG.PROD) {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.simple()
        })
      );
    }
  }

}

export default new Logger().logger;
