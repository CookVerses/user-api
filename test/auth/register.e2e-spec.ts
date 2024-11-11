import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';
import { UserEntity } from '../../src/user/user.entity';

import { initializeTestDb, setupDataSource } from '../_utils_/db.util';
import { users } from '../_fixtures_/users.fixtures';
import { Gender } from '../../src/constants/enums/gender.enum';

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

  describe('POST /auth/register', () => {
    it('should return BAD_REQUEST if the request body is missing', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .expect(400)
        .expect({
          code: 'BAD_REQUEST',
          status: 400,
          message: [
            'username must be a string',
            'username should not be empty',
            'password must be a string',
            'password should not be empty',
            'firstName must be a string',
            'firstName should not be empty',
            'lastName must be a string',
            'lastName should not be empty',
            'gender must be one of the following values: nam, nữ',
            'email must be an email',
            'email should not be empty',
          ],
        });
    });

    it('should return BAD_REQUEST if username already exists', async () => {
      const existingUser = users[0];

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: existingUser.username,
          password: 'test',
          firstName: 'Test',
          lastName: 'Test',
          gender: Gender.MALE,
          email: 'test@example.com',
        })
        .expect(400)
        .expect({
          code: 'BAD_REQUEST',
          status: 400,
          message: 'Username or email already exists',
        });
    });

    it('should return BAD_REQUEST if email already exists', async () => {
      const existingUser = users[0];

      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: 'test',
          password: 'test',
          firstName: 'Test',
          lastName: 'Test',
          gender: Gender.MALE,
          email: existingUser.email,
        })
        .expect(400)
        .expect({
          code: 'BAD_REQUEST',
          status: 400,
          message: 'Username or email already exists',
        });
    });

    it('should successfully register a new user', async () => {
      const newUser = {
        username: 'test',
        password: 'test',
        firstName: 'Test',
        lastName: 'Test',
        gender: Gender.MALE,
        email: 'test@example.com',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toEqual({
        message: 'User registered successfully',
      });

      const createdUser = await dataSource
        .getRepository(UserEntity)
        .findOne({ where: { username: newUser.username } });

      expect(createdUser).toBeDefined();
      expect(createdUser.username).toBe(newUser.username);
      expect(createdUser.email).toBe(newUser.email);
      expect(createdUser.firstName).toBe(newUser.firstName);
      expect(createdUser.lastName).toBe(newUser.lastName);
      expect(createdUser.gender).toBe(newUser.gender);
      expect(createdUser.createdAt).toBeDefined();
      expect(createdUser.updatedAt).toBeDefined();
    });
  });
});
