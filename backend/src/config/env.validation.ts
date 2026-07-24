import * as Joi from 'joi';

export const envSchema = Joi.object({
  JWT_ACCESS_SECRET: Joi.string().required(),
  HMAC_TOKEN_SECRET: Joi.string().min(32).required(),
  DATABASE_URL: Joi.string().required(),

  S3_ENDPOINT: Joi.string().uri().required(),
  S3_REGION: Joi.string().default('us-east-1'),
  S3_ACCESS_KEY_ID: Joi.string().required(),
  S3_SECRET_ACCESS_KEY: Joi.string().required(),
  S3_BUCKET: Joi.string().required(),

  S3_PUBLIC_URL: Joi.string().uri().required(),
});
