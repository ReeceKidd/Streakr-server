"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const passport = require("passport");
const LoggerStream_1 = require("./Logging/LoggerStream");
const userRouter_1 = require("./Routers/userRouter");
const DATABASE_CONFIG_1 = require("../config/DATABASE_CONFIG");
const User = 'user';
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('common', { stream: LoggerStream_1.default }));
app.use(passport.initialize());
app.use(passport.session());
mongoose
    .connect(DATABASE_CONFIG_1.default[app.settings.env], { useNewUrlParser: true })
    .catch(err => console.log(err.message));
app.use(`/${User}`, userRouter_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map