import * as Joi from 'joi';

export const envSchema = Joi.object({
  JWT_ACCESS_SECRET: Joi.string().required(),
  HMAC_TOKEN_SECRET: Joi.string().min(32).required(),
  DATABASE_URL: Joi.string().required(),
});
