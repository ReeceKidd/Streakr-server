import app from "./app";
import logger from "./Logging/Logger";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info("Express server listening on port " + port);
});
