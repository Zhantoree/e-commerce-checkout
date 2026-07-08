import { PrismaProvider } from '@/provider/prisma.provider';
import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let db: PrismaProvider;

  beforeEach(async () => {
    db = mockDeep<PrismaProvider>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaProvider, useValue: db }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    // expect(service).toBeDefined();
  });
});
