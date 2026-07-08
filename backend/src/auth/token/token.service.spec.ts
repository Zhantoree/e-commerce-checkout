import { PrismaProvider } from '@/provider/prisma.provider';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { RefreshToken, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { TokenService } from './token.service';

const mockRawToken = 'yWOC41rbFLYRWzkGSZs2l6xX1rxZ055m';
const mockToken: RefreshToken = {
  createdAt: new Date(Date.now() - 10000),
  expiresAt: new Date(Date.now() - 1000),
  id: '-1',
  revoked: false,
  tokenHash: 'refresh-hash',
  updatedAt: new Date(Date.now() - 10000),
  userId: -1,
};

const mockUser: User = {
  id: 1,
  email: 'rotate@test.com',
  password: 'hash',
  firstName: 'A',
  lastName: 'B',
  isAdmin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const configService = {
  get: jest.fn(
    (key: string) =>
      ({
        JWT_ACCESS_SECRET: 'test-secret-32-characters-long!!',
        HMAC_TOKEN_SECRET: 'test-hmac-secret-32-characters!!',
      })[key],
  ),
};

describe('TokenService', () => {
  let tokenService: TokenService;
  let db: DeepMockProxy<PrismaProvider>;
  let jwtService: DeepMockProxy<JwtService>;
  let config: DeepMockProxy<ConfigService>;
  beforeEach(async () => {
    db = mockDeep<PrismaProvider>();
    jwtService = mockDeep<JwtService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: PrismaProvider, useValue: db },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
  });

  describe('rotate token', () => {
    it("UnauthorizedException when token doesn't exist", () => {
      db.refreshToken.findUnique.mockResolvedValue(null);

      expect(tokenService.rotateRefreshToken(mockRawToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('UnauthorizedException when token expired', () => {
      const hashToken = jest
        .spyOn(tokenService, 'hashToken')
        .mockReturnValue(mockRawToken);
      db.refreshToken.findUnique.mockResolvedValue(mockToken);

      expect(tokenService.rotateRefreshToken(mockRawToken)).rejects.toThrow(
        UnauthorizedException,
      );

      hashToken.mockRestore();
    });
    it('UnauthorizedException when token revoked', () => {
      const hashToken = jest
        .spyOn(tokenService, 'hashToken')
        .mockReturnValue(mockRawToken);
      db.refreshToken.findUnique.mockResolvedValue({
        createdAt: new Date(Date.now() - 10000),
        expiresAt: new Date(Date.now() + 100000),
        id: '-1',
        tokenHash: 'refresh-hash',
        updatedAt: new Date(Date.now() - 10000),
        userId: -1,
        revoked: true,
      });

      expect(tokenService.rotateRefreshToken(mockRawToken)).rejects.toThrow(
        UnauthorizedException,
      );

      hashToken.mockRestore();
    });

    it('deletes the old token and issues a new access/refresh pair', async () => {
      const hashToken = jest
        .spyOn(tokenService, 'hashToken')
        .mockReturnValue(mockRawToken);
      const validToken: RefreshToken & { user: User } = {
        createdAt: new Date(Date.now() - 10000),
        expiresAt: new Date(Date.now() + 100000),
        id: 'token-1',
        tokenHash: 'refresh-hash',
        updatedAt: new Date(Date.now() - 10000),
        userId: mockUser.id,
        revoked: false,
        user: mockUser,
      };
      db.refreshToken.findUnique.mockResolvedValue(validToken);
      db.refreshToken.create.mockResolvedValue(mockToken);
      jwtService.sign.mockReturnValue('new-access-token');

      const result = await tokenService.rotateRefreshToken(mockRawToken);

      expect(db.refreshToken.delete).toHaveBeenCalledWith({
        where: { id: validToken.id },
      });
      expect(result.accessToken).toBe('new-access-token');
      expect(typeof result.refreshToken).toBe('string');

      hashToken.mockRestore();
    });
  });

  describe('hashToken', () => {
    it('is deterministic and input-sensitive', () => {
      const first = tokenService.hashToken(mockRawToken);
      const second = tokenService.hashToken(mockRawToken);
      const different = tokenService.hashToken('some-other-raw-token');

      expect(first).toBe(second);
      expect(first).not.toBe(different);
    });
  });

  describe('generateAccessToken', () => {
    it('signs the payload with the access secret and a 15m expiry', () => {
      jwtService.sign.mockReturnValue('signed-jwt');

      const result = tokenService.generateAccessToken(
        mockUser.id,
        mockUser.email,
      );

      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: mockUser.id, email: mockUser.email },
        { secret: 'test-secret-32-characters-long!!', expiresIn: '15m' },
      );
      expect(result).toBe('signed-jwt');
    });
  });

  describe('generateRefreshToken', () => {
    it('persists only the hash and returns the raw token', async () => {
      db.refreshToken.create.mockResolvedValue(mockToken);

      const rawToken = await tokenService.generateRefreshToken(mockUser.id);
      const createArgs = db.refreshToken.create.mock.calls[0][0];

      expect(createArgs.data.tokenHash).toBe(tokenService.hashToken(rawToken));
      expect(createArgs.data.tokenHash).not.toBe(rawToken);
      expect(createArgs.data.userId).toBe(mockUser.id);
    });
  });
});
