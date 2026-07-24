import { envSchema } from './env.validation';

describe('envSchema', () => {
  it('бросает ошибку, если JWT_ACCESS_SECRET отсутствует', () => {
    const { error } = envSchema.validate({
      HMAC_TOKEN_SECRET: 'x'.repeat(32),
      DATABASE_URL: 'postgresql://...',
    });
    expect(error).toBeDefined();
  });

  it('проходит с валидным конфигом', () => {
    const { error } = envSchema.validate({
      JWT_ACCESS_SECRET: 'x'.repeat(32),
      HMAC_TOKEN_SECRET: 'y'.repeat(32),
      DATABASE_URL: 'postgresql://...',
    });
    expect(error).toBeDefined();
  });
});
