import { databaseUsername, databasePassword } from "./credentials";
import { DATABASE_IDENTIFIERS } from "./DATABASE_IDENTIFIERS";
import { Environments } from "./ENVIRONMENT_CONFIG";

let databaseConnectionString = `mongodb+srv://${databaseUsername}:${databasePassword}@cluster0-kxrys.mongodb.net/${DATABASE_IDENTIFIERS[process.env.NODE_ENV]}?retryWrites=true&w=majority`;

if (process.env.NODE_ENV === Environments.LOCAL) {
    databaseConnectionString = `mongodb://localhost:27017/streakoid`;
}

export default databaseConnectionString;

