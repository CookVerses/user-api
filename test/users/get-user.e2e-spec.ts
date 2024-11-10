import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';
import { UsersService } from '../../src/user/users.service';

import { initializeTestDb, setupDataSource } from '../_utils_/db.util';

describe('#UsersController (e2e)', () => {
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

  describe('GET /users', () => {
    describe('when user is authenticated', () => {
      afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
      });

      it('should throw INTERNAL_SERVER_ERROR if unexpected error happened', async () => {
        jest
          .spyOn(app.get(UsersService), 'getListOfUsers')
          .mockRejectedValue(new Error('Unexpected Error'));

        const { body } = await request(app.getHttpServer())
          .get('/users')
          .expect(500);

        expect(body).toEqual({
          code: 'INTERNAL_SERVER_ERROR',
          status: 500,
          message: 'Unexpected Error',
          details: expect.any(String),
        });
      });

      describe('success case', () => {
        it('should correctly return a list of users', async () => {
          const { body } = await request(app.getHttpServer())
            .get('/users')
            .expect(200);

          expect(body).toEqual([
            {
              id: '3a572a4b-6290-4682-ad3b-7908c3d87595',
              username: 'user',
              firstName: 'Phạm',
              lastName: 'Cường',
              gender: 'nam',
              email: 'cuong@cookverse.com',
              role: 'user',
              dateOfBirth: '2003-01-03T18:30:00.000Z',
              phoneNumber: '0909090909',
              createdAt: '2024-11-10T07:10:25.091Z',
              updatedAt: '2024-11-10T07:10:25.091Z',
            },
          ]);
        });
      });
    });
  });
});
