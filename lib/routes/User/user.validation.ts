import * as Joi from "joi";

const register = {
    body: Joi.object().keys({
        userName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
      }),
};

const UserValidation = {
  register
};

export { UserValidation };
