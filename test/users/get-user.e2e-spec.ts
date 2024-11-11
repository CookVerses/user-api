import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';
import { UsersService } from '../../src/user/users.service';

import { initializeTestDb, setupDataSource } from '../_utils_/db.util';
import { UserToken } from '../_fixtures_/jwt-token.fixture';

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
    it('should return UNAUTHORIZED if token is missing', () => {
      return request(app.getHttpServer())
        .get('/subscriptions')
        .expect(401)
        .expect({ code: 'UNAUTHORIZED', status: 401, message: 'Unauthorized' });
    });

    it('should return UNAUTHORIZED if token is incorrect', () => {
      return request(app.getHttpServer())
        .get('/subscriptions')
        .set('Authorization', 'Bearer token')
        .expect(401)
        .expect({ code: 'UNAUTHORIZED', status: 401, message: 'Unauthorized' });
    });

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
          .set('Authorization', `Bearer ${UserToken}`)
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
            .set('Authorization', `Bearer ${UserToken}`)
            .expect(200);

          expect(body).toEqual({
            users: [
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
                subscriptions: [
                  {
                    endDate: '2022-11-24T18:30:00.000Z',
                    id: 'e5d33c13-b2f2-432a-97c3-844690150ed3',
                    name: 'Basic',
                    startDate: '2022-11-17T18:30:00.000Z',
                    status: 'Đang hoạt động',
                  },
                  {
                    endDate: '2022-12-17T18:30:00.000Z',
                    id: '5cb97020-000e-40fa-a610-1176a7984d6a',
                    name: 'Gold',
                    startDate: '2022-11-17T18:30:00.000Z',
                    status: 'Không hoạt động',
                  },
                  {
                    endDate: '2023-02-17T18:30:00.000Z',
                    id: 'e5d33c13-b2f2-432a-97c3-844690150fd9',
                    name: 'Premium',
                    startDate: '2022-11-17T18:30:00.000Z',
                    status: 'Đã hủy',
                  },
                ],
              },
            ],
          });
        });

        it('should correctly return users detail', async () => {
          const { body } = await request(app.getHttpServer())
            .get('/users/3a572a4b-6290-4682-ad3b-7908c3d87595')
            .set('Authorization', `Bearer ${UserToken}`)
            .expect(200);

          expect(body).toEqual({
            user: {
              id: '3a572a4b-6290-4682-ad3b-7908c3d87595',
              username: 'user',
              firstName: 'Phạm',
              lastName: 'Cường',
              gender: 'nam',
              email: 'cuong@cookverse.com',
              role: 'user',
              dateOfBirth: '2003-01-03T18:30:00.000Z',
              phoneNumber: '0909090909',
              subscriptions: [
                {
                  endDate: '2022-11-24T18:30:00.000Z',
                  id: 'e5d33c13-b2f2-432a-97c3-844690150ed3',
                  name: 'Basic',
                  startDate: '2022-11-17T18:30:00.000Z',
                  status: 'Đang hoạt động',
                },
                {
                  endDate: '2022-12-17T18:30:00.000Z',
                  id: '5cb97020-000e-40fa-a610-1176a7984d6a',
                  name: 'Gold',
                  startDate: '2022-11-17T18:30:00.000Z',
                  status: 'Không hoạt động',
                },
                {
                  endDate: '2023-02-17T18:30:00.000Z',
                  id: 'e5d33c13-b2f2-432a-97c3-844690150fd9',
                  name: 'Premium',
                  startDate: '2022-11-17T18:30:00.000Z',
                  status: 'Đã hủy',
                },
              ],
            },
          });
        });
      });
    });
  });
});
