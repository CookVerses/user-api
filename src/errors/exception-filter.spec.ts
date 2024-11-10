import { Test, TestingModule } from '@nestjs/testing';
import { HttpAdapterHost } from '@nestjs/core';
import {
  INestApplication,
  Module,
  Controller,
  Post,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as request from 'supertest';
import { RouterModule } from 'nest-router';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

import { AllExceptionsFilter } from '../errors/exception-filter';
import { ApiError } from './exceptions';
import { TYPEORM_ERROR_CODE } from './typeorm-error-code';

describe('AllExceptionsFilter', () => {
  let testModule: TestingModule;
  let app: INestApplication;

  let handler: any;

  beforeEach(async () => {
    @Controller()
    class FakeController {
      @Post()
      async fake() {
        await handler();
      }
    }

    @Module({
      controllers: [FakeController],
    })
    class FakeModule {}

    testModule = await Test.createTestingModule({
      imports: [
        FakeModule,
        RouterModule.forRoutes([
          {
            path: '/fake',
            module: FakeModule,
          },
        ]),
      ],
      controllers: [FakeController],
    }).compile();

    app = testModule.createNestApplication();
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    await app.init();
  });

  it('transform a Nest HttpException to ApiError', async () => {
    handler = async () => {
      throw new ApiError('TOKEN_INVALID');
    };

    const res = await request(app.getHttpServer())
      .post('/fake')
      .send()
      .expect(401);

    expect(res.body).toEqual({
      code: 'TOKEN_INVALID',
      status: 401,
    });
  });

  it('transform a Nest HttpException to ApiError', async () => {
    handler = async () => {
      throw new BadRequestException('this is wrong!');
    };

    const res = await request(app.getHttpServer())
      .post('/fake')
      .send()
      .expect(400);

    expect(res.body).toEqual({
      code: 'BAD_REQUEST',
      status: 400,
      message: 'this is wrong!',
    });
  });

  it('transform a Not Found exception to ApiError', async () => {
    handler = async () => {
      throw new NotFoundException('User not found');
    };

    const res = await request(app.getHttpServer())
      .post('/fake')
      .send()
      .expect(404);

    expect(res.body).toEqual({
      code: 'NOT_FOUND',
      status: 404,
      message: 'User not found',
    });
  });

  it('transform a TypeORM EntityNotFoundError to ApiError', async () => {
    handler = async () => {
      throw new EntityNotFoundError('User', {
        id: 1,
      });
    };

    const res = await request(app.getHttpServer())
      .post('/fake')
      .send()
      .expect(404);

    expect(res.body).toEqual({
      code: 'NOT_FOUND',
      status: 404,
      message:
        'Could not find any entity of type "User" matching: {\n    "id": 1\n}',
    });
  });

  it('transform a regular exception to ApiError', async () => {
    handler = async () => {
      throw new Error('woe is me, what happened?');
    };

    const res = await request(app.getHttpServer())
      .post('/fake')
      .send()
      .expect(500);

    expect(res.body).toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
      status: 500,
    });
  });

  it('transform a QueryFailedError with UNIQUE_CONSTRAINT to ApiError', async () => {
    const queryFailedError = new QueryFailedError(
      'INSERT INTO users (email) VALUES ($1)',
      ['user@example.com'],
      new Error(
        'duplicate key value violates unique constraint "users_email_unique"',
      ),
    );
    (queryFailedError as any).code = TYPEORM_ERROR_CODE.UNIQUE_CONSTRAINT;

    handler = async () => {
      throw queryFailedError;
    };

    const res = await request(app.getHttpServer())
      .post('/fake')
      .send()
      .expect(409);

    expect(res.body).toEqual({
      code: 'CONFLICT',
      status: 409,
      message:
        'duplicate key value violates unique constraint "users_email_unique"',
    });
  });

  it('transform a QueryFailedError with FOREIGN_KEY_CONSTRAINT to ApiError', async () => {
    const errMsg =
      'insert or update on table "users" violates foreign key constraint';
    const queryFailedError = new QueryFailedError(
      'INSERT INTO users (email) VALUES ($1)',
      ['user@example.com'],
      new Error(errMsg),
    );
    (queryFailedError as any).code = TYPEORM_ERROR_CODE.FOREIGN_KEY_CONSTRAINT;
    (queryFailedError as any).detail = errMsg;

    handler = async () => {
      throw queryFailedError;
    };

    const res = await request(app.getHttpServer())
      .post('/fake')
      .send()
      .expect(404);

    expect(res.body).toEqual({
      code: 'NOT_FOUND',
      status: 404,
      message: errMsg,
    });
  });

  it('transform a non-exception to ApiError', async () => {
    handler = async () => {
      throw 'what am I even doing' as any;
    };

    const res = await request(app.getHttpServer())
      .post('/fake')
      .send()
      .expect(500);

    expect(res.body).toEqual({
      code: 'INTERNAL_SERVER_ERROR',
      status: 500,
    });
  });
});
