import app from "./app";
import logger from "./logging/Logger"
const port = 4040;
app.listen(port, function() {
  logger.info('Express server listening on port ' + port)
});
