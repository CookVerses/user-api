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

    test('should correctly return list of users', async () => {
      getListOfUsersSpy.mockResolvedValue(users);
      await expect(usersService.getListOfUsers()).resolves.toEqual(users);
    });
  });
});
