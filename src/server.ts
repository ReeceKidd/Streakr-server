import app from './app';
import dotenv from 'dotenv';
import { getServiceConfig } from './getServiceConfig';

dotenv.config();
const { DATABASE_URI } = getServiceConfig();

const port = process.env.PORT || 3001;

app({ databaseURI: DATABASE_URI }).listen(port, () => {
    console.log('Express server listening on port ' + port);
});
