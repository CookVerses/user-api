import { DataSource, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { UserEntity } from '../user/user.entity';
import { AuthService } from './auth.service';

import { clearDataSource, setupDataSource } from '../../test/_utils_/db.util';
import { users } from '../../test/_fixtures_/users.fixtures';
import { UserToken } from '../../test/_fixtures_/jwt-token.fixture';
import { ApiError } from '../errors/exceptions';

describe('[auth] Authentication Service', () => {
  let dataSource: DataSource;
  let userRepo: Repository<UserEntity>;
  let jwtService: JwtService;

  let authService: AuthService;

  let jwtSpy: jest.SpyInstance;
  let findOneUserSpy: jest.SpyInstance;

  beforeAll(async () => {
    dataSource = await setupDataSource();
    jwtService = new JwtService();
    userRepo = dataSource.getRepository(UserEntity);

    authService = new AuthService(jwtService, userRepo);

    jwtSpy = jest.spyOn(jwtService, 'sign').mockReturnValue(UserToken);
    findOneUserSpy = jest.spyOn(userRepo, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await clearDataSource(dataSource);
  });

  describe('[signIn] Authentication Service', () => {
    it('should throw throw forbidden if user is not found', async () => {
      findOneUserSpy.mockResolvedValue(undefined);

      await expect(
        authService.signIn(users[0].username, users[0].password),
      ).rejects.toThrow(new ApiError('FORBIDDEN', 'User does not exist'));

      expect(jwtSpy).not.toHaveBeenCalled();
    });
  });

  it('should throw throw forbidden if password is incorrect', async () => {
    findOneUserSpy.mockResolvedValue(users[0]);

    await expect(authService.signIn(users[0].username, '123')).rejects.toThrow(
      new ApiError('FORBIDDEN', 'Invalid password'),
    );

    expect(jwtSpy).not.toHaveBeenCalled();
  });

  it('should return JWT token when credentials are valid', async () => {
    findOneUserSpy.mockResolvedValue(users[0]);

    const result = await authService.signIn(
      users[0].username,
      users[0].password,
    );

    expect(result).toEqual({ token: UserToken });
    expect(findOneUserSpy.mock.calls).toEqual([
      [
        {
          select: {
            id: true,
            username: true,
            password: true,
            firstName: true,
            lastName: true,
            role: true,
          },
          where: { username: users[0].username },
        },
      ],
    ]);
    expect(jwtSpy).toHaveBeenCalledWith({
      userId: users[0].id,
      username: users[0].username,
      firstName: users[0].firstName,
      lastName: users[0].lastName,
      role: users[0].role,
    });
  });
});
