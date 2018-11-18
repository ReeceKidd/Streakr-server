import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as passport from 'passport'
import Logger from "./Logging/Logger";
import LoggerStream from "./Logging/LoggerStream";
import { Routes } from "./Routes/routes"
import config from "../config/DATABASE_CONFIG";


class App {
  public app: express.Application;
  public router: Routes = new Routes();
  public logger = Logger;

  constructor() {
    this.app = express();
    this.config();
    this.mongoSetup();
    this.router.routes(this.app);
    this.errorHandling();
  }

  private config(): void {
    this.configureBodyParsing()
    this.app.use(morgan('common', { stream: LoggerStream }));
    this.app.use(passport.initialize())
    this.app.use(passport.session())
  }

  private configureBodyParsing(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private errorHandling(): void {
    this.app.use((err: Error, req, res, next) => {
      console.log(err)
      this.logger.error(err)
      res.status(req.status).send({ ...err });
      next();
    });
  }

  private mongoSetup(): void {
    (<any>mongoose).Promise = global.Promise;
    mongoose
      .connect(
        config[this.app.settings.env],
        { useNewUrlParser: true }
      )
      .catch(err => console.log(err.message));
  }
}

export default new App().app;
