import { Router } from "express";

import { loginMiddlewares } from "../Routes/Auth/login";
import { verifyJsonWebTokenMiddlewares } from "../Routes/Auth/verifyJsonWebTokenMiddlewares";

const authPaths = {
  login: "login",
  verifyJsonWebToken: "verify-json-web-token"
};

const authRouter = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     description: Logs user in
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful operation
 *       400:
 *         description: Invalid email supplied
 */
authRouter.post(
  `/${authPaths.login}`,
  ...loginMiddlewares
);

authRouter.post(
  `/${authPaths.verifyJsonWebToken}`,
  ...verifyJsonWebTokenMiddlewares)


export default authRouter;
