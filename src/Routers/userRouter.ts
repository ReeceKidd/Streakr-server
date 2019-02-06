import { Router } from "express";

import { registerUserMiddlewares } from "../Routes/User/user.register"

const userPaths = {
  register: "register",
};

const userRouter = Router();


/**
 * @swagger
 * /user/register:
 *   post:
 *     tags:
 *       - User
 *     description: Registers user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         jsonWebToken: A jsonWebToken used for authentication
 *         message: Message response from server
 */
userRouter.post(
  `/${userPaths.register}`,
  ...registerUserMiddlewares
);

export default userRouter;
