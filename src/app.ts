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
import swaggerDefinition from '../config/SWAGGER_DEFINITION'


const options = {
  swaggerDefinition,
  apis: ['./src/Routers/**/*.ts'],
};

const app = express()

app.get('/swagger.json', (req, res) => {
  const swaggerSpec = swaggerJSDoc(options);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
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
