import { databasePassword, databaseUsername } from "./credentials";

const connectionString = `mongodb+srv://${databaseUsername}:${databasePassword}@cluster0-kxrys.mongodb.net/test?retryWrites=true&w=majority`;

export enum DATABASE_URLS {
  DEV = "mongodb://localhost:27017/streakr",
  TEST = "mongodb://localhost:27017/streakr-test",
  PROD = "mongodb://localhost:27017/streakr-prod"
}

