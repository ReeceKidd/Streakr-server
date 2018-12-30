import { Request, Response, NextFunction } from "express";
import { hash} from "bcryptjs"
import saltRounds from "../../Constants/Auth/saltRounds";


const getHashPasswordMiddleware = (hash, salt) => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  saltRounds
  try {
    const { password } = request.body;
    response.locals.hashedPassword = await hash(password, salt);
    next();
  } catch(err){
    next(err)
  }
};

const hashPasswordMiddleware = getHashPasswordMiddleware(hash, saltRounds)

export { getHashPasswordMiddleware, hashPasswordMiddleware };
