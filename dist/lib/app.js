"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const route_1 = require("./route");
const _config_1 = require("../config/_config");
class App {
    constructor() {
        this.router = new route_1.Routes();
        this.app = express();
        this.config();
        this.mongoSetup();
        this.router.routes(this.app);
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    mongoSetup() {
        mongoose.Promise = global.Promise;
        mongoose.connect(_config_1.default[this.app.settings.env], { useNewUrlParser: true });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map