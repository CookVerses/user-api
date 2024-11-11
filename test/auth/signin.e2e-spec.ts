import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/auth/auth.service';
import { UserEntity } from '../../src/user/user.entity';

import { initializeTestDb, setupDataSource } from '../_utils_/db.util';
import { users } from '../_fixtures_/users.fixtures';
import { UserToken } from '../_fixtures_/jwt-token.fixture';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = await setupDataSource();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    await initializeTestDb(dataSource);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('POST /auth/login ', () => {
    it('should return BAD_REQUEST if the request body is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .expect(400)
        .expect({
          code: 'BAD_REQUEST',
          status: 400,
          message: [
            'username must be a string',
            'Missing username',
            'password must be a string',
            'Missing password',
          ],
        });
    });

    it('should return BAD_REQUEST if the request body does not match the format', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 1234, password: 1234 })
        .expect(400)
        .expect({
          code: 'BAD_REQUEST',
          status: 400,
          message: ['username must be a string', 'password must be a string'],
        });
    });

    describe('when request body is correct', () => {
      let authService: AuthService;
      let loginSpy: jest.SpyInstance;

      beforeAll(() => {
        authService = app.get(AuthService);
        loginSpy = jest.spyOn(authService, 'signIn');
        loginSpy.mockImplementation(async () => ({ token: UserToken }));
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should return jwt token when credentials are valid', async () => {
        const testUser = users[0];

        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            username: testUser.username,
            password: testUser.password,
          })
          .expect(200);

        expect(response.body).toEqual({ token: UserToken });
        expect(loginSpy).toHaveBeenCalledWith(
          testUser.username,
          testUser.password,
        );
        expect(await dataSource.getRepository(UserEntity).count()).toBe(1);
      });
    });
  });
});
