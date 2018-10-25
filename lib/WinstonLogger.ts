import * as winston from "winston";
import * as express from "express"

class WinstonLogger {
  public logger: winston.Logger;
  constructor() {
    this.createWinstonLogger()
    this.configureConsoleLogging()
  }
  private createWinstonLogger() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" })
      ]
    });
  }
  private configureConsoleLogging(){
    if (express().settings.env !== "production") {
        this.logger.add(
          new winston.transports.Console({
            format: winston.format.simple()
          })
        );
      }
  }
}

export default new WinstonLogger().logger;


