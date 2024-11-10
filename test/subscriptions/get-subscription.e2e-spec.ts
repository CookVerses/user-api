import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';
import { SubscriptionsService } from '../../src/subscription/subscriptions.service';

import { initializeTestDb, setupDataSource } from '../_utils_/db.util';
import { UserToken } from '../_fixtures_/jwt-token.fixture';

describe('#SubscriptionsController (e2e)', () => {
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

  describe('GET /subscriptions', () => {
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
          .spyOn(app.get(SubscriptionsService), 'getListOfSubscriptions')
          .mockRejectedValue(new Error('Unexpected Error'));

        const { body } = await request(app.getHttpServer())
          .get('/subscriptions')
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
        it('should correctly return a list of subscriptions', async () => {
          const { body } = await request(app.getHttpServer())
            .get('/subscriptions')
            .set('Authorization', `Bearer ${UserToken}`)
            .expect(200);

          expect(body).toEqual([
            {
              id: 'e5d33c13-b2f2-432a-97c3-844690150ed3',
              name: 'Basic',
              status: 'Đang hoạt động',
              startDate: '2022-11-17T18:30:00.000Z',
              endDate: '2022-11-24T18:30:00.000Z',
              createdAt: '2022-11-17T18:30:00.000Z',
              updatedAt: '2022-11-17T18:30:00.000Z',
            },
            {
              id: '5cb97020-000e-40fa-a610-1176a7984d6a',
              name: 'Gold',
              status: 'Không hoạt động',
              startDate: '2022-11-17T18:30:00.000Z',
              endDate: '2022-12-17T18:30:00.000Z',
              createdAt: '2022-11-17T18:30:00.000Z',
              updatedAt: '2022-11-17T18:30:00.000Z',
            },
            {
              id: 'e5d33c13-b2f2-432a-97c3-844690150fd9',
              name: 'Premium',
              status: 'Đã hủy',
              startDate: '2022-11-17T18:30:00.000Z',
              endDate: '2023-02-17T18:30:00.000Z',
              createdAt: '2022-11-17T18:30:00.000Z',
              updatedAt: '2022-11-17T18:30:00.000Z',
            },
          ]);
        });
      });
    });
  });
});
