import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as morgan from "morgan";
import * as passport from 'passport'
import * as jwt from "jsonwebtoken"
import LoggerStream from "./Logging/LoggerStream";
import userRouter from "./Routers/userRouter"
import config from "../config/DATABASE_CONFIG";



const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('common', { stream: LoggerStream}))
app.use(passport.initialize())
app.use(passport.session())

mongoose
.connect(
  config[app.settings.env],
  { useNewUrlParser: true }
)
.catch(err => console.log(err.message));

const User = 'user'
app.use(`/${User}`, userRouter)

/*
Need to do by best to implement this: https://medium.com/front-end-weekly/learn-using-jwt-with-passport-authentication-9761539c4314
As middleware still have no idea don't do what they do in the tutorial but set it up and at least try to set it up as middleware. 
So that it works, at least by making mistakes I'll have something to ask Bruno to help with. 

1) Create a middleware that returns the minimum amount of user data: The idea is to store the minimum info that you can use without having to 
retreive the user from the database in all authenticated requests. 


- Need to create a logout route that invalidates a token when a user logs out. 


*/


export default app
