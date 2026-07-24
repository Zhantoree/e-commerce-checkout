import { PrismaService } from '@/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UserService } from './user.service';
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
describe('UserService', () => {
  let service: UserService;
  let db: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    db = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: db }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('getUser', () => {
    it('looks up a user by email', async () => {
      db.user.findUnique.mockResolvedValue(mockedUser);

      const result = await service.getUser({ email: mockedUser.email });

      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockedUser.email },
      });
      expect(result).toEqual(mockedUser);
    });
  });
});
