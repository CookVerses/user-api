import { DataSource, Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

import { clearDataSource, setupDataSource } from '../../test/_utils_/db.util';
import { users } from '../../test/_fixtures_/users.fixtures';

describe('[users] Users Service', () => {
  let dataSource: DataSource;
  let usersRepo: Repository<UserEntity>;

  let usersService: UsersService;

  beforeAll(async () => {
    dataSource = await setupDataSource();
    usersRepo = dataSource.getRepository(UserEntity);

    usersService = new UsersService(usersRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await clearDataSource(dataSource);
  });

  describe('#getListOfUsers', () => {
    let getListOfUsersSpy: jest.SpyInstance;

    beforeAll(() => {
      getListOfUsersSpy = jest.spyOn(usersRepo, 'find');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should correctly return list of users', async () => {
      getListOfUsersSpy.mockResolvedValue(users);

      await expect(usersService.getListOfUsers()).resolves.toEqual({ users });

      expect(getListOfUsersSpy.mock.calls).toEqual([
        [
          {
            relations: ['subscriptions'],
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              username: true,
              phoneNumber: true,
              dateOfBirth: true,
              gender: true,
              role: true,
              subscriptions: {
                id: true,
                name: true,
                startDate: true,
                endDate: true,
                status: true,
              },
            },
          },
        ],
      ]);
    });
  });

  describe('#getUserById', () => {
    let getUserByIdSpy: jest.SpyInstance;

    beforeAll(() => {
      getUserByIdSpy = jest.spyOn(usersRepo, 'findOneOrFail');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should correctly return users detail', async () => {
      getUserByIdSpy.mockResolvedValue(users[0]);
      await expect(usersService.getUserById(users[0].id)).resolves.toEqual({
        user: users[0],
      });

      expect(getUserByIdSpy.mock.calls).toEqual([
        [
          {
            relations: ['subscriptions'],
            where: {
              id: users[0].id,
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              username: true,
              phoneNumber: true,
              dateOfBirth: true,
              gender: true,
              role: true,
              subscriptions: {
                id: true,
                name: true,
                startDate: true,
                endDate: true,
                status: true,
              },
            },
          },
        ],
      ]);
    });
  });
});
