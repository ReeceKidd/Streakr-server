import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as passport from 'passport'
import * as swaggerJSDoc from 'swagger-jsdoc'

import authRouter from "./Routers/authRouter";
import userRouter from "./Routers/userRouter";

import DATABASE_CONFIG from '../config/DATABASE_CONFIG'
import { Environments } from '../config/ENVIRONMENT_CONFIG'

const swaggerDefinition = {
  info: {
    title: 'Streakr API',
    version: '1.0.0',
    description: 'Demonstrating how to describe a RESTful API with Swagger',
  },
  host: 'localhost:4040',
  basePath: '/',
};

const options = {
  swaggerDefinition,
  apis: ['./src/Routes/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express()

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== Environments.TEST) {
  app.use(morgan('common'))
}

app.use(passport.initialize())
app.use(passport.session())

const databseURL = DATABASE_CONFIG[process.env.NODE_ENV]
mongoose
  .connect(
    databseURL,
    { useNewUrlParser: true }
  )
  .catch(err => console.log(err.message));

const user = 'user'
const auth = 'auth'
app.use(`/${user}`, userRouter)
app.use(`/${auth}`, authRouter)

export default app
