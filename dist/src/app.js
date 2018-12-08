"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");
const Logger_1 = require("./Logging/Logger");
const LoggerStream_1 = require("./Logging/LoggerStream");
const routes_1 = require("./Routes/routes");
const DATABASE_CONFIG_1 = require("../config/DATABASE_CONFIG");
class App {
    constructor() {
        this.router = new routes_1.Routes();
        this.logger = Logger_1.default;
        this.app = express();
        this.config();
        this.mongoSetup();
        this.router.routes(this.app);
        this.errorHandling();
    }
    config() {
        this.configureBodyParsing();
        this.app.use(morgan('common', { stream: LoggerStream_1.default }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }
    configureBodyParsing() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    errorHandling() {
        this.app.use((err, req, res, next) => {
            this.logger.error(err);
            res.status(req.status).send(Object.assign({}, err));
            next();
        });
    }
    mongoSetup() {
        mongoose.Promise = global.Promise;
        mongoose
            .connect(DATABASE_CONFIG_1.default[this.app.settings.env], { useNewUrlParser: true })
            .catch(err => console.log(err.message));
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map