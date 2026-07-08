import { PrismaProvider } from '@/provider/prisma.provider';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { AuthService } from './auth.service';
import { TokenService } from './token/token.service';

const mockedUser: User = {
  email: 'nope@test.com',
  password: 'anypass',
  id: -1,
  firstName: '',
  lastName: '',
  isAdmin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let db: DeepMockProxy<PrismaProvider>;
  let tokenService: DeepMockProxy<TokenService>;

  beforeEach(async () => {
    db = mockDeep<PrismaProvider>();
    tokenService = mockDeep<TokenService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaProvider, useValue: db },
        { provide: TokenService, useValue: tokenService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('registerUser', () => {
    it('ConflictException when email already exists', async () => {
      db.user.findUnique.mockResolvedValue(mockedUser);

      await expect(authService.register(mockedUser)).rejects.toThrow(
        ConflictException,
      );
    });

    it('hashes the password and returns tokens on success', async () => {
      const newUser = { ...mockedUser, id: 1, email: 'new@test.com' };
      db.user.findUnique.mockResolvedValue(null);
      db.user.create.mockResolvedValue(newUser);
      tokenService.generateAccessToken.mockReturnValue('access-token');
      tokenService.generateRefreshToken.mockResolvedValue('refresh-token');

      const result = await authService.register({
        email: newUser.email,
        password: 'plain-password',
        firstName: 'A',
        lastName: 'B',
      });

      const createArgs = db.user.create.mock.calls[0][0];
      expect(createArgs.data.password).not.toBe('plain-password');
      await expect(
        bcrypt.compare('plain-password', createArgs.data.password as string),
      ).resolves.toBe(true);

      expect(tokenService.generateAccessToken).toHaveBeenCalledWith(
        newUser.id,
        newUser.email,
      );
      console.log('result', result);
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });

  describe('loginUser', () => {
    it('UnauthorizedException when user not found', async () => {
      db.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.loginUser({ email: 'nope@test.com', password: 'anypass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('UnauthorizedException when passed invalid password', async () => {
      db.user.findUnique.mockResolvedValue({
        ...mockedUser,
      });

      await expect(
        authService.loginUser({
          email: 'nope@test.com',
          password: 'different pass',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('clears expired refresh tokens and returns tokens on valid credentials', async () => {
      const plainPassword = 'correct-password';
      const passwordHash = await bcrypt.hash(plainPassword, 12);
      db.user.findUnique.mockResolvedValue({
        ...mockedUser,
        password: passwordHash,
      });
      db.refreshToken.deleteMany.mockResolvedValue({ count: 0 });
      tokenService.generateAccessToken.mockReturnValue('access-token');
      tokenService.generateRefreshToken.mockResolvedValue('refresh-token');

      const result = await authService.loginUser({
        email: mockedUser.email,
        password: plainPassword,
      });

      expect(db.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: mockedUser.id,
          expiresAt: { lt: expect.any(Date) },
        },
      });
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });

  describe('logout', () => {
    it('deletes the refresh token matching the hashed raw token', async () => {
      tokenService.hashToken.mockReturnValue('hashed-token');
      db.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

      await authService.logout('raw-token');

      expect(tokenService.hashToken).toHaveBeenCalledWith('raw-token');
      expect(db.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { tokenHash: 'hashed-token' },
      });
    });
  });

  describe('getUser', () => {
    it('looks up a user by email', async () => {
      db.user.findUnique.mockResolvedValue(mockedUser);

      const result = await authService.getUser({ email: mockedUser.email });

      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockedUser.email },
      });
      expect(result).toEqual(mockedUser);
    });
  });
});
